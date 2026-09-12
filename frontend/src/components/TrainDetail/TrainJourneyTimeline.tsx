import { motion } from 'framer-motion';
import type { TrainPosition } from '../../types';
import {
  getRouteProgress,
  getDirectionDetails,
  formatDelay,
  calculateExpectedTime,
  getEffectiveDirection,
  getTrainRouteStations,
} from '../../lib/trainUtils';

interface TrainJourneyTimelineProps {
  train: TrainPosition;
  language: 'en' | 'hi';
}

export function TrainJourneyTimeline({ train, language }: TrainJourneyTimelineProps) {
  const direction = getEffectiveDirection(train);
  const isDown = direction === 'down';
  const routeProgress = getRouteProgress(train, language);
  const dirDetails = getDirectionDetails(direction, language);

  // Exact stations strictly along this train's KR route in true direction of travel
  const routeStations = getTrainRouteStations(train);

  // Find index of current station in the train's route
  const currentStationIndex = routeStations.findIndex(
    s => s.code === train.lastStationCode || s.name.toLowerCase() === train.lastStationName.toLowerCase()
  );

  // If exact match not found, estimate based on progressKm
  const activeIndex = currentStationIndex !== -1
    ? currentStationIndex
    : routeStations.findIndex(s => isDown ? s.km >= train.progressKm : s.km <= train.progressKm);

  const safeActiveIndex = activeIndex !== -1 ? activeIndex : 0;

  // Filter to a clean set of stations along this train's route:
  // If route has <= 10 stations, show all of them!
  // If route is long, show:
  // - First 2 stations of route
  // - 2 stations before current
  // - Current station
  // - 3 stations ahead
  // - All major junctions along remaining route
  // - Final destination station
  const displayStations = routeStations.length <= 10
    ? routeStations
    : routeStations.filter((st, idx) => {
        if (idx === 0 || idx === routeStations.length - 1) return true;
        if (st.type === 'major') return true;
        if (Math.abs(idx - safeActiveIndex) <= 2) return true;
        return false;
      });

  return (
    <div style={{
      marginTop: '12px',
      padding: '14px',
      borderRadius: '14px',
      background: 'rgba(8, 13, 26, 0.95)',
      border: '1px solid rgba(56, 189, 248, 0.25)',
      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
    }}>
      {/* Journey Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '10px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '12px',
        flexWrap: 'wrap',
        gap: '6px',
      }}>
        <div>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--accent-teal)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}>
            <span>🛤️ LIVE JOURNEY TRACK</span>
            <span style={{
              background: 'rgba(45,212,191,0.15)',
              padding: '1px 6px',
              borderRadius: '4px',
              fontSize: '0.62rem',
            }}>Where Is My Train View</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {routeProgress.sourceName} ➔ {routeProgress.destName} ({dirDetails.arrow} {dirDetails.tag}) · {routeProgress.coveredKm} of {routeProgress.totalRouteKm} km
          </div>
        </div>

        {/* Live delay tag */}
        <div style={{
          fontSize: '0.72rem',
          fontWeight: '800',
          padding: '3px 8px',
          borderRadius: '6px',
          background: train.delayMinutes > 5 ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
          color: train.delayMinutes > 5 ? '#ef4444' : '#22c55e',
          border: `1px solid ${train.delayMinutes > 5 ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
        }}>
          {train.delayMinutes <= 0 ? '🟢 On Schedule' : `🔴 ${formatDelay(train.delayMinutes, { showUnit: 'long', lang: language })}`}
        </div>
      </div>

      {/* Graphical Timeline Track */}
      <div style={{ position: 'relative', paddingLeft: '28px' }}>
        {displayStations.map((st, i) => {
          const originalIndex = routeStations.findIndex(s => s.code === st.code);
          const isPassed = originalIndex < safeActiveIndex;
          const isCurrent = originalIndex === safeActiveIndex;
          const isUpcoming = originalIndex > safeActiveIndex;

          const distanceDiff = Math.abs(st.km - train.progressKm);

          return (
            <div
              key={st.code}
              style={{
                position: 'relative',
                paddingBottom: i === displayStations.length - 1 ? '0' : '18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              {/* Continuous vertical rail track line */}
              {i < displayStations.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '-19px',
                  top: '12px',
                  bottom: '-4px',
                  width: '3px',
                  background: isPassed
                    ? 'linear-gradient(to bottom, #22c55e, #2dd4bf)'
                    : isCurrent
                    ? 'linear-gradient(to bottom, #2dd4bf, rgba(255,255,255,0.15))'
                    : 'rgba(255,255,255,0.12)',
                  borderRadius: '2px',
                }} />
              )}

              {/* Station Node on Track */}
              <div style={{
                position: 'absolute',
                left: '-24px',
                top: isCurrent ? '0px' : '4px',
                width: isCurrent ? '14px' : '11px',
                height: isCurrent ? '14px' : '11px',
                borderRadius: '50%',
                background: isPassed
                  ? '#22c55e'
                  : isCurrent
                  ? '#38bdf8'
                  : 'rgba(15,23,42,0.9)',
                border: isCurrent
                  ? '3px solid #ffffff'
                  : isPassed
                  ? '2px solid #22c55e'
                  : '2px solid rgba(255,255,255,0.3)',
                boxShadow: isCurrent
                  ? '0 0 12px 3px rgba(56,189,248,0.8)'
                  : isPassed
                  ? '0 0 6px rgba(34,197,94,0.4)'
                  : 'none',
                zIndex: 2,
              }} />

              {/* Station Details */}
              <div style={{ flex: 1, paddingRight: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontWeight: isCurrent ? '900' : '700',
                    fontSize: isCurrent ? '0.88rem' : '0.78rem',
                    color: isCurrent ? '#ffffff' : isPassed ? '#cbd5e1' : 'var(--text-muted)',
                  }}>
                    {language === 'hi' ? st.nameHi : st.name}
                  </span>
                  <span style={{
                    fontSize: '0.62rem',
                    fontFamily: 'var(--font-mono)',
                    color: isCurrent ? 'var(--accent-teal)' : 'var(--text-muted)',
                    fontWeight: '600',
                  }}>
                    {st.code} · {st.km} km
                  </span>
                  {st.type === 'major' && (
                    <span style={{ fontSize: '0.6rem', color: '#f59e0b' }}>⭐</span>
                  )}
                </div>

                {/* Status banner for current station */}
                {isCurrent && (
                  <motion.div
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'rgba(56,189,248,0.15)',
                      border: '1px solid rgba(56,189,248,0.4)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      marginTop: '4px',
                      fontSize: '0.68rem',
                      color: '#38bdf8',
                      fontWeight: '800',
                    }}
                  >
                    <span>🚂 TRAIN HERE</span>
                    <span>·</span>
                    <span style={{ textTransform: 'capitalize' }}>{train.status}</span>
                    {train.actualTime && <span>({train.actualTime})</span>}
                  </motion.div>
                )}
              </div>

              {/* Right timing / distance column */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                {isPassed && (
                  <div style={{
                    fontSize: '0.68rem',
                    color: '#22c55e',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    justifyContent: 'flex-end',
                  }}>
                    <span>✓ Crossed</span>
                  </div>
                )}
                {isCurrent && (
                  <div style={{
                    fontSize: '0.72rem',
                    color: '#38bdf8',
                    fontWeight: '800',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {train.actualTime || 'Live'}
                  </div>
                )}
                {isUpcoming && (
                  <div>
                    <div style={{
                      fontSize: '0.74rem',
                      color: '#38bdf8',
                      fontWeight: '800',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.02em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      justifyContent: 'flex-end',
                    }}>
                      <span>{calculateExpectedTime(train.actualTime || train.scheduledArrival, distanceDiff, train.category)}</span>
                      <span style={{
                        fontSize: '0.58rem',
                        color: 'rgba(56,189,248,0.95)',
                        background: 'rgba(56,189,248,0.18)',
                        border: '1px solid rgba(56,189,248,0.3)',
                        padding: '0.5px 3px',
                        borderRadius: '3px',
                        fontWeight: '700',
                      }}>EXP</span>
                    </div>
                    <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '1px' }}>
                      in {distanceDiff} km
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
