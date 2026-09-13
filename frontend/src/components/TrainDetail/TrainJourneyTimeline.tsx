import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TrainPosition } from '../../types';
import type { Station } from '../../data/stations';
import {
  getRouteProgress,
  getDirectionDetails,
  formatDelay,
  getEffectiveDirection,
  getTrainRouteStations,
  getStationTimingDetails,
} from '../../lib/trainUtils';

interface TrainJourneyTimelineProps {
  train: TrainPosition;
  language: 'en' | 'hi';
  history?: Array<{ station_code: string; actual_time?: string; delay_minutes?: number }>;
}

interface TimelineItem {
  type: 'station' | 'segment';
  station?: Station;
  index?: number;
  segmentId?: string;
  stations?: Station[];
  startIdx?: number;
}

export function TrainJourneyTimeline({ train, language, history }: TrainJourneyTimelineProps) {
  const direction = getEffectiveDirection(train);
  const isDown = direction === 'down';
  const routeProgress = getRouteProgress(train, language);
  const dirDetails = getDirectionDetails(direction, language);

  // Exact stations strictly along this train's KR route in true direction of travel
  const routeStations = useMemo(() => getTrainRouteStations(train), [train]);

  // Find index of current station in the train's route
  const currentStationIndex = routeStations.findIndex(
    s => s.code === train.lastStationCode || s.name.toLowerCase() === train.lastStationName.toLowerCase()
  );

  const activeIndex = currentStationIndex !== -1
    ? currentStationIndex
    : routeStations.findIndex(s => isDown ? s.km >= train.progressKm : s.km <= train.progressKm);

  const safeActiveIndex = activeIndex !== -1 ? activeIndex : 0;

  // Pre-calculate timing details for all stations
  const stationTimings = useMemo(() => {
    return routeStations.map(st =>
      getStationTimingDetails(train, st, {
        routeStations,
        safeActiveIndex,
        history: history || train.history,
        lang: language,
      })
    );
  }, [train, routeStations, safeActiveIndex, history, language]);

  // Build timeline items with collapsible intermediate stops between major halts
  const { timelineItems, defaultExpandedSegments } = useMemo(() => {
    const items: TimelineItem[] = [];
    const autoExpand: Record<string, boolean> = {};

    let currentIntermediate: Station[] = [];
    let intermediateStartIdx = -1;

    for (let i = 0; i < routeStations.length; i++) {
      const st = routeStations[i];
      const timing = stationTimings[i];
      const isAnchor =
        i === 0 ||
        i === routeStations.length - 1 ||
        timing.isOfficialStop ||
        st.type === 'major' ||
        i === safeActiveIndex;

      if (isAnchor) {
        if (currentIntermediate.length > 0) {
          const segId = `seg-${intermediateStartIdx}`;
          // If active index is inside this segment, auto-expand
          if (safeActiveIndex >= intermediateStartIdx && safeActiveIndex < intermediateStartIdx + currentIntermediate.length) {
            autoExpand[segId] = true;
          }
          items.push({
            type: 'segment',
            segmentId: segId,
            stations: currentIntermediate,
            startIdx: intermediateStartIdx,
          });
          currentIntermediate = [];
        }
        items.push({
          type: 'station',
          station: st,
          index: i,
        });
      } else {
        if (currentIntermediate.length === 0) {
          intermediateStartIdx = i;
        }
        currentIntermediate.push(st);
      }
    }

    if (currentIntermediate.length > 0) {
      const segId = `seg-${intermediateStartIdx}`;
      if (safeActiveIndex >= intermediateStartIdx) {
        autoExpand[segId] = true;
      }
      items.push({
        type: 'segment',
        segmentId: segId,
        stations: currentIntermediate,
        startIdx: intermediateStartIdx,
      });
    }

    return { timelineItems: items, defaultExpandedSegments: autoExpand };
  }, [routeStations, stationTimings, safeActiveIndex]);

  // Collapsed / expanded state per segment
  const [expandedSegments, setExpandedSegments] = useState<Record<string, boolean>>(defaultExpandedSegments);
  const [expandAll, setExpandAll] = useState(false);

  const toggleSegment = (segId: string) => {
    setExpandedSegments(prev => ({
      ...prev,
      [segId]: !prev[segId],
    }));
  };

  const toggleExpandAll = () => {
    const nextState = !expandAll;
    setExpandAll(nextState);
    const newExp: Record<string, boolean> = {};
    timelineItems.forEach(it => {
      if (it.type === 'segment' && it.segmentId) {
        newExp[it.segmentId] = nextState;
      }
    });
    setExpandedSegments(newExp);
  };

  // Format date text for top header (matching Google Transit 'SEP 13')
  const journeyDateText = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  }, []);

  const isDelayed = train.delayMinutes > 5;

  return (
    <div style={{
      marginTop: '12px',
      borderRadius: '16px',
      background: 'rgba(8, 14, 28, 0.96)',
      border: '1px solid rgba(56, 189, 248, 0.22)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      overflow: 'hidden',
    }}>
      {/* Top Header Card */}
      <div style={{
        padding: '12px 16px',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(8, 14, 28, 0.6) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div>
          <div style={{
            fontSize: '0.72rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--accent-teal, #2dd4bf)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span>📍 LIVE JOURNEY TRACK</span>
            <span style={{
              background: 'rgba(45, 212, 191, 0.15)',
              padding: '1px 6px',
              borderRadius: '4px',
              fontSize: '0.62rem',
              color: '#38bdf8',
            }}>Google Transit View</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
            {routeProgress.sourceName} ➔ {routeProgress.destName} ({dirDetails.arrow} {dirDetails.tag}) · {routeProgress.coveredKm} of {routeProgress.totalRouteKm} km
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={toggleExpandAll}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              color: '#38bdf8',
              fontSize: '0.68rem',
              fontWeight: '700',
              padding: '4px 10px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            {expandAll ? 'Collapse Minor Stops' : `Show All ${routeStations.length} Stops`}
          </button>

          <div style={{
            fontSize: '0.72rem',
            fontWeight: '800',
            padding: '4px 10px',
            borderRadius: '8px',
            background: isDelayed ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
            color: isDelayed ? '#f87171' : '#4ade80',
            border: `1px solid ${isDelayed ? 'rgba(239, 68, 68, 0.35)' : 'rgba(34, 197, 94, 0.35)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <span>{isDelayed ? '🔴' : '🟢'}</span>
            <span>{train.delayMinutes <= 0 ? 'On Schedule' : formatDelay(train.delayMinutes, { showUnit: 'long', lang: language })}</span>
          </div>
        </div>
      </div>

      {/* 3-Column Google Transit Table Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '75px 1fr 75px',
        padding: '10px 14px 8px 14px',
        fontSize: '0.7rem',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: '#94a3b8',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}>
        <div style={{ textAlign: 'left' }}>Arrival</div>
        <div style={{ paddingLeft: '30px' }}>Station</div>
        <div style={{ textAlign: 'right' }}>Departure</div>
      </div>

      {/* Timeline Stations List */}
      <div style={{ padding: '8px 14px 16px 14px' }}>
        {timelineItems.map((item) => {
          if (item.type === 'station' && item.station !== undefined && item.index !== undefined) {
            const idx = item.index;
            const st = item.station;
            const timing = stationTimings[idx];
            const isOrigin = idx === 0;
            const isDest = idx === routeStations.length - 1;
            const isCurrent = idx === safeActiveIndex;
            const isPassed = idx < safeActiveIndex;

            return (
              <div key={st.code}>
                {/* Date header above origin station */}
                {isOrigin && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '75px 1fr 75px',
                    marginBottom: '4px',
                    paddingTop: '4px',
                  }}>
                    <div />
                    <div style={{
                      paddingLeft: '30px',
                      fontSize: '0.68rem',
                      fontWeight: '800',
                      color: '#94a3b8',
                      letterSpacing: '0.05em',
                    }}>
                      {journeyDateText}
                    </div>
                    <div />
                  </div>
                )}

                {/* Station Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '75px 1fr 75px',
                  alignItems: 'center',
                  minHeight: '44px',
                  position: 'relative',
                }}>
                  {/* Left Column: Arrival */}
                  <div style={{ textAlign: 'left', paddingRight: '8px' }}>
                    {!isOrigin && (
                      <div>
                        {timing.scheduledArrival && (
                          <div style={{
                            fontSize: '0.74rem',
                            color: '#94a3b8',
                            fontFamily: 'var(--font-mono, monospace)',
                            fontWeight: '600',
                          }}>
                            {timing.scheduledArrival}
                          </div>
                        )}
                        <div style={{
                          fontSize: '0.82rem',
                          fontWeight: '800',
                          fontFamily: 'var(--font-mono, monospace)',
                          color: timing.isArrivalDelayed ? '#f87171' : '#4ade80',
                          marginTop: timing.scheduledArrival ? '1px' : '0',
                        }}>
                          {timing.actualOrExpectedArrival || '—'}
                        </div>
                      </div>
                    )}
                    {isOrigin && (
                      <div style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '0.75rem' }}>—</div>
                    )}
                  </div>

                  {/* Center Column: Track + Station Info */}
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minHeight: '44px' }}>
                    {/* Continuous Vertical Rail Line */}
                    {!isDest && (
                      <div style={{
                        position: 'absolute',
                        left: '11px',
                        top: '22px',
                        bottom: '-22px',
                        width: '3px',
                        background: isPassed
                          ? '#22c55e'
                          : isCurrent
                          ? 'linear-gradient(to bottom, #22c55e 0%, rgba(255,255,255,0.15) 100%)'
                          : 'rgba(255, 255, 255, 0.15)',
                        zIndex: 1,
                      }} />
                    )}

                    {/* Station Node or Circular Train Badge */}
                    <div style={{
                      position: 'absolute',
                      left: isCurrent ? '0px' : '7px',
                      width: isCurrent ? '25px' : '11px',
                      height: isCurrent ? '25px' : '11px',
                      borderRadius: '50%',
                      background: isCurrent ? '#ffffff' : isPassed ? '#22c55e' : 'rgba(15, 23, 42, 0.95)',
                      border: isCurrent
                        ? '2.5px solid #ef4444'
                        : isPassed
                        ? '2px solid #22c55e'
                        : '2px solid rgba(255, 255, 255, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isCurrent
                        ? '0 0 12px 2px rgba(239, 68, 68, 0.5)'
                        : isPassed
                        ? '0 0 5px rgba(34, 197, 94, 0.4)'
                        : 'none',
                      zIndex: 3,
                    }}>
                      {isCurrent && (
                        <span style={{ fontSize: '12px', lineHeight: 1 }}>🚆</span>
                      )}
                    </div>

                    {/* Station Name & Tags */}
                    <div style={{ paddingLeft: '32px', flex: 1, paddingRight: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{
                          fontWeight: isCurrent ? '900' : '700',
                          fontSize: isCurrent ? '0.88rem' : '0.8rem',
                          color: isCurrent ? '#ffffff' : isPassed ? '#e2e8f0' : '#94a3b8',
                        }}>
                          {language === 'hi' ? st.nameHi : st.name}
                        </span>
                        <span style={{
                          fontSize: '0.62rem',
                          fontFamily: 'var(--font-mono, monospace)',
                          color: isCurrent ? '#38bdf8' : '#64748b',
                          fontWeight: '600',
                        }}>
                          {st.code} · {st.km} km
                        </span>
                        {timing.isOfficialStop && (
                          <span style={{
                            fontSize: '0.55rem',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            background: 'rgba(255,255,255,0.08)',
                            color: '#cbd5e1',
                            fontWeight: '700',
                          }}>
                            🛑 Halt
                          </span>
                        )}
                        {st.type === 'major' && (
                          <span style={{ fontSize: '0.62rem', color: '#f59e0b' }} title="Major Junction">⭐</span>
                        )}
                      </div>

                      {/* Current Station Live Status Banner */}
                      {isCurrent && (
                        <motion.div
                          initial={{ opacity: 0, y: 2 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: isDelayed ? 'rgba(239, 68, 68, 0.18)' : 'rgba(34, 197, 94, 0.18)',
                            border: `1px solid ${isDelayed ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.4)'}`,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            marginTop: '3px',
                            fontSize: '0.68rem',
                            color: isDelayed ? '#f87171' : '#4ade80',
                            fontWeight: '800',
                          }}
                        >
                          <span>{isDelayed ? `+${train.delayMinutes} min delay` : 'On time'}</span>
                          <span>·</span>
                          <span style={{ textTransform: 'capitalize', color: '#ffffff' }}>{train.status || 'running'}</span>
                          {train.actualTime && <span style={{ color: '#cbd5e1' }}>({train.actualTime})</span>}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Departure */}
                  <div style={{ textAlign: 'right', paddingLeft: '8px' }}>
                    {!isDest && (
                      <div>
                        {timing.scheduledDeparture && (
                          <div style={{
                            fontSize: '0.74rem',
                            color: '#94a3b8',
                            fontFamily: 'var(--font-mono, monospace)',
                            fontWeight: '600',
                          }}>
                            {timing.scheduledDeparture}
                          </div>
                        )}
                        <div style={{
                          fontSize: '0.82rem',
                          fontWeight: '800',
                          fontFamily: 'var(--font-mono, monospace)',
                          color: timing.isDepartureDelayed ? '#f87171' : '#4ade80',
                          marginTop: timing.scheduledDeparture ? '1px' : '0',
                        }}>
                          {timing.actualOrExpectedDeparture || '—'}
                        </div>
                      </div>
                    )}
                    {isDest && (
                      <div style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '0.75rem' }}>—</div>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // Intermediate Stops Accordion Segment
          if (item.type === 'segment' && item.stations && item.segmentId && item.startIdx !== undefined) {
            const segId = item.segmentId;
            const isExpanded = Boolean(expandedSegments[segId]) || expandAll;
            const stopsCount = item.stations.length;
            const isSegmentPassed = (item.startIdx + stopsCount) <= safeActiveIndex;

            return (
              <div key={segId} style={{ position: 'relative' }}>
                {/* Collapsible toggle bar */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '75px 1fr 75px',
                    alignItems: 'center',
                    minHeight: '32px',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                  onClick={() => toggleSegment(segId)}
                >
                  <div />
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minHeight: '32px' }}>
                    {/* Vertical line through accordion */}
                    <div style={{
                      position: 'absolute',
                      left: '11px',
                      top: '0',
                      bottom: '0',
                      width: '3px',
                      background: isSegmentPassed ? '#22c55e' : 'rgba(255, 255, 255, 0.15)',
                      zIndex: 1,
                    }} />

                    <div style={{ paddingLeft: '28px' }}>
                      <button
                        type="button"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.14)',
                          borderRadius: '14px',
                          padding: '3px 10px',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          color: '#38bdf8',
                          cursor: 'pointer',
                          transition: 'all 150ms ease',
                        }}
                      >
                        <span style={{ fontSize: '0.65rem' }}>{isExpanded ? '▲' : '▼'}</span>
                        <span>{isExpanded ? `Hide ${stopsCount} stops` : `${stopsCount} stops`}</span>
                      </button>
                    </div>
                  </div>
                  <div />
                </div>

                {/* Expanded Intermediate Stations */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden' }}
                    >
                      {item.stations.map((st, subIdx) => {
                        const globalIdx = (item.startIdx ?? 0) + subIdx;
                        const timing = stationTimings[globalIdx];
                        const isCurrent = globalIdx === safeActiveIndex;
                        const isPassed = globalIdx < safeActiveIndex;

                        return (
                          <div
                            key={st.code}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '75px 1fr 75px',
                              alignItems: 'center',
                              minHeight: '38px',
                              position: 'relative',
                            }}
                          >
                            {/* Arrival */}
                            <div style={{ textAlign: 'left', paddingRight: '8px' }}>
                              {timing.scheduledArrival && (
                                <div style={{
                                  fontSize: '0.7rem',
                                  color: '#64748b',
                                  fontFamily: 'var(--font-mono, monospace)',
                                }}>
                                  {timing.scheduledArrival}
                                </div>
                              )}
                              <div style={{
                                fontSize: '0.78rem',
                                fontWeight: '700',
                                fontFamily: 'var(--font-mono, monospace)',
                                color: timing.isArrivalDelayed ? '#f87171' : '#4ade80',
                              }}>
                                {timing.actualOrExpectedArrival || '—'}
                              </div>
                            </div>

                            {/* Station Track & Name */}
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minHeight: '38px' }}>
                              {/* Track Line */}
                              <div style={{
                                position: 'absolute',
                                left: '11px',
                                top: '0',
                                bottom: '0',
                                width: '3px',
                                background: isPassed
                                  ? '#22c55e'
                                  : isCurrent
                                  ? 'linear-gradient(to bottom, #22c55e 0%, rgba(255,255,255,0.15) 100%)'
                                  : 'rgba(255, 255, 255, 0.15)',
                                zIndex: 1,
                              }} />

                              {/* Station Node or Badge */}
                              <div style={{
                                position: 'absolute',
                                left: isCurrent ? '0px' : '8px',
                                width: isCurrent ? '25px' : '9px',
                                height: isCurrent ? '25px' : '9px',
                                borderRadius: '50%',
                                background: isCurrent ? '#ffffff' : isPassed ? '#22c55e' : 'rgba(15, 23, 42, 0.95)',
                                border: isCurrent
                                  ? '2.5px solid #ef4444'
                                  : isPassed
                                  ? '1.5px solid #22c55e'
                                  : '1.5px solid rgba(255, 255, 255, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: isCurrent ? '0 0 12px 2px rgba(239, 68, 68, 0.5)' : 'none',
                                zIndex: 3,
                              }}>
                                {isCurrent && (
                                  <span style={{ fontSize: '12px', lineHeight: 1 }}>🚆</span>
                                )}
                              </div>

                              <div style={{ paddingLeft: '32px', flex: 1, paddingRight: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <span style={{
                                    fontWeight: isCurrent ? '900' : '600',
                                    fontSize: isCurrent ? '0.84rem' : '0.74rem',
                                    color: isCurrent ? '#ffffff' : isPassed ? '#cbd5e1' : '#64748b',
                                  }}>
                                    {language === 'hi' ? st.nameHi : st.name}
                                  </span>
                                  <span style={{
                                    fontSize: '0.58rem',
                                    fontFamily: 'var(--font-mono, monospace)',
                                    color: isCurrent ? '#38bdf8' : '#475569',
                                  }}>
                                    {st.code} · {st.km} km
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Departure */}
                            <div style={{ textAlign: 'right', paddingLeft: '8px' }}>
                              {timing.scheduledDeparture && (
                                <div style={{
                                  fontSize: '0.7rem',
                                  color: '#64748b',
                                  fontFamily: 'var(--font-mono, monospace)',
                                }}>
                                  {timing.scheduledDeparture}
                                </div>
                              )}
                              <div style={{
                                fontSize: '0.78rem',
                                fontWeight: '700',
                                fontFamily: 'var(--font-mono, monospace)',
                                color: timing.isDepartureDelayed ? '#f87171' : '#4ade80',
                              }}>
                                {timing.actualOrExpectedDeparture || '—'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
