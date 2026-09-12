/**
 * Konkan Railway scraper service.
 *
 * Polls the upstream VisualTrain page at most once every 30 seconds,
 * parses the HTML table with Cheerio, diffs against cache, and broadcasts
 * updates over WebSocket. Never exposes the upstream directly to clients.
 *
 * Compliance:
 *  - Min interval: 30s (configurable via SCRAPE_INTERVAL_MS env)
 *  - User-Agent: identifies this scraper clearly
 *  - Cache-first: stale data served rather than erroring
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import cron from 'node-cron';
import https from 'https';
import { WebSocketServer, WebSocket } from 'ws';
import { TrainPosition, TrainCategory, Direction, ScrapeResult } from './types';
import {
  setTrains, markScrapeFailure, getAllTrains, recordHistory, getCacheStatus
} from './cache';
import { findStationByName, STATION_BY_CODE, STATIONS, ROUTE_TOTAL_KM } from './stations';

import crypto from 'crypto';
// Allow legacy TLS renegotiation (konkanrailway.com uses older SSL)
const httpsAgent = new https.Agent({ secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT });



// ──────────────────────────────────────────────────────────────────────────────
// Config
// ──────────────────────────────────────────────────────────────────────────────

const UPSTREAM_URL =
  process.env.UPSTREAM_URL ??
  'https://konkanrailway.com/VisualTrain/otrktp0100Table.jsp';

const FALLBACK_URL =
  'https://konkanrailway.com/VisualTrain/';

const SCRAPE_INTERVAL_MS =
  Math.max(30_000, parseInt(process.env.SCRAPE_INTERVAL_MS ?? '30000', 10));

const USER_AGENT =
  `KonkanRailLive/1.0 (unofficial fan project; contact: ${process.env.CONTACT_EMAIL ?? 'sanketbobhate07@gmail.com'})`;

// ──────────────────────────────────────────────────────────────────────────────
// WebSocket broadcast
// ──────────────────────────────────────────────────────────────────────────────

let wss: WebSocketServer | null = null;

export function attachWebSocketServer(server: WebSocketServer): void {
  wss = server;
}

function broadcast(payload: object): void {
  if (!wss) return;
  const msg = JSON.stringify(payload);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// Category + direction inference
// ──────────────────────────────────────────────────────────────────────────────

const SUPERFAST_PREFIXES = ['12', '22'];
const PREMIUM_PREFIXES   = ['10', '20']; // Rajdhani/Shatabdi/Tejas/Vande Bharat range

function inferCategory(trainNumber: string, trainName: string): TrainCategory {
  const name = trainName.toUpperCase();
  if (name.includes('GOODS') || name.includes('RORO') || name.includes('FRT')) return 'goods';
  if (
    name.includes('RAJDHANI') || name.includes('SHATABDI') ||
    name.includes('TEJAS')    || name.includes('VANDE BHARAT') ||
    name.includes('DURONTO')
  ) return 'premium';

  const prefix2 = trainNumber.slice(0, 2);
  if (PREMIUM_PREFIXES.includes(prefix2)) return 'premium';
  if (SUPERFAST_PREFIXES.includes(prefix2)) return 'superfast';
  if (name.includes('EXPRESS') || name.includes('EXP')) return 'express';
  if (name.includes('PASSENGER') || name.includes('PASS')) return 'passenger';

  // Default to express for numbered trains in the 10000–19999 range
  const num = parseInt(trainNumber, 10);
  if (num >= 10000 && num <= 19999) return 'express';
  return 'passenger';
}

/**
 * Konkan Railway convention: even train numbers go South (Roha → Mangalore = "down"),
 * odd numbers go North (Mangalore → Roha = "up").
 * This is the standard Indian Railways convention for Southern direction = even.
 */
export function inferDirection(trainNumber: string): Direction {
  return parseInt(trainNumber, 10) % 2 === 0 ? 'down' : 'up';
}

// ──────────────────────────────────────────────────────────────────────────────
// Time + delay parsing helpers
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Parse time strings like "10:35", "10.35", "1035", "10 35" → "HH:MM"
 */
function parseTime(raw: string): string {
  if (!raw) return '';
  const cleaned = raw.replace(/[.\s]/g, ':').trim();
  const m = cleaned.match(/(\d{1,2}):?(\d{2})/);
  if (!m) return raw.trim();
  return `${m[1].padStart(2, '0')}:${m[2]}`;
}

/**
 * Parse delay string like "1:9" (hh:mm), "0:40", "+15 min", "15", "-5 (EARLY)", etc.
 * Returns delay in minutes (negative = early).
 */
