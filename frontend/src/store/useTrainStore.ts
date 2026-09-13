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
  isRestConnected: boolean;
  lastSuccessfulFetchAt: number;
  fetchError: string | null;
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
  setIsRestConnected: (v: boolean) => void;
  setFetchError: (err: string | null) => void;
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

export const useTrainStore = create<TrainStore>((set, get) => ({
  trains: [],
  stations: STATIONS,
  stale: false,
  staleSinceMinutes: 0,
  lastScrapeAt: '',
  lastUpdateAtUpstream: '',
  wsConnected: false,
  isRestConnected: false,
  lastSuccessfulFetchAt: 0,
  fetchError: null,
  isLoading: true,
  selectedTrainNumber: null,
  selectedStationCode: null,
  theme: savedTheme,
  language: savedLanguage,
  viewMode: 'schematic',
  searchQuery: '',
  filterCategory: 'all',
  filterDirection: 'all',
  showDelayedOnly: false,

  setTrains: (trains, meta) => set({
    trains: trains.map(t => ({ ...t, direction: getEffectiveDirection(t) })),
    stale: meta.stale,
    staleSinceMinutes: meta.staleSinceMinutes,
    lastScrapeAt: meta.lastScrapeAt,
    lastUpdateAtUpstream: meta.lastUpdateAtUpstream,
    isLoading: false,
    isRestConnected: true,
    lastSuccessfulFetchAt: Date.now(),
    fetchError: null,
  }),

  applyWsDiff: (trains, stale) => set({
    trains: trains.map(t => ({ ...t, direction: getEffectiveDirection(t) })),
    stale,
    isLoading: false,
    lastSuccessfulFetchAt: Date.now(),
  }),

  setWsConnected: (v) => set({ wsConnected: v }),
  setIsRestConnected: (v) => set({ isRestConnected: v }),
  setFetchError: (err) => set({ fetchError: err }),
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
