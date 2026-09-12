import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { I18nProvider } from './i18n';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { StaleBanner } from './components/StaleBanner';
import { TrackView } from './components/TrackView/TrackView';
import { TrainListTable } from './components/TrainListTable';
import { TrainDetail } from './components/TrainDetail/TrainDetail';
import { SearchBar } from './components/SearchBar';
import { FilterChips } from './components/FilterChips';
import { SkeletonLoader } from './components/SkeletonLoader';
import { useWebSocket } from './hooks/useWebSocket';
import { useTrainStore } from './store/useTrainStore';

// Code-split the map view
const MapView = lazy(() => import('./components/MapView/MapView').then(m => ({ default: m.MapView })));

function HomePage() {
  const { trainNumber, code } = useParams();
  const {
    viewMode, isLoading, trains, filteredTrains,
    selectTrain, selectStation
  } = useTrainStore();

  useEffect(() => {
    if (trainNumber) {
      selectTrain(trainNumber);
    } else if (code) {
      selectStation(code.toUpperCase());
    }
  }, [trainNumber, code, selectTrain, selectStation]);

  const filtered = filteredTrains();

  if (isLoading) return <SkeletonLoader />;

  return (
    <div>
      {/* Stats bar */}
      <div style={{
        display: 'flex', gap: '24px', flexWrap: 'wrap',
        padding: '12px 16px',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        fontSize: '0.8rem', color: 'var(--text-muted)',
      }}>
        <span>🚂 <strong style={{ color: 'var(--text-primary)' }}>{trains.length}</strong> trains on route</span>
        <span>🟢 <strong style={{ color: '#22c55e' }}>{trains.filter(t => t.delayMinutes <= 0).length}</strong> on time</span>
        <span>🔴 <strong style={{ color: '#ef4444' }}>{trains.filter(t => t.delayMinutes > 5).length}</strong> delayed</span>
        <span>▲ <strong>{trains.filter(t => t.direction === 'up').length}</strong> northbound</span>
        <span>▼ <strong>{trains.filter(t => t.direction === 'down').length}</strong> southbound</span>
      </div>

      {/* Main view */}
      {viewMode === 'schematic' ? (
        <TrackView />
      ) : (
        <Suspense fallback={<div style={{ height: '400px', margin: '16px', borderRadius: '16px' }} className="skeleton" />}>
          <MapView />
        </Suspense>
      )}

      {/* Search + Filter toolbar */}
      <div style={{
        padding: '12px 16px',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center',
      }}>
        <SearchBar />
        <FilterChips />
      </div>

      {/* Train list */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ padding: '0 16px 8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Showing {filtered.length} of {trains.length} trains
        </div>
        <TrainListTable />
      </div>
    </div>
  );
}

function AppInner() {
  useWebSocket();

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <StaleBanner />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/train/:trainNumber" element={<HomePage />} />
          <Route path="/station/:code" element={<HomePage />} />
        </Routes>
      </main>

      <Footer />

      {/* Train detail slide-over (rendered at root level for portal effect) */}
      <TrainDetail />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <AppInner />
      </I18nProvider>
    </BrowserRouter>
  );
}