export function parseDelay(raw: string): number {
  if (!raw) return 0;
  const cleaned = raw.trim();
  const sign = cleaned.includes('-') || cleaned.toUpperCase().includes('EARLY') ? -1 : 1;

  // Format hh:mm or h:mm (e.g. "1:9" = 69 min, "0:40" = 40 min, "5:45" = 345 min, "0:00" = 0)
  const hmMatch = cleaned.match(/(\d+)\s*:\s*(\d+)/);
  if (hmMatch) {
    const hours = parseInt(hmMatch[1], 10);
    const mins = parseInt(hmMatch[2], 10);
    return sign * (hours * 60 + mins);
  }

  // Fallback: "+15 min", "15", etc.
  const numMatch = cleaned.match(/\d+/);
  if (numMatch) {
    return sign * parseInt(numMatch[0], 10);
  }
  return 0;
}

// ──────────────────────────────────────────────────────────────────────────────
// HTML parser
// ──────────────────────────────────────────────────────────────────────────────

export function parseTrainsFromHtml(html: string, scrapedAt: Date): ScrapeResult {
  const $ = cheerio.load(html);
  const trains: TrainPosition[] = [];

  // Extract upstream "last updated" timestamp from the page header
  let upstreamTs = scrapedAt.toISOString();
  $('body').find('*').each((_, el) => {
    const text = $(el).text();
    const m = text.match(/last\s*updated\s*(?:time)?\s*[:\-]?\s*([\d\s:/A-Za-z,]+)/i);
    if (m && m[1]) {
      const parsed = new Date(m[1].trim());
      if (!isNaN(parsed.getTime())) {
        upstreamTs = parsed.toISOString();
      }
    }
  });

  // Search through all table rows for train records
  $('table').find('tr').each((_, row) => {
    const cells = $(row).find('td, th').map((_, td) => $(td).text().trim().replace(/\s+/g, ' ')).get();
    if (cells.length < 4) return;

    let trainNumber = '';
    let trainName = '';
    let statusRaw = '';
    let stationRaw = '';
    let timeRaw = '';
    let delayRaw = '';

    const firstCell = cells[0];
    if (/^\d{4,5}$/.test(firstCell)) {
      trainNumber = firstCell;
      trainName = cells[1] ?? '';

      // Determine whether cell[2] or cell[3] is Station vs Status
      const st2 = findStationByName(cells[2] ?? '');
      const st3 = findStationByName(cells[3] ?? '');

      if (st3 && !st2) {
        // Official upstream KR format: Col 2 = Status ('ARRIVED'/'LEFT'), Col 3 = Station ('SAWARDA')
        statusRaw = cells[2] ?? '';
        stationRaw = cells[3] ?? '';
        timeRaw = cells[4] ?? '';
        delayRaw = cells[5] ?? '';
      } else if (st2) {
        // Col 2 = Station, Col 3 = Status
        stationRaw = cells[2] ?? '';
        statusRaw = cells[3] ?? '';
        timeRaw = cells[4] ?? '';
        delayRaw = cells[5] ?? '';
      } else {
        const c2Up = (cells[2] ?? '').toUpperCase();
        if (c2Up.includes('ARR') || c2Up.includes('DEP') || c2Up.includes('LEFT')) {
          statusRaw = cells[2] ?? '';
          stationRaw = cells[3] ?? '';
        } else {
          stationRaw = cells[2] ?? '';
          statusRaw = cells[3] ?? '';
        }
        timeRaw = cells[4] ?? '';
        delayRaw = cells[5] ?? '';
      }
    } else {
      // Alternate: cell combined e.g. "12133 MANGALA LTD EXP"
      const m = firstCell.match(/^(\d{4,5})\s+(.+)/);
      if (m) {
        trainNumber = m[1];
        trainName = m[2];
        const remaining = cells.slice(1);
        const st0 = findStationByName(remaining[0] ?? '');
        const st1 = findStationByName(remaining[1] ?? '');
        if (st1 && !st0) {
          statusRaw = remaining[0] ?? '';
          stationRaw = remaining[1] ?? '';
          timeRaw = remaining[2] ?? '';
          delayRaw = remaining[3] ?? '';
        } else {
          stationRaw = remaining[0] ?? '';
          statusRaw = remaining[1] ?? '';
          timeRaw = remaining[2] ?? '';
          delayRaw = remaining[3] ?? '';
        }
      } else {
        return;
      }
    }

    if (!trainNumber) return;

    const station = findStationByName(stationRaw);
    const direction = inferDirection(trainNumber);

    let status: TrainPosition['status'] = 'running';
    const statusUp = statusRaw.toUpperCase();
    if (statusUp.includes('ARR')) status = 'arrived';
    else if (statusUp.includes('DEP') || statusUp.includes('LEFT')) status = 'departed';

    const delayMinutes = parseDelay(delayRaw);
    const progressKm = station?.km ?? (direction === 'down' ? 0 : ROUTE_TOTAL_KM);
    const parsedActual = parseTime(timeRaw);

    const train: TrainPosition = {
      trainNumber,
      trainName: trainName.replace(/\s+/g, ' ').trim(),
      category: inferCategory(trainNumber, trainName),
      direction,
      lastStationCode: station?.code ?? stationRaw.toUpperCase().slice(0, 5),
      lastStationName: station?.name ?? stationRaw,
      status,
      scheduledArrival: parsedActual,
      scheduledDeparture: parsedActual,
      actualTime: parsedActual,
      delayMinutes,
      progressKm,
      lastUpdatedAt: scrapedAt.toISOString(),
      upstreamUpdatedAt: upstreamTs,
      updatedInLastScrape: true,
    };

    // Deduplicate by trainNumber
    const existingIdx = trains.findIndex(t => t.trainNumber === trainNumber);
    if (existingIdx >= 0) {
      trains[existingIdx] = train;
    } else {
      trains.push(train);
    }
  });

  return {
    trains,
    upstreamUpdatedAt: upstreamTs,
    scrapedAt: scrapedAt.toISOString(),
    success: trains.length > 0,
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// Scrape loop
// ──────────────────────────────────────────────────────────────────────────────

let lastHash = '';

async function scrapeOnce(): Promise<void> {
  const now = new Date();
  let html = '';

  try {
    const response = await axios.get(UPSTREAM_URL, {
      timeout: 15_000,
      httpsAgent,
      headers: { 'User-Agent': USER_AGENT },
    });
    html = response.data as string;
  } catch (e1) {
    // Try fallback URL
    try {
      const response = await axios.get(FALLBACK_URL, {
        timeout: 15_000,
        httpsAgent,
        headers: { 'User-Agent': USER_AGENT },
      });
      html = response.data as string;
    } catch (e2) {
      console.error('[scraper] Upstream fetch failed:', (e2 as Error).message);
      markScrapeFailure();
      broadcast({ type: 'error', message: 'Upstream fetch failed', ...getCacheStatus() });
      return;
    }
  }

  if (!html || html.length < 100) {
    console.warn('[scraper] Empty response from upstream');
    markScrapeFailure();
    return;
  }

  const result = parseTrainsFromHtml(html, now);

  if (!result.success || result.trains.length === 0) {
    console.warn('[scraper] Parsed 0 trains — upstream may have changed structure');
    markScrapeFailure();
    return;
  }

  // Simple content hash to avoid broadcasting identical data
  const newHash = result.trains.map(t => `${t.trainNumber}:${t.lastStationCode}:${t.delayMinutes}`).join('|');

  if (newHash === lastHash) {
    // No change — update timestamp but don't broadcast
    console.log(`[scraper] No change. ${result.trains.length} trains on route.`);
    return;
  }

  lastHash = newHash;

  // Mark which trains changed vs previous
  const previous = new Map(getAllTrains().map(t => [t.trainNumber, t]));
  const annotated = result.trains.map(t => ({
    ...t,
    updatedInLastScrape:
      !previous.has(t.trainNumber) ||
      previous.get(t.trainNumber)!.lastStationCode !== t.lastStationCode ||
      previous.get(t.trainNumber)!.delayMinutes !== t.delayMinutes,
  }));

  const upstreamTs = new Date(result.upstreamUpdatedAt);
  setTrains(annotated, upstreamTs);
  annotated.forEach(recordHistory);

  const status = getCacheStatus();
  console.log(`[scraper] Updated: ${result.trains.length} trains | upstream: ${result.upstreamUpdatedAt}`);

  broadcast({
    type: 'update',
    trains: annotated,
    stale: status.stale,
    lastScrapeAt: status.lastScrapeAt,
    lastUpdateAtUpstream: status.lastUpdateAtUpstream,
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// Start polling
// ──────────────────────────────────────────────────────────────────────────────

export function startScraper(): void {
  // Initial scrape immediately
  scrapeOnce().catch(console.error);

  // Then every SCRAPE_INTERVAL_MS (minimum 30s)
  const intervalSeconds = Math.max(30, Math.floor(SCRAPE_INTERVAL_MS / 1000));
  const cronExpr = `*/${intervalSeconds} * * * * *`;

  cron.schedule(cronExpr, () => {
    scrapeOnce().catch(err => {
      console.error('[scraper] Cron error:', err);
    });
  });

  console.log(`[scraper] Started. Polling every ${intervalSeconds}s. Upstream: ${UPSTREAM_URL}`);
}
