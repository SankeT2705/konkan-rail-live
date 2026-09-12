import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TrainPosition } from '../../types';
import { useTrainStore } from '../../store/useTrainStore';
import { getRouteProgress, getDirectionDetails } from '../../lib/trainUtils';

const CATEGORY_COLORS: Record<string, string> = {
  passenger: '#3b82f6',
  express:   '#ef4444',
  superfast: '#22c55e',
  premium:   '#d946ef',
  goods:     '#64748b',
};

interface TrainMarkerProps {
  train: TrainPosition;
  x: number;
  trackTop: number;
  tier: number;
  yOffset: number;
}

export function TrainMarker({ train, x, trackTop, tier, yOffset }: TrainMarkerProps) {
  const { selectTrain, selectedTrainNumber, language } = useTrainStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const isSelected = selectedTrainNumber === train.trainNumber;
  const color = CATEGORY_COLORS[train.category] ?? '#888';

  // Pulse for 3 cycles when updatedInLastScrape
  const [pulsing, setPulsing] = useState(train.updatedInLastScrape);
  useEffect(() => {
    if (train.updatedInLastScrape) {
      setPulsing(true);
      const t = setTimeout(() => setPulsing(false), 5000);
      return () => clearTimeout(t);
    }
  }, [train.updatedInLastScrape, train.lastUpdatedAt]);

  const delayColor = train.delayMinutes > 5
    ? '#ef4444'
    : train.delayMinutes < 0
    ? '#22c55e'
    : '#38bdf8';

  const isDown = train.direction === 'down';
  const routeProgress = getRouteProgress(train, language);
  const dirDetails = getDirectionDetails(train.direction, language);

  // Position tooltip safely towards the middle track space so it NEVER clips at top or bottom borders
  // Down trains (above track) open downwards; Up trains (below track) open upwards
  const tooltipOpensDown = isDown || yOffset < 0;

  // Calculate connector line length from pill to the track line
  const connectorLength = isDown ? Math.abs(yOffset) - 18 : yOffset - 2;

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${trackTop + yOffset}px`,
        zIndex: showTooltip ? 95 : isSelected ? 40 : 15 + tier,
      }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 60, damping: 20 }}
    >
      {/* Anchor dot on the track line */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        top: isDown ? `${Math.abs(yOffset) - 3}px` : `${-yOffset - 3}px`,
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 8px ${color}`,
        zIndex: 5,
      }} />

      {/* Vertical connector line from train pill to track line */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        top: isDown ? '22px' : `${-connectorLength}px`,
        width: '1.5px',
        height: `${Math.max(4, connectorLength)}px`,
        background: `linear-gradient(${isDown ? 'to bottom' : 'to top'}, ${color}, ${color}44)`,
        opacity: 0.85,
        pointerEvents: 'none',
      }} />

      {/* Train pill button */}
      <motion.div
        id={`train-${train.trainNumber}`}
        onClick={() => {
          selectTrain(isSelected ? null : train.trainNumber);
          setShowTooltip(false);
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.1, y: isDown ? -2 : 2 }}
        whileTap={{ scale: 0.95 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '3px 9px',
          borderRadius: '16px',
          background: isSelected ? `${color}33` : '#0b1120',
          border: `2px solid ${color}`,
          color: '#ffffff',
          fontSize: '0.7rem',
          fontWeight: '800',
          cursor: 'pointer',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          outline: isSelected ? `2px solid var(--accent-teal)` : 'none',
          outlineOffset: '2px',
          boxShadow: isSelected
            ? `0 0 16px 4px ${color}99`
            : pulsing
            ? `0 0 14px 4px ${color}aa`
            : `0 4px 12px rgba(0,0,0,0.6)`,
          transform: 'translateX(-50%)',
        }}
      >
        <span style={{
          color: dirDetails.color,
          fontSize: '0.78rem',
          fontWeight: '900',
          background: dirDetails.badgeBg,
          padding: '1px 3px',
          borderRadius: '4px',
        }}>
          {dirDetails.arrow}
        </span>
        <span style={{ letterSpacing: '0.03em', fontFamily: 'var(--font-mono)' }}>
          {train.trainNumber}
        </span>
      </motion.div>

      {/* Hover tooltip with guaranteed zero-clipping positioning */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: tooltipOpensDown ? 8 : -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: tooltipOpensDown ? 8 : -8, scale: 0.96 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute',
              top: tooltipOpensDown ? 'calc(100% + 10px)' : undefined,
              bottom: !tooltipOpensDown ? 'calc(100% + 10px)' : undefined,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#090e1a',
              border: `1.5px solid ${color}aa`,
              borderRadius: '14px',
              padding: '12px 14px',
              minWidth: '240px',
              boxShadow: '0 16px 36px rgba(0,0,0,0.8), 0 0 16px rgba(0,0,0,0.5)',
              zIndex: 110,
              pointerEvents: 'none',
            }}
          >
            {/* Header & Direction Tag */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{
                background: color, color: '#ffffff', fontSize: '10px',
                fontWeight: '800', padding: '1px 7px', borderRadius: '6px', textTransform: 'uppercase'
              }}>
                {train.category}
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: '900',
                color: dirDetails.color,
                background: dirDetails.badgeBg,
                padding: '2px 6px',
                borderRadius: '6px',
                border: `1px solid ${dirDetails.badgeBorder}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}>
                <span>{dirDetails.arrow}</span>
                <span>{dirDetails.shortText}</span>
              </span>
            </div>

            <div style={{ fontWeight: '900', fontSize: '0.92rem', color: '#ffffff', marginBottom: '2px' }}>
              #{train.trainNumber} · {train.trainName}
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', marginBottom: '8px', fontWeight: '700' }}>
              {routeProgress.sourceName} ➔ {routeProgress.destName}
            </div>

            <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.5, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6px' }}>
              <div>📍 Station: <strong>{train.lastStationName}</strong> ({routeProgress.krSectorKm} km)</div>
              <div>⏱ Status: <strong style={{ textTransform: 'capitalize', color: '#f8fafc' }}>{train.status}</strong> {train.actualTime ? `(${train.actualTime})` : ''}</div>
              <div style={{ color: delayColor, fontWeight: '800', marginTop: '2px' }}>
                {train.delayMinutes === 0
                  ? '✅ On time'
                  : train.delayMinutes > 0
                  ? `🔴 +${train.delayMinutes} min late`
                  : `🟢 ${Math.abs(train.delayMinutes)} min early`
                }
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                🛣️ {routeProgress.coveredKm} km covered ({routeProgress.progressPercent}%) · {routeProgress.remainingKm} km left
              </div>
            </div>

            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center', borderTop: '1px dashed rgba(255,255,255,0.08)', paddingTop: '4px' }}>
              Click for full journey details & graph
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
