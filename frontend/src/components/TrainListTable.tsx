import { motion } from 'framer-motion';
import { useTrainStore } from '../store/useTrainStore';
import { useT } from '../i18n';
import { getRouteProgress, getDirectionDetails } from '../lib/trainUtils';

const CATEGORY_COLORS: Record<string, string> = {
  passenger: '#3b82f6',
  express:   '#ef4444',
  superfast: '#22c55e',
  premium:   '#d946ef',
  goods:     '#64748b',
};

export function TrainListTable() {
  const t = useT();
  const { filteredTrains, selectTrain, selectedTrainNumber, language } = useTrainStore();
  const trains = filteredTrains();

  if (trains.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px 16px',
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
      }}>
        🚫 {t.noTrains}
      </div>
    );
  }

  return (
    <div style={{ padding: '0 16px 16px' }}>

      {/* ── Mobile Card View (< 640px) ────────────────────────────────────────── */}
      <div className="show-mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {trains.map((train, i) => {
          const isSelected = selectedTrainNumber === train.trainNumber;
          const color = CATEGORY_COLORS[train.category] ?? '#3b82f6';
          const routeProgress = getRouteProgress(train, language);
          const dirDetails = getDirectionDetails(train.direction, language);
          const delayColor = train.delayMinutes > 5 ? '#ef4444' : train.delayMinutes < 0 ? '#22c55e' : 'var(--text-muted)';

          return (
            <motion.div
              key={`mobile-${train.trainNumber}-${i}`}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => selectTrain(isSelected ? null : train.trainNumber)}
              className="glass"
              style={{
                borderRadius: '14px',
                padding: '14px 16px',
                border: isSelected ? `2px solid ${color}` : '1px solid var(--border-subtle)',
                background: isSelected ? `${color}14` : 'var(--bg-card)',
                boxShadow: isSelected ? `0 0 16px ${color}33` : 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    color: dirDetails.color,
                    background: dirDetails.badgeBg,
                    border: `1px solid ${dirDetails.badgeBorder}`,
                    padding: '2px 8px',
                    borderRadius: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <span>{dirDetails.arrow}</span>
                    <span>{dirDetails.shortText}</span>
                  </span>
                  <span className={`badge badge-${train.category}`}>{train.category}</span>
                </div>
                <div style={{
                  fontWeight: '800', fontSize: '0.8rem', color: delayColor,
                  background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '8px'
                }}>
                  {train.delayMinutes === 0 ? 'On time' : train.delayMinutes > 0 ? `+${train.delayMinutes}m` : `${train.delayMinutes}m`}
                </div>
              </div>

              <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                #{train.trainNumber} · {train.trainName}
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', marginTop: '2px', fontWeight: '700' }}>
                {routeProgress.sourceName} ➔ {routeProgress.destName}
              </div>

              {/* Progress mini indicator */}
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                  <span>{routeProgress.coveredKm} km covered</span>
                  <span>{routeProgress.progressPercent}%</span>
                  <span>{routeProgress.totalRouteKm} km total</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${routeProgress.progressPercent}%`, height: '100%', background: color, borderRadius: '2px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>📍 Last: </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{train.lastStationName}</strong>
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ textTransform: 'capitalize' }}>{train.status}</span>: {train.actualTime || '—'}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Desktop Table View (>= 641px) ────────────────────────────────────── */}
      <div className="hide-mobile" style={{
        borderRadius: '16px', overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
      }}>
        {/* Header row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '120px 1.3fr 1.3fr 130px 90px 90px 85px',
          gap: '0',
          padding: '12px 16px',
          background: 'var(--bg-elevated)',
          fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)',
          letterSpacing: '0.05em', textTransform: 'uppercase',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <span>{t.trainNumber}</span>
          <span>{t.trainName}</span>
          <span>Origin ➔ Destination</span>
          <span>{t.lastStation}</span>
          <span>{t.status}</span>
          <span>Actual</span>
          <span>{t.delay}</span>
        </div>

        {/* Train rows */}
        {trains.map((train, i) => {
          const isSelected = selectedTrainNumber === train.trainNumber;
          const color = CATEGORY_COLORS[train.category] ?? '#3b82f6';
          const routeProgress = getRouteProgress(train, language);
          const dirDetails = getDirectionDetails(train.direction, language);
          const delayColor = train.delayMinutes > 5 ? '#ef4444' : train.delayMinutes < 0 ? '#22c55e' : 'var(--text-muted)';

          return (
            <motion.div
              key={`${train.trainNumber}-${i}`}
              id={`list-train-${train.trainNumber}`}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.015 }}
              onClick={() => selectTrain(isSelected ? null : train.trainNumber)}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1.3fr 1.3fr 130px 90px 90px 85px',
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                background: isSelected
                  ? `${color}15`
                  : train.updatedInLastScrape
                  ? 'rgba(255,255,255,0.015)'
                  : 'transparent',
                borderLeft: isSelected ? `4px solid ${color}` : '4px solid transparent',
                transition: 'background 150ms, border-left 150ms',
                alignItems: 'center',
              }}
              onMouseEnter={e => {
                if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
              }}
              onMouseLeave={e => {
                if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '900',
                  color: dirDetails.color,
                  background: dirDetails.badgeBg,
                  padding: '1px 5px',
                  borderRadius: '4px',
                }}>
                  {dirDetails.arrow}
                </span>
                <span style={{ fontWeight: '800', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                  {train.trainNumber}
                </span>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {train.trainName}
                </div>
                <span className={`badge badge-${train.category}`} style={{ marginTop: '3px' }}>
                  {train.category}
                </span>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-teal)', fontWeight: '700' }}>
                  {routeProgress.sourceName} ➔ {routeProgress.destName}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {routeProgress.coveredKm} / {routeProgress.totalRouteKm} km ({routeProgress.progressPercent}%)
                </div>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <strong>{train.lastStationName}</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                  KR {routeProgress.krSectorKm} km
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {train.status}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {train.actualTime || '—'}
              </div>
              <div style={{ fontWeight: '800', fontSize: '0.85rem', color: delayColor }}>
                {train.delayMinutes === 0 ? 'On time'
                  : train.delayMinutes > 0 ? `+${train.delayMinutes}m`
                  : `${train.delayMinutes}m`}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
