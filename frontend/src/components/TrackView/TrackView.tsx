import { useRef, useCallback, useState, useLayoutEffect } from 'react';
import { useTrainStore } from '../../store/useTrainStore';
import { TrainMarker } from './TrainMarker';
import { STATIONS } from '../../data/stations';
import type { TrainPosition } from '../../types';

const ROUTE_TOTAL_KM = 738;
const BASE_TRACK_WIDTH = 4800;    // Base px width for 70 stations at 1.0x zoom
const TRACK_TOP = 210;            // px from container top to track center
const CONTAINER_HEIGHT = 590;     // px for 4 tiers of trains + 4 tiers of all 70 stations

// Popular major junctions for quick jump pills
const POPULAR_JUNCTIONS = [
  { code: 'ROHA', name: 'Roha', km: 0 },
  { code: 'KHED', name: 'Khed', km: 112 },
  { code: 'CHI',  name: 'Chiplun', km: 135 },
  { code: 'RN',   name: 'Ratnagiri', km: 211 },
  { code: 'KKNV', name: 'Kankavli', km: 308 },
  { code: 'KUDL', name: 'Kudal', km: 330 },
  { code: 'SAWI', name: 'Sawantwadi', km: 354 },
  { code: 'THVM', name: 'Thivim', km: 395 },
  { code: 'MAO',  name: 'Madgaon', km: 436 },
  { code: 'KAWR', name: 'Karwar', km: 493 },
  { code: 'KUMTA',name: 'Kumta', km: 550 },
  { code: 'BTKL', name: 'Bhatkal', km: 614 },
  { code: 'UD',   name: 'Udupi', km: 686 },
  { code: 'SRTK', name: 'Surathkal', km: 738 },
];

interface PositionedTrain {
  train: TrainPosition;
  x: number;
  tier: number;
  yOffset: number;
}

/**
 * Multi-tier collision-free lane assignment for running trains.
 * Uses 115px safety separation along the track.
 */
function computeTrainLayout(trains: TrainPosition[], kmToX: (km: number) => number): PositionedTrain[] {
  const MIN_SEPARATION = 115;

  const downList = trains
    .filter(t => t.direction === 'down')
    .map(t => ({ train: t, x: kmToX(t.progressKm), tier: 0, yOffset: -38 }))
    .sort((a, b) => a.x - b.x);

  const upList = trains
    .filter(t => t.direction === 'up')
    .map(t => ({ train: t, x: kmToX(t.progressKm), tier: 0, yOffset: 26 }))
    .sort((a, b) => a.x - b.x);

  // Multi-tier placement for Down trains (grow upwards from track: tier 0 = -38, tier 1 = -76, etc.)
  const downTiers: number[][] = [[], [], [], []];
  for (const item of downList) {
    let assignedTier = 0;
    for (let tier = 0; tier < 4; tier++) {
      const hasCollision = downTiers[tier].some(existingX => Math.abs(existingX - item.x) < MIN_SEPARATION);
      if (!hasCollision) {
        assignedTier = tier;
        break;
      }
      assignedTier = tier + 1;
    }
    item.tier = assignedTier;
    item.yOffset = -(38 + assignedTier * 38);
    if (!downTiers[assignedTier]) downTiers[assignedTier] = [];
    downTiers[assignedTier].push(item.x);
  }

  // Multi-tier placement for Up trains (grow downwards from track: tier 0 = +26, tier 1 = +64, etc.)
  const upTiers: number[][] = [[], [], [], []];
  for (const item of upList) {
    let assignedTier = 0;
    for (let tier = 0; tier < 4; tier++) {
      const hasCollision = upTiers[tier].some(existingX => Math.abs(existingX - item.x) < MIN_SEPARATION);
      if (!hasCollision) {
        assignedTier = tier;
        break;
      }
      assignedTier = tier + 1;
    }
    item.tier = assignedTier;
    item.yOffset = 26 + assignedTier * 38;
    if (!upTiers[assignedTier]) upTiers[assignedTier] = [];
    upTiers[assignedTier].push(item.x);
  }

  return [...downList, ...upList];
}

