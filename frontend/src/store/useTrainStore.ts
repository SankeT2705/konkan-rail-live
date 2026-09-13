import { create } from 'zustand';
import type { TrainPosition, Theme, Language, ViewMode, FilterCategory, FilterDirection } from '../types';
import { STATIONS, type Station } from '../data/stations';
import { getEffectiveDirection } from '../lib/trainUtils';

interface TrainStore {
  // Data
  trains: TrainPosition[];
  stations: Station[];
  stale: boolean;
  staleSinceMinutes: number;
  lastScrapeAt: string;
  lastUpdateAtUpstream: string;

  // UI state
  wsConnected: boolean;
  isLoading: boolean;
  selectedTrainNumber: string | null;
  selectedStationCode: string | null;
  theme: Theme;
  language: Language;
  viewMode: ViewMode;
  searchQuery: string;
  filterCategory: FilterCategory;
  filterDirection: FilterDirection;
  showDelayedOnly: boolean;

  // Actions
  setTrains: (trains: TrainPosition[], meta: { stale: boolean; staleSinceMinutes: number; lastScrapeAt: string; lastUpdateAtUpstream: string }) => void;
  applyWsDiff: (trains: TrainPosition[], stale: boolean) => void;
  setWsConnected: (v: boolean) => void;
  setLoading: (v: boolean) => void;
  selectTrain: (num: string | null) => void;
  selectStation: (code: string | null) => void;
  setTheme: (t: Theme) => void;
  setLanguage: (l: Language) => void;
  setViewMode: (m: ViewMode) => void;
  setSearch: (q: string) => void;
  setFilterCategory: (c: FilterCategory) => void;
  setFilterDirection: (d: FilterDirection) => void;
  setShowDelayedOnly: (v: boolean) => void;

  // Derived
  filteredTrains: () => TrainPosition[];
}

const savedTheme = (localStorage.getItem('kr-theme') as Theme) ?? 'dark';
const savedLanguage = (localStorage.getItem('kr-lang') as Language) ?? 'en';

function getInitialCachedTrains(): { trains: TrainPosition[]; lastScrapeAt: string } {
  try {
    const raw = localStorage.getItem('kr-trains-cache');
    if (!raw) return { trains: [], lastScrapeAt: '' };
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.trains) && parsed.trains.length > 0) {
      return {
        trains: parsed.trains.map((t: TrainPosition) => ({ ...t, direction: getEffectiveDirection(t) })),
        lastScrapeAt: parsed.lastScrapeAt ?? '',
      };
    }
  } catch (_) {}
  return { trains: [], lastScrapeAt: '' };
}

const initialCached = typeof window !== 'undefined' ? getInitialCachedTrains() : { trains: [], lastScrapeAt: '' };

export const useTrainStore = create<TrainStore>((set, get) => ({
  trains: initialCached.trains,
  stations: STATIONS,
  stale: initialCached.trains.length > 0,
  staleSinceMinutes: 0,
  lastScrapeAt: initialCached.lastScrapeAt,
  lastUpdateAtUpstream: '',
  wsConnected: false,
  isLoading: initialCached.trains.length === 0,
  selectedTrainNumber: null,
  selectedStationCode: null,
  theme: savedTheme,
  language: savedLanguage,
  viewMode: 'schematic',
  searchQuery: '',
  filterCategory: 'all',
  filterDirection: 'all',
  showDelayedOnly: false,

  setTrains: (trains, meta) => {
    const processed = trains.map(t => ({ ...t, direction: getEffectiveDirection(t) }));
    try {
      localStorage.setItem('kr-trains-cache', JSON.stringify({
        trains: processed,
        lastScrapeAt: meta.lastScrapeAt,
        cachedAt: Date.now(),
      }));
    } catch (_) {}
    set({
      trains: processed,
      stale: meta.stale,
      staleSinceMinutes: meta.staleSinceMinutes,
      lastScrapeAt: meta.lastScrapeAt,
      lastUpdateAtUpstream: meta.lastUpdateAtUpstream,
      isLoading: false,
    });
  },

  applyWsDiff: (trains, stale) => {
    const processed = trains.map(t => ({ ...t, direction: getEffectiveDirection(t) }));
    try {
      localStorage.setItem('kr-trains-cache', JSON.stringify({
        trains: processed,
        lastScrapeAt: new Date().toISOString(),
        cachedAt: Date.now(),
      }));
    } catch (_) {}
    set({
      trains: processed,
      stale,
      isLoading: false,
    });
  },

  setWsConnected: (v) => set({ wsConnected: v }),
  setLoading: (v) => set({ isLoading: v }),
  selectTrain: (num) => set({ selectedTrainNumber: num, selectedStationCode: null }),
  selectStation: (code) => set({ selectedStationCode: code, selectedTrainNumber: null }),

  setTheme: (t) => {
    localStorage.setItem('kr-theme', t);
    document.documentElement.setAttribute('data-theme', t);
    set({ theme: t });
  },

  setLanguage: (l) => {
    localStorage.setItem('kr-lang', l);
    set({ language: l });
  },

  setViewMode: (m) => set({ viewMode: m }),
  setSearch: (q) => set({ searchQuery: q }),
  setFilterCategory: (c) => set({ filterCategory: c }),
  setFilterDirection: (d) => set({ filterDirection: d }),
  setShowDelayedOnly: (v) => set({ showDelayedOnly: v }),

  filteredTrains: () => {
    const { trains, searchQuery, filterCategory, filterDirection, showDelayedOnly } = get();
    let result = [...trains];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.trainNumber.includes(q) ||
        t.trainName.toLowerCase().includes(q) ||
        t.lastStationName.toLowerCase().includes(q)
      );
    }

    if (filterCategory !== 'all') {
      result = result.filter(t => t.category === filterCategory);
    }

    if (filterDirection !== 'all') {
      result = result.filter(t => t.direction === filterDirection);
    }

    if (showDelayedOnly) {
      result = result.filter(t => t.delayMinutes > 0);
    }

    return result;
  },
}));

// Apply saved theme immediately on load
document.documentElement.setAttribute('data-theme', savedTheme);
