import { useRef, useCallback } from 'react';
import { useTrainStore } from '../../store/useTrainStore';
import { TrainMarker } from './TrainMarker';
import { STATIONS } from '../../data/stations';
import type { TrainPosition } from '../../types';

const ROUTE_TOTAL_KM = 738;
const TRACK_WIDTH = 4800;       // px — generous width for 70 stations
const TRACK_TOP = 200;          // px from container top to track center
const CONTAINER_HEIGHT = 470;   // px — generous height for 4 tiers of trains + station labels

// Major stations for quick jumping
const MAJOR_JUNCTIONS = [
  { code: 'ROHA', name: 'Roha', km: 0 },
  { code: 'KHED', name: 'Khed', km: 112 },
  { code: 'CHI',  name: 'Chiplun', km: 135 },
  { code: 'RN',   name: 'Ratnagiri', km: 211 },
  { code: 'KKNV', name: 'Kankavli', km: 308 },
  { code: 'KUDL', name: 'Kudal', km: 330 },
  { code: 'SAWI', name: 'Sawantwadi Rd', km: 354 },
  { code: 'THVM', name: 'Thivim (Goa)', km: 395 },
  { code: 'MAO',  name: 'Madgaon (Goa)', km: 436 },
  { code: 'KAWR', name: 'Karwar', km: 493 },
  { code: 'KT',   name: 'Kumta', km: 550 },
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
 * Intelligent multi-tier lane assignment to completely eliminate train marker collisions.
 * Checks ALL existing trains placed on each tier with a 115px safety separation.
 */
function computeTrainLayout(trains: TrainPosition[], kmToX: (km: number) => number): PositionedTrain[] {
  const MIN_SEPARATION = 115; // px safety margin between train marker centers

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

  // Mouse & Touch horizontal drag scrolling
  const isDragging = useRef(false);
  const dragStart = useRef(0);
  const scrollStart = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
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

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    isDragging.current = true;
    dragStart.current = e.touches[0].pageX;
    scrollStart.current = containerRef.current?.scrollLeft ?? 0;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const dx = e.touches[0].pageX - dragStart.current;
    containerRef.current.scrollLeft = scrollStart.current - dx;
  }, []);

  const onTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  function kmToX(km: number): number {
    return Math.round((km / ROUTE_TOTAL_KM) * (TRACK_WIDTH - 220)) + 90;
  }

  function jumpToStation(km: number) {
    if (!containerRef.current) return;
    const targetX = kmToX(km);
    const containerWidth = containerRef.current.clientWidth;
    containerRef.current.scrollTo({
      left: Math.max(0, targetX - containerWidth / 2),
      behavior: 'smooth',
    });
  }

  const positionedTrains = computeTrainLayout(trains, kmToX);

  return (
    <div style={{ position: 'relative', margin: '0 16px' }}>

      {/* Quick Station Jump Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        padding: '10px 0',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}>
        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          ⚡ Jump to:
        </span>
        {MAJOR_JUNCTIONS.map(j => (
          <button
            key={j.code}
            onClick={() => jumpToStation(j.km)}
            className="btn btn-ghost"
            style={{
              padding: '3px 10px',
              fontSize: '0.72rem',
              borderRadius: '20px',
              whiteSpace: 'nowrap',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-elevated)',
            }}
          >
            {j.name} ({j.km}k)
          </button>
        ))}
      </div>

      {/* Track Container Card */}
      <div
        className="glass"
        style={{
          borderRadius: '16px',
          padding: '14px 0 10px',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
        }}
      >
        {/* Track Legend & Direction Guide */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px 12px',
          borderBottom: '1px solid var(--border-subtle)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{
                color: '#38bdf8', fontWeight: '900', background: 'rgba(56,189,248,0.15)',
                padding: '2px 7px', borderRadius: '6px', border: '1px solid rgba(56,189,248,0.3)'
              }}>▼ Southbound</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(Above Track · Roha → Goa / Mangaluru)</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{
                color: '#2dd4bf', fontWeight: '900', background: 'rgba(45,212,191,0.15)',
                padding: '2px 7px', borderRadius: '6px', border: '1px solid rgba(45,212,191,0.3)'
              }}>▲ Northbound</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>(Below Track · Mangaluru → Mumbai / Roha)</span>
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            👈 Drag / Swipe to pan 738 km route · Click any train for details 👉
          </div>
        </div>

        {/* Scrollable Track Canvas with Touch & Mouse support */}
        <div
          ref={containerRef}
          className="track-container"
          style={{
            height: `${CONTAINER_HEIGHT}px`,
            position: 'relative',
            cursor: 'grab',
            WebkitOverflowScrolling: 'touch',
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div style={{ width: `${TRACK_WIDTH}px`, height: '100%', position: 'relative' }}>

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

            {/* Station Ticks & Dedicated Non-Colliding Station Strip */}
            {STATIONS.map((st, idx) => {
              const x = kmToX(st.km);
              const isMajor = st.type === 'major';
              const isEvenMajor = isMajor && (idx % 2 === 0);

              return (
                <div key={st.code} style={{ position: 'absolute', left: `${x}px` }}>
                  {/* Station Tick on the Track Line */}
                  <div style={{
                    position: 'absolute',
                    top: `${TRACK_TOP - (isMajor ? 14 : 7)}px`,
                    left: '-1px',
                    width: isMajor ? '2.5px' : '1.5px',
                    height: isMajor ? 28 : 14,
                    background: isMajor ? 'var(--accent-teal)' : 'rgba(255,255,255,0.25)',
                    borderRadius: '1px',
                    zIndex: 5,
                    boxShadow: isMajor ? '0 0 6px var(--accent-teal)' : 'none',
                  }} />

                  {/* Vertical Guide Line down to Station Label Zone */}
                  {isMajor && (
                    <div style={{
                      position: 'absolute',
                      top: `${TRACK_TOP + 14}px`,
                      left: '0px',
                      width: '1px',
                      height: `${(isEvenMajor ? 160 : 190)}px`,
                      borderLeft: '1px dashed rgba(255,255,255,0.12)',
                      pointerEvents: 'none',
                      zIndex: 2,
                    }} />
                  )}

                  {/* Station Labels in Dedicated Bottom Strip (Zero collision with any train tier) */}
                  {isMajor && (
                    <div style={{
                      position: 'absolute',
                      top: `${TRACK_TOP + (isEvenMajor ? 172 : 202)}px`,
                      left: '-48px',
                      width: '96px',
                      textAlign: 'center',
                      fontSize: '0.68rem',
                      fontWeight: '800',
                      lineHeight: 1.25,
                      userSelect: 'none',
                      zIndex: 10,
                      background: 'rgba(15,23,42,0.85)',
                      padding: '4px 6px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    }}
                    onClick={() => jumpToStation(st.km)}
                    title={`Click to center on ${st.name} (${st.km} km)`}
                    >
                      <div style={{ color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {language === 'hi' ? st.nameHi : st.name}
                      </div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--accent-teal)', marginTop: '2px', fontWeight: '800' }}>
                        {st.km} km
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