export function TrackView() {
  const { filteredTrains, language } = useTrainStore();
  const trains = filteredTrains();
  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom state: 0.65x to 2.2x (default 1.0x)
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const prevZoomRef = useRef<number>(zoomLevel);

  // Station filter: show all 70 stations (default) or major only
  const [stationFilter, setStationFilter] = useState<'all' | 'major'>('all');

  // Dynamic track width based on zoom
  const currentTrackWidth = Math.round(BASE_TRACK_WIDTH * zoomLevel);

  function kmToX(km: number): number {
    return Math.round((km / ROUTE_TOTAL_KM) * (currentTrackWidth - 220)) + 90;
  }

  // Preserve center scroll position across zoom changes
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const prevWidth = Math.round(BASE_TRACK_WIDTH * prevZoomRef.current);
    const centerRatio = (container.scrollLeft + container.clientWidth / 2) / prevWidth;
    const newScrollLeft = centerRatio * currentTrackWidth - container.clientWidth / 2;
    container.scrollLeft = Math.max(0, newScrollLeft);
    prevZoomRef.current = zoomLevel;
  }, [zoomLevel, currentTrackWidth]);

  // Desktop mouse horizontal drag scrolling
  const isDragging = useRef(false);
  const dragStart = useRef(0);
  const scrollStart = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    // Only trigger drag on primary mouse button
    if (e.button !== 0) return;
    isDragging.current = true;
    dragStart.current = e.pageX;
    scrollStart.current = containerRef.current?.scrollLeft ?? 0;
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const dx = e.pageX - dragStart.current;
    containerRef.current.scrollLeft = scrollStart.current - dx;
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Smooth two-finger pinch-to-zoom on mobile
  const pinchStartDist = useRef<number | null>(null);
  const pinchStartZoom = useRef<number>(1.0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      pinchStartDist.current = dist;
      pinchStartZoom.current = zoomLevel;
    }
  }, [zoomLevel]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDist.current !== null) {
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      const scale = dist / pinchStartDist.current;
      const target = Math.min(2.2, Math.max(0.65, +(pinchStartZoom.current * scale).toFixed(2)));
      setZoomLevel(target);
    }
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      pinchStartDist.current = null;
    }
  }, []);

  function jumpToStation(km: number) {
    if (!containerRef.current) return;
    const targetX = kmToX(km);
    const containerWidth = containerRef.current.clientWidth;
    containerRef.current.scrollTo({
      left: Math.max(0, targetX - containerWidth / 2),
      behavior: 'smooth',
    });
  }

  const zoomIn = () => setZoomLevel(z => Math.min(2.2, +(z + 0.2).toFixed(2)));
  const zoomOut = () => setZoomLevel(z => Math.max(0.65, +(z - 0.2).toFixed(2)));
  const resetZoom = () => setZoomLevel(1.0);

  const positionedTrains = computeTrainLayout(trains, kmToX);

  return (
    <div style={{ position: 'relative', margin: '0 8px' }}>

      {/* Quick Station Jump & Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        padding: '8px 4px',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}>
        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          ⚡ Jump:
        </span>

        {/* All 70 Stations Dropdown */}
        <select
          aria-label="Jump to any station"
          onChange={e => {
            if (e.target.value !== '') {
              jumpToStation(Number(e.target.value));
            }
          }}
          defaultValue=""
          style={{
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '4px 10px',
            fontSize: '0.72rem',
            fontWeight: '600',
            cursor: 'pointer',
            outline: 'none',
            flexShrink: 0,
          }}
        >
          <option value="" disabled>🔍 All 70 Stations...</option>
          {STATIONS.map(s => (
            <option key={s.code} value={s.km}>
              {s.km} km · {s.code} - {language === 'hi' ? s.nameHi : s.name} {s.type === 'major' ? '⭐' : ''}
            </option>
          ))}
        </select>

        {/* Popular Junction Quick Pills */}
        {POPULAR_JUNCTIONS.map(j => (
          <button
            key={j.code}
            onClick={() => jumpToStation(j.km)}
            className="btn btn-ghost"
            style={{
              padding: '3px 9px',
              fontSize: '0.72rem',
              borderRadius: '20px',
              whiteSpace: 'nowrap',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-elevated)',
              flexShrink: 0,
            }}
          >
            {j.name} <span style={{ opacity: 0.6, fontSize: '0.65rem' }}>({j.km}k)</span>
          </button>
        ))}
      </div>

      {/* Track Container Card */}
      <div
        className="glass"
        style={{
          borderRadius: '16px',
          padding: '10px 0 6px',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
        }}
      >
        {/* Track Control Toolbar (Directions + Station Filter + Zoom Controls) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 14px 10px',
          borderBottom: '1px solid var(--border-subtle)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          {/* Direction legend */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{
                color: '#38bdf8', fontWeight: '900', background: 'rgba(56,189,248,0.15)',
                padding: '2px 7px', borderRadius: '6px', border: '1px solid rgba(56,189,248,0.3)',
                fontSize: '0.7rem'
              }}>▼ Southbound</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }} className="hide-mobile">
                (Above · Roha → Goa / Mangaluru)
              </span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{
                color: '#2dd4bf', fontWeight: '900', background: 'rgba(45,212,191,0.15)',
                padding: '2px 7px', borderRadius: '6px', border: '1px solid rgba(45,212,191,0.3)',
                fontSize: '0.7rem'
              }}>▲ Northbound</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }} className="hide-mobile">
                (Below · Mangaluru → Roha)
              </span>
            </span>
          </div>

          {/* Station Filter Toggle & Interactive Zoom Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>

            {/* Station density view toggle */}
            <div style={{
              display: 'inline-flex',
              background: 'var(--bg-elevated)',
              borderRadius: '16px',
              padding: '2px',
              border: '1px solid var(--border-subtle)',
            }}>
              <button
                onClick={() => setStationFilter('all')}
                style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '0.68rem',
                  fontWeight: stationFilter === 'all' ? '800' : '500',
                  background: stationFilter === 'all' ? 'var(--accent-teal)' : 'transparent',
                  color: stationFilter === 'all' ? '#080d1a' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                🏢 All 70 Stations
              </button>
              <button
                onClick={() => setStationFilter('major')}
                style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '0.68rem',
                  fontWeight: stationFilter === 'major' ? '800' : '500',
                  background: stationFilter === 'major' ? 'var(--accent-teal)' : 'transparent',
                  color: stationFilter === 'major' ? '#080d1a' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                ⭐ Major Only
              </button>
            </div>

            {/* In-App Zoom Controls */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'var(--bg-elevated)',
              borderRadius: '16px',
              padding: '2px 4px',
              border: '1px solid var(--border-subtle)',
              gap: '2px',
            }}>
              <button
                onClick={zoomOut}
                disabled={zoomLevel <= 0.65}
                title="Zoom out"
                style={{
                  background: 'none', border: 'none',
                  color: zoomLevel <= 0.65 ? 'var(--text-muted)' : 'var(--text-primary)',
                  fontSize: '0.85rem', fontWeight: '800', padding: '2px 7px',
                  cursor: zoomLevel <= 0.65 ? 'not-allowed' : 'pointer',
                  borderRadius: '8px',
                }}
              >
                −
              </button>
              <span
                onClick={resetZoom}
                title="Click to reset zoom to 100%"
                style={{
                  fontSize: '0.68rem',
                  fontWeight: '700',
                  fontFamily: 'var(--font-mono)',
                  color: zoomLevel === 1.0 ? 'var(--accent-teal)' : 'var(--text-secondary)',
                  padding: '0 4px',
                  cursor: 'pointer',
                  minWidth: '38px',
                  textAlign: 'center',
                }}
              >
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={zoomIn}
                disabled={zoomLevel >= 2.2}
                title="Zoom in"
                style={{
                  background: 'none', border: 'none',
                  color: zoomLevel >= 2.2 ? 'var(--text-muted)' : 'var(--text-primary)',
                  fontSize: '0.85rem', fontWeight: '800', padding: '2px 7px',
                  cursor: zoomLevel >= 2.2 ? 'not-allowed' : 'pointer',
                  borderRadius: '8px',
                }}
              >
                +
              </button>
              {zoomLevel !== 1.0 && (
                <button
                  onClick={resetZoom}
                  title="Reset zoom"
                  style={{
                    background: 'none', border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.65rem', padding: '2px 4px',
                    cursor: 'pointer',
                  }}
                >
                  ↺
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Track Canvas with Native Smooth Touch & Desktop Mouse Drag */}
        <div
          ref={containerRef}
          className="track-container"
          style={{
            height: `${CONTAINER_HEIGHT}px`,
            position: 'relative',
            cursor: 'grab',
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div style={{ width: `${currentTrackWidth}px`, height: '100%', position: 'relative' }}>

            {/* State Zone Backgrounds */}
            <div style={{
              position: 'absolute', top: 0, bottom: 0,
              left: `${kmToX(0)}px`, width: `${kmToX(365) - kmToX(0)}px`,
              background: 'rgba(59,130,246,0.025)',
              borderRight: '1px dashed rgba(59,130,246,0.2)',
            }}>
              <span style={{ position: 'absolute', top: '8px', left: '12px', fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', fontWeight: '800', letterSpacing: '0.08em' }}>
                MAHARASHTRA REGION
              </span>
            </div>

            <div style={{
              position: 'absolute', top: 0, bottom: 0,
              left: `${kmToX(365)}px`, width: `${kmToX(480) - kmToX(365)}px`,
              background: 'rgba(217,70,239,0.025)',
              borderRight: '1px dashed rgba(217,70,239,0.2)',
            }}>
              <span style={{ position: 'absolute', top: '8px', left: '12px', fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', fontWeight: '800', letterSpacing: '0.08em' }}>
                GOA REGION
              </span>
            </div>

            <div style={{
              position: 'absolute', top: 0, bottom: 0,
              left: `${kmToX(480)}px`, width: `${kmToX(738) - kmToX(480)}px`,
              background: 'rgba(34,197,94,0.025)',
            }}>
              <span style={{ position: 'absolute', top: '8px', left: '12px', fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', fontWeight: '800', letterSpacing: '0.08em' }}>
                KARNATAKA REGION
              </span>
            </div>

            {/* Continuous Glowing Track Line */}
            <div className="track-line" style={{
              position: 'absolute',
              top: `${TRACK_TOP - 2}px`,
              left: `${kmToX(0)}px`,
              width: `${kmToX(738) - kmToX(0)}px`,
              zIndex: 4,
            }} />

            {/* ALL 70 STATIONS: Ticks, Nodes, Guides & Staggered Non-Colliding Ribbons */}
            {STATIONS.map((st) => {
              const x = kmToX(st.km);
              const isMajor = st.type === 'major';
              const showStationBadge = isMajor || stationFilter === 'all';
              // 3-tier staggering for minor stations (zero collision across 70 stations)
              const minorTier = st.index % 3;

              return (
                <div key={st.code} style={{ position: 'absolute', left: `${x}px` }}>

                  {/* Station Tick on the Track Line */}
                  <div style={{
                    position: 'absolute',
                    top: `${TRACK_TOP - (isMajor ? 14 : 7)}px`,
                    left: isMajor ? '-1.5px' : '-1px',
                    width: isMajor ? '3px' : '2px',
                    height: isMajor ? 28 : 14,
                    background: isMajor ? 'var(--accent-teal)' : 'rgba(255,255,255,0.28)',
                    borderRadius: '2px',
                    zIndex: 5,
                    boxShadow: isMajor ? '0 0 8px var(--accent-teal)' : 'none',
                  }} />

                  {/* Track Center Node Dot */}
                  <div style={{
                    position: 'absolute',
                    top: `${TRACK_TOP - (isMajor ? 4 : 2)}px`,
                    left: `${isMajor ? -4 : -2}px`,
                    width: `${isMajor ? 8 : 4}px`,
                    height: `${isMajor ? 8 : 4}px`,
                    borderRadius: '50%',
                    background: isMajor ? '#2dd4bf' : 'rgba(255,255,255,0.5)',
                    boxShadow: isMajor ? '0 0 10px #2dd4bf' : 'none',
                    zIndex: 6,
                  }} />

                  {/* Vertical Guide Line down to Station Label */}
                  {showStationBadge && (
                    <div style={{
                      position: 'absolute',
                      top: `${TRACK_TOP + (isMajor ? 14 : 7)}px`,
                      left: '0px',
                      width: '1px',
                      height: `${isMajor ? 156 : (225 + minorTier * 32)}px`,
                      borderLeft: `1px dashed ${isMajor ? 'rgba(45,212,191,0.25)' : 'rgba(255,255,255,0.1)'}`,
                      pointerEvents: 'none',
                      zIndex: 2,
                    }} />
                  )}

                  {/* 1. Major Junction Station Card (Prominent Primary Tier) */}
                  {isMajor && (
                    <div
                      style={{
                        position: 'absolute',
                        top: `${TRACK_TOP + 172}px`,
                        left: '-52px',
                        width: '104px',
                        textAlign: 'center',
                        fontSize: '0.68rem',
                        fontWeight: '800',
                        lineHeight: 1.25,
                        userSelect: 'none',
                        zIndex: 10,
                        background: 'linear-gradient(180deg, rgba(15,23,42,0.95), rgba(8,13,26,0.95))',
                        padding: '5px 6px',
                        borderRadius: '10px',
                        border: '1.5px solid rgba(45,212,191,0.45)',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.6), 0 0 10px rgba(45,212,191,0.15)',
                        cursor: 'pointer',
                        transition: 'transform 150ms, border-color 150ms',
                      }}
                      onClick={() => jumpToStation(st.km)}
                      title={`Click to center on ${st.name} (${st.km} km)`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', marginBottom: '2px' }}>
                        <span style={{ color: 'var(--accent-teal)', fontSize: '0.6rem', fontWeight: '900' }}>⭐</span>
                        <span style={{ color: 'var(--accent-teal)', fontSize: '0.62rem', fontWeight: '900', fontFamily: 'var(--font-mono)' }}>
                          {st.code}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.58rem' }}>
                          · {st.km}k
                        </span>
                      </div>
                      <div style={{
                        color: '#ffffff',
                        fontWeight: '700',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: '0.68rem',
                      }}>
                        {language === 'hi' ? st.nameHi : st.name}
                      </div>
                    </div>
                  )}

                  {/* 2. Minor Small Station Badge (Staggered 3-Tier Ribbon — Zero Collision!) */}
                  {!isMajor && stationFilter === 'all' && (
                    <div
                      style={{
                        position: 'absolute',
                        top: `${TRACK_TOP + 234 + minorTier * 32}px`,
                        left: '-44px',
                        width: '88px',
                        textAlign: 'center',
                        fontSize: '0.62rem',
                        userSelect: 'none',
                        zIndex: 9,
                        background: 'rgba(15,23,42,0.88)',
                        padding: '3px 5px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.12)',
                        boxShadow: '0 3px 10px rgba(0,0,0,0.4)',
                        cursor: 'pointer',
                        transition: 'transform 120ms, border-color 120ms',
                      }}
                      onClick={() => jumpToStation(st.km)}
                      title={`${st.name} (${st.code}) • ${st.km} km • Click to center`}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1px' }}>
                        <span style={{ color: '#93c5fd', fontSize: '0.58rem', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>
                          {st.code}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.55rem' }}>
                          {st.km}k
                        </span>
                      </div>
                      <div style={{
                        color: 'rgba(240,246,255,0.9)',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: '0.62rem',
                      }}>
                        {language === 'hi' ? st.nameHi : st.name}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}

            {/* Collision-Free Multi-Tier Positioned Train Markers */}
            {positionedTrains.map(({ train, x, tier, yOffset }, i) => (
              <TrainMarker
                key={`${train.trainNumber}-${i}`}
                train={train}
                x={x}
                trackTop={TRACK_TOP}
                tier={tier}
                yOffset={yOffset}
              />
            ))}

            {/* Empty State */}
            {trains.length === 0 && (
              <div style={{
                position: 'absolute',
                top: `${TRACK_TOP - 20}px`,
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'var(--text-muted)',
                fontSize: '0.95rem',
                textAlign: 'center',
              }}>
                🚫 No trains match current filters
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
