// Shared TypeScript types for frontend

export type TrainCategory = 'passenger' | 'express' | 'superfast' | 'premium' | 'goods';
export type Direction = 'up' | 'down';
export type TrainStatus = 'arrived' | 'departed' | 'running' | 'not-started' | 'terminated';

export interface TrainPosition {
  trainNumber: string;
  trainName: string;
  category: TrainCategory;
  direction: Direction;
  lastStationCode: string;
  lastStationName: string;
  status: TrainStatus;
  scheduledArrival: string;
  scheduledDeparture: string;
  actualTime: string;
  delayMinutes: number;
  progressKm: number;
  lastUpdatedAt: string;
  upstreamUpdatedAt: string;
  updatedInLastScrape: boolean;
  history?: HistorySnapshot[];
}

export interface HistorySnapshot {
  timestamp: string;
  delay_minutes: number;
  station_code: string;
  actual_time?: string;  // Actual reported time at this station (HH:mm)
  status?: string;       // API status string: 'arrived' | 'departed' | 'running'
}

export interface ApiTrainsResponse {
  success: boolean;
  data: TrainPosition[];
  stale: boolean;
  staleSinceMinutes: number;
  lastScrapeAt: string;
  lastUpdateAtUpstream: string;
}

export type Theme = 'dark' | 'light' | 'high-contrast';
export type Language = 'en' | 'hi';
export type ViewMode = 'schematic' | 'map';
export type FilterCategory = TrainCategory | 'all';
export type FilterDirection = Direction | 'all';
