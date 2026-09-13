import https from 'https';
import crypto from 'crypto';
import * as cheerio from 'cheerio';
import fallbackData from '../src/data/fallbackTrains.json';
import { STATIONS } from '../src/data/stations';

// Legacy TLS agent for Konkan Railway
const httpsAgent = new https.Agent({
  secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

const UPSTREAM_URL = 'https://konkanrailway.com/VisualTrain/otrktp0100Table.jsp';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 (KonkanRailLive/1.0)';

// In-memory cache across serverless function invocations on warm containers
let memoryCache: {
  trains: any[];
  stale: boolean;
  staleSinceMinutes: number;
  lastScrapeAt: string;
  lastUpdateAtUpstream: string;
  cachedAt: number;
} | null = null;

const CACHE_TTL_MS = 25_000;

function findStationByName(rawName: string) {
  const norm = rawName.trim().toLowerCase().replace(/\s+/g, ' ');
  const exact = STATIONS.find(s => s.name.toLowerCase() === norm || s.code.toLowerCase() === norm);
  if (exact) return exact;
  return STATIONS.find(s => s.name.toLowerCase().includes(norm) || norm.includes(s.name.toLowerCase()));
}

function parseDelay(raw: string): number {
  if (!raw) return 0;
  const cleaned = raw.trim();
  const isNeg = cleaned.startsWith('-');
  const sign = isNeg ? -1 : 1;
  const hmMatch = cleaned.match(/(\d+):(\d+)/);
  if (hmMatch) {
    return sign * (parseInt(hmMatch[1], 10) * 60 + parseInt(hmMatch[2], 10));
  }
  const numMatch = cleaned.match(/\d+/);
  return numMatch ? sign * parseInt(numMatch[0], 10) : 0;
}

function parseTime(raw: string): string {
  const m = raw.match(/(\d{1,2}:\d{2})/);
  return m ? m[1] : '';
}

function inferCategory(trainNumber: string, trainName: string): 'express' | 'superfast' | 'premium' | 'passenger' | 'goods' {
  const name = trainName.toUpperCase();
  if (name.includes('GOODS') || name.includes('RORO') || name.includes('FRT')) return 'goods';
  if (name.includes('RAJDHANI') || name.includes('SHATABDI') || name.includes('TEJAS') || name.includes('VANDE BHARAT') || name.includes('DURONTO')) return 'premium';
  const prefix2 = trainNumber.slice(0, 2);
  if (['10', '20'].includes(prefix2)) return 'premium';
  if (['12', '22'].includes(prefix2)) return 'superfast';
  if (name.includes('EXPRESS') || name.includes('EXP')) return 'express';
  if (name.includes('PASSENGER') || name.includes('PASS')) return 'passenger';
  return 'express';
}

function inferDirection(trainNumber: string, trainName: string): 'up' | 'down' {
  const name = trainName.toUpperCase();
  const pairMatch = name.match(/([A-Z]{2,4})\s*[-–]\s*([A-Z]{2,4})/);
  if (pairMatch) {
    const s1 = pairMatch[1];
    const s2 = pairMatch[2];
    const northCodes = ['CSMT', 'LTT', 'DR', 'BDTS', 'BSR', 'PUNE', 'NZM', 'NDLS', 'HSR', 'ASR', 'CDG', 'ROHA'];
    const southCodes = ['MAO', 'MAJN', 'MAQ', 'KAWR', 'UD', 'TVC', 'ERS', 'KCVL', 'CAN', 'CLT', 'SRTK'];
    if (northCodes.includes(s1) && southCodes.includes(s2)) return 'down';
    if (southCodes.includes(s1) && northCodes.includes(s2)) return 'up';
  }
  const lastDigit = parseInt(trainNumber.slice(-1), 10);
  if (!isNaN(lastDigit)) {
    return lastDigit % 2 === 0 ? 'up' : 'down';
  }
  return 'down';
}

function parseHtml(html: string, scrapedAt: Date) {
  const $ = cheerio.load(html);
  const trains: any[] = [];
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
      const st2 = findStationByName(cells[2] ?? '');
      const st3 = findStationByName(cells[3] ?? '');

      if (st3 && !st2) {
        statusRaw = cells[2] ?? '';
        stationRaw = cells[3] ?? '';
        timeRaw = cells[4] ?? '';
        delayRaw = cells[5] ?? '';
      } else if (st2) {
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
      const m = firstCell.match(/^(\d{4,5})\s+(.+)/);
      if (m) {
        trainNumber = m[1];
        trainName = m[2];
        const rem = cells.slice(1);
        const st0 = findStationByName(rem[0] ?? '');
        const st1 = findStationByName(rem[1] ?? '');
        if (st1 && !st0) {
          statusRaw = rem[0] ?? '';
          stationRaw = rem[1] ?? '';
          timeRaw = rem[2] ?? '';
          delayRaw = rem[3] ?? '';
        } else {
          stationRaw = rem[0] ?? '';
          statusRaw = rem[1] ?? '';
          timeRaw = rem[2] ?? '';
          delayRaw = rem[3] ?? '';
        }
      } else {
        return;
      }
    }

    if (!trainNumber) return;

    const station = findStationByName(stationRaw);
    const direction = inferDirection(trainNumber, trainName);

    let status: 'running' | 'arrived' | 'departed' = 'running';
    const statusUp = statusRaw.toUpperCase();
    if (statusUp.includes('ARR')) status = 'arrived';
    else if (statusUp.includes('DEP') || statusUp.includes('LEFT')) status = 'departed';

    const delayMinutes = parseDelay(delayRaw);
    const progressKm = station?.km ?? (direction === 'down' ? 0 : 738);
    const parsedActual = parseTime(timeRaw);

    const train = {
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

    const existingIdx = trains.findIndex(t => t.trainNumber === trainNumber);
    if (existingIdx >= 0) {
      trains[existingIdx] = train;
    } else {
      trains.push(train);
    }
  });

  return { trains, upstreamTs };
}

function fetchUpstream(): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      UPSTREAM_URL,
      {
        agent: httpsAgent,
        headers: { 'User-Agent': USER_AGENT },
        timeout: 8000,
      },
      res => {
        let html = '';
        res.on('data', c => (html += c));
        res.on('end', () => resolve(html));
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Upstream timeout'));
    });
  });
}

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // Check in-memory cache
  const now = Date.now();
  if (memoryCache && now - memoryCache.cachedAt < CACHE_TTL_MS && memoryCache.trains.length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, s-maxage=25, stale-while-revalidate=50');
    res.statusCode = 200;
    res.end(JSON.stringify(memoryCache));
    return;
  }

  try {
    const html = await fetchUpstream();
    const scrapedAt = new Date();
    const parsed = parseHtml(html, scrapedAt);

    if (parsed.trains.length > 0) {
      memoryCache = {
        trains: parsed.trains,
        stale: false,
        staleSinceMinutes: 0,
        lastScrapeAt: scrapedAt.toISOString(),
        lastUpdateAtUpstream: parsed.upstreamTs,
        cachedAt: now,
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'public, s-maxage=25, stale-while-revalidate=50');
      res.statusCode = 200;
      res.end(JSON.stringify(memoryCache));
      return;
    }
  } catch (err: any) {
    console.warn('[serverless /api/trains] Fetch/parse failed:', err.message);
  }

  // Fallback if upstream is empty or error
  if (memoryCache && memoryCache.trains.length > 0) {
    const elapsedMinutes = Math.floor((now - memoryCache.cachedAt) / 60000);
    const staleResponse = {
      ...memoryCache,
      stale: true,
      staleSinceMinutes: elapsedMinutes,
    };
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=30');
    res.statusCode = 200;
    res.end(JSON.stringify(staleResponse));
    return;
  }

  // Final fallback to pre-bundled snapshot
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
  res.statusCode = 200;
  res.end(JSON.stringify(fallbackData));
}
