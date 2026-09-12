// Shared TypeScript interfaces for Konkan Rail Live

export interface Station {
  code: string;        // Official IR station code (e.g. "ROHA", "RN", "MAO")
  name: string;        // English display name
  nameHi: string;      // Hindi name (Devanagari)
  km: number;          // Distance from Roha in km
  lat: number;         // Latitude
  lng: number;         // Longitude
  type: 'major' | 'minor';
  state: 'Maharashtra' | 'Goa' | 'Karnataka';
  index: number;       // Sequential index 0..69 (matches upstream st0..st69)
}

export type TrainCategory = 'passenger' | 'express' | 'superfast' | 'premium' | 'goods';
export type Direction = 'up' | 'down'; // up = Mangalore→Roha, down = Roha→Mangalore
export type TrainStatus = 'arrived' | 'departed' | 'running' | 'not-started' | 'terminated';

export interface TrainPosition {
  trainNumber: string;
  trainName: string;
  category: TrainCategory;
  direction: Direction;
  lastStationCode: string;
  lastStationName: string;
  status: TrainStatus;
  scheduledArrival: string;   // "HH:MM" or empty
  scheduledDeparture: string; // "HH:MM" or empty
  actualTime: string;         // "HH:MM" or empty
  delayMinutes: number;       // negative = early
  progressKm: number;         // interpolated km from Roha
  lastUpdatedAt: string;      // ISO 8601
  upstreamUpdatedAt: string;  // ISO 8601 (from source page)
  updatedInLastScrape: boolean;
}

export interface TrainHistory {
  trainNumber: string;
  snapshots: Array<{
    timestamp: string;
    delayMinutes: number;
    stationCode: string;
  }>;
}

export interface ScrapeResult {
  trains: TrainPosition[];
  upstreamUpdatedAt: string;
  scrapedAt: string;
  success: boolean;
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  stale: boolean;
  staleSinceMinutes: number;
  lastScrapeAt: string;
  lastUpdateAtUpstream: string;
  error?: string;
}

export interface HealthResponse {
  status: 'ok' | 'degraded';
  uptime: number;
  lastScrapeAt: string;
  lastScrapeSuccess: boolean;
  stale: boolean;
  staleSinceMinutes: number;
  trainCount: number;
  version: string;
}
