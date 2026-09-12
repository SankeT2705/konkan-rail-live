import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrainStore } from '../../store/useTrainStore';
import { useT } from '../../i18n';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import type { TrainPosition } from '../../types';
import { getRouteProgress, getDirectionDetails, formatDelay } from '../../lib/trainUtils';
import { TrainJourneyTimeline } from './TrainJourneyTimeline';
import { API_URL } from '../../lib/api';

const CATEGORY_COLORS: Record<string, string> = {
  passenger: '#3b82f6',
  express:   '#ef4444',
  superfast: '#22c55e',
  premium:   '#d946ef',
  goods:     '#64748b',
};

function DelaySparkline({ history }: { history: NonNullable<TrainPosition['history']> }) {
  if (!history || history.length < 2) return null;
  const data = [...history].reverse().map(h => ({
    t: new Date(h.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    delay: h.delay_minutes,
  }));
  return (
    <div style={{ height: '65px', marginTop: '8px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone" dataKey="delay"
            stroke="#3b9eff" strokeWidth={2.5} dot={{ r: 3, fill: '#3b9eff' }}
          />
          <Tooltip
            contentStyle={{
              background: '#0f172a',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#f8fafc'
            }}
            formatter={(v: any) => [`${Number(v) > 0 ? '+' : ''}${v} min`, 'Delay']}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrainDetail() {
  const t = useT();
  const navigate = useNavigate();
  const { selectedTrainNumber, trains, selectTrain, language } = useTrainStore();
  const [copied, setCopied] = useState(false);
  const [fetchedHistory, setFetchedHistory] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 640 : false
  );

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 640);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const train = trains.find(t => t.trainNumber === selectedTrainNumber);

  useEffect(() => {
    if (!selectedTrainNumber) {
      setFetchedHistory([]);
      return;
    }
    fetch(`${API_URL}/api/trains/${selectedTrainNumber}`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data?.history) {
          setFetchedHistory(res.data.history);
        }
      })
      .catch(() => {});
  }, [selectedTrainNumber]);

  function handleClose() {
    selectTrain(null);
    if (window.location.pathname.startsWith('/train/')) {
      navigate('/');
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/train/${train?.trainNumber}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const activeHistory = (train?.history && train.history.length > 0) ? train.history : fetchedHistory;

  if (!train) return null;

  const routeProgress = getRouteProgress(train, language);
  const dirDetails = getDirectionDetails(train.direction, language);
  const categoryColor = CATEGORY_COLORS[train.category] ?? '#3b82f6';

  return (
    <AnimatePresence>
      {train && (
        <>
          {/* Backdrop */}
          <motion.div
            className="panel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Slide-over panel / Drawer (bottom sheet on mobile, slide-right on desktop) */}
          <motion.div
            id="train-detail-panel"
            className="train-detail-drawer"
            initial={{
              y: isMobile ? '100%' : 0,
              x: isMobile ? 0 : '100%',
            }}
            animate={{ y: 0, x: 0 }}
            exit={{
              y: isMobile ? '100%' : 0,
              x: isMobile ? 0 : '100%',
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            style={{
              position: 'fixed',
              background: 'var(--bg-surface)',
              zIndex: 1000,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: isMobile ? '0 -10px 40px rgba(0,0,0,0.7)' : '-12px 0 40px rgba(0,0,0,0.6)',
            }}
          >
            {/* Mobile Pull Handle Indicator */}
            {isMobile && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '10px 0 4px',
                  cursor: 'pointer',
                  background: 'var(--bg-elevated)',
                }}
                onClick={handleClose}
              >
                <div style={{ width: '42px', height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.3)' }} />
              </div>
            )}

            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--bg-elevated)',
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  {/* Category + Direction Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span className={`badge badge-${train.category}`} style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {train.category}
                    </span>

                    {/* Highly prominent Direction Banner */}
                    <span style={{
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      color: dirDetails.color,
                      background: dirDetails.badgeBg,
                      border: `1.5px solid ${dirDetails.badgeBorder}`,
                      padding: '3px 10px',
                      borderRadius: '8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: `0 0 10px ${dirDetails.color}33`,
                    }}>
                      <span style={{ fontSize: '0.9rem' }}>{dirDetails.arrow}</span>
                      <span>{dirDetails.subText}</span>
                    </span>
                  </div>

                  {/* Train Number & Name */}
                  <div style={{ fontWeight: '900', fontSize: '1.4rem', color: 'var(--text-primary)', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>#{train.trainNumber}</span>
                    <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', fontWeight: '700', color: 'var(--text-secondary)' }}>
                      Live
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: '700', marginTop: '2px' }}>
                    {train.trainName}
                  </div>
                </div>

                <button
                  id="close-train-detail"
                  className="btn btn-ghost"
                  onClick={handleClose}
                  aria-label="Close detail panel"
                  style={{
                    padding: '8px 14px',
                    fontSize: '1.2rem',
                    lineHeight: 1,
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >✕</button>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Origin -> Destination Route Distance & Journey Card */}
              <div
                className="glass"
                style={{
                  borderRadius: '16px',
                  padding: '18px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'var(--bg-elevated)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                }}
              >
                {/* Source & Destination Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '800' }}>
                      SOURCE (ORIGIN)
                    </div>
                    <div style={{ fontWeight: '800', fontSize: '1.05rem', color: '#ffffff', marginTop: '3px' }}>
                      {routeProgress.sourceName}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--accent-teal)', fontWeight: '700', marginTop: '1px' }}>
                      0 km mark
                    </div>
                  </div>

                  <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.3rem', color: dirDetails.color }}>➔</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: '800', color: dirDetails.color, textTransform: 'uppercase' }}>
                      {dirDetails.tag}
                    </span>
                  </div>

                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '800' }}>
                      DESTINATION
                    </div>
                    <div style={{ fontWeight: '800', fontSize: '1.05rem', color: '#ffffff', marginTop: '3px' }}>
                      {routeProgress.destName}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--accent-teal)', fontWeight: '700', marginTop: '1px' }}>
                      Total {routeProgress.totalRouteKm} km
                    </div>
                  </div>
                </div>

                {/* Animated Visual Route Progress Bar */}
                <div style={{ position: 'relative', margin: '14px 0 10px' }}>
                  <div style={{ height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                    <motion.div
                      style={{
                        height: '100%',
                        background: `linear-gradient(90deg, ${categoryColor}, var(--accent-teal))`,
                        borderRadius: '6px',
                        boxShadow: `0 0 14px ${dirDetails.color}66`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(4, routeProgress.progressPercent)}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                    />
                  </div>
                  {/* Current train pinpoint indicator */}
                  <div style={{
                    position: 'absolute',
                    top: '-3px',
                    left: `${Math.min(98, Math.max(2, routeProgress.progressPercent))}%`,
                    transform: 'translateX(-50%)',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    border: `3px solid ${categoryColor}`,
                    boxShadow: '0 0 8px rgba(0,0,0,0.8), 0 0 8px var(--accent-teal)',
                  }} />
                </div>

                {/* Distance Covered / Remaining Stats */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.78rem', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    📍 At <strong>{train.lastStationName}</strong>
                  </span>
                  <span style={{
                    color: '#ffffff',
                    fontWeight: '800',
                    background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-teal))',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  }}>
                    {routeProgress.coveredKm} km covered ({routeProgress.progressPercent}%)
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>
                    {routeProgress.remainingKm} km left
                  </span>
                </div>

                {/* Konkan Railway Sector Context */}
                <div style={{
                  marginTop: '12px',
                  paddingTop: '8px',
                  borderTop: '1px dashed var(--border-subtle)',
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span>🛤️ Konkan Railway Track:</span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>
                    km {routeProgress.krSectorKm} of 738 km (Roha ➔ Surathkal)
                  </span>
                </div>
              </div>

              {/* Current Station & Timings Card */}
              <div className="glass" style={{ borderRadius: '16px', padding: '18px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Live Timetable & Delay Status
                </div>
                <div style={{ fontWeight: '800', fontSize: '1.2rem', marginBottom: '14px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.4rem' }}>📍</span>
                  <span>{train.lastStationName}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    (KR {routeProgress.krSectorKm} km)
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>Status</div>
                    <div style={{ fontWeight: '800', fontSize: '0.95rem', textTransform: 'capitalize', color: '#ffffff', marginTop: '2px' }}>
                      {train.status === 'arrived' ? '🟢 Arrived' : train.status === 'departed' ? '🔵 Departed' : '🟡 In Transit'}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>Actual Reported Time</div>
                    <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#ffffff', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                      {train.actualTime || '—'}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>Scheduled Time</div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                      {train.scheduledDeparture || '—'}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>Punctuality</div>
                    <div style={{
                      fontWeight: '800', fontSize: '0.95rem', marginTop: '2px',
                      color: train.delayMinutes > 5 ? '#ef4444' : train.delayMinutes < 0 ? '#22c55e' : '#38bdf8',
                    }}>
                      {train.delayMinutes === 0 ? '✅ On Time'
                        : train.delayMinutes > 0 ? `🔴 ${formatDelay(train.delayMinutes, { showUnit: 'long', lang: language })}`
                        : `🟢 ${formatDelay(train.delayMinutes, { showUnit: 'long', lang: language })}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphical Where Is My Train Journey */}
              <TrainJourneyTimeline train={train} language={language} />

              {/* Delay Trend Sparkline */}
              {activeHistory && activeHistory.length >= 2 && (
                <div className="glass" style={{ borderRadius: '16px', padding: '18px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    📈 {t.delayTrend}
                  </div>
                  <DelaySparkline history={activeHistory} />
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button
                  className="btn btn-primary"
                  onClick={copyLink}
                  style={{
                    flex: 1,
                    padding: '12px',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {copied ? `✅ ${t.linkCopied}` : `🔗 ${t.copyLink}`}
                </button>
              </div>

              {/* Sync Timestamp Info */}
              <div style={{ marginTop: 'auto', fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', paddingTop: '10px' }}>
                Konkan Railway Official Sync: {train.upstreamUpdatedAt
                  ? new Date(train.upstreamUpdatedAt).toLocaleTimeString('en-IN')
                  : 'Recent'}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
