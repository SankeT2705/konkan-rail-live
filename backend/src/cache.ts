/**
 * In-memory cache + sql.js history store for Konkan Rail Live.
 * sql.js is a pure-JS WebAssembly port of SQLite — no native build needed.
 * History is used only for delay sparklines.
 */

import { TrainPosition } from './types';

// ──────────────────────────────────────────────────────────────────────────────
// Primary in-memory cache (latest scrape snapshot)
// ──────────────────────────────────────────────────────────────────────────────

let _trains: Map<string, TrainPosition> = new Map();
let _lastScrapeAt: Date | null = null;
let _lastScrapeSuccess = false;
let _upstreamUpdatedAt: Date | null = null;
const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

export function setTrains(trains: TrainPosition[], upstreamTs: Date): void {
  const newMap = new Map<string, TrainPosition>();
  trains.forEach(t => newMap.set(t.trainNumber, t));
  _trains = newMap;
  _lastScrapeAt = new Date();
  _lastScrapeSuccess = true;
  _upstreamUpdatedAt = upstreamTs;
}

export function markScrapeFailure(): void {
  _lastScrapeAt = new Date();
  _lastScrapeSuccess = false;
}

export function getAllTrains(): TrainPosition[] {
  return Array.from(_trains.values());
}

export function getTrainByNumber(num: string): TrainPosition | undefined {
  return _trains.get(num);
}

export function getTrainsByStationCode(code: string): TrainPosition[] {
  const upper = code.toUpperCase();
  return getAllTrains().filter(t => t.lastStationCode.toUpperCase() === upper);
}

export function getCacheStatus() {
  const now = Date.now();
  const lastMs = _lastScrapeAt ? now - _lastScrapeAt.getTime() : Infinity;
  const stale = lastMs > STALE_THRESHOLD_MS || !_lastScrapeSuccess;
  return {
    lastScrapeAt: _lastScrapeAt?.toISOString() ?? '',
    lastScrapeSuccess: _lastScrapeSuccess,
    lastUpdateAtUpstream: _upstreamUpdatedAt?.toISOString() ?? '',
    stale,
    staleSinceMinutes: stale ? Math.floor(lastMs / 60000) : 0,
    trainCount: _trains.size,
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// In-memory history store (no persistence — keeps last N snapshots per train)
// ──────────────────────────────────────────────────────────────────────────────

interface HistoryRow {
  timestamp: string;
  delay_minutes: number;
  station_code: string;
  actual_time?: string;
  status?: string;
}

const MAX_HISTORY = 20;

// Simple in-memory structure: trainNumber → circular array of snapshots
const _history = new Map<string, HistoryRow[]>();

export function recordHistory(train: TrainPosition): void {
  const existing = _history.get(train.trainNumber) ?? [];
  existing.unshift({
    timestamp: train.lastUpdatedAt,
    delay_minutes: train.delayMinutes,
    station_code: train.lastStationCode,
    actual_time: train.actualTime,
    status: train.status,
  });
  if (existing.length > MAX_HISTORY) existing.length = MAX_HISTORY;
  _history.set(train.trainNumber, existing);
}

export function getHistory(trainNumber: string): HistoryRow[] {
  return _history.get(trainNumber) ?? [];
}
