import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Polyline, CircleMarker, Marker, Popup } from 'react-leaflet';
import { useTrainStore } from '../../store/useTrainStore';
import { STATIONS } from '../../data/stations';
import { getRouteProgress, getDirectionDetails, formatDelay } from '../../lib/trainUtils';

// Fix default marker icon issue with webpack/vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });

const CATEGORY_COLORS: Record<string, string> = {
  passenger: '#3b82f6',
  express:   '#ef4444',
  superfast: '#22c55e',
  premium:   '#d946ef',
  goods:     '#64748b',
};

const routeLatLngs: [number, number][] = STATIONS.map(s => [s.lat, s.lng]);

function createTrainIcon(color: string, direction: 'up' | 'down', trainNumber: string) {
  const dirSymbol = direction === 'up' ? '▲ NB' : '▼ SB';
  const dirColor = direction === 'up' ? '#2dd4bf' : '#38bdf8';
  const arrowBg = direction === 'up' ? 'rgba(45,212,191,0.2)' : 'rgba(56,189,248,0.2)';

  return L.divIcon({
    className: 'custom-train-marker',
    html: `
      <div style="
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #090e1d;
        border: 2px solid ${color};
        color: #ffffff;
        border-radius: 14px;
        padding: 3px 8px;
        font-size: 11px;
        font-weight: 800;
        box-shadow: 0 4px 14px rgba(0,0,0,0.8), 0 0 12px ${color}66;
        white-space: nowrap;
        font-family: system-ui, -apple-system, sans-serif;
        cursor: pointer;
        transition: transform 150ms ease, box-shadow 150ms ease;
      ">
        <span style="
          color: ${dirColor};
          background: ${arrowBg};
          padding: 1px 4px;
          border-radius: 6px;
          font-weight: 900;
          font-size: 10px;
          letter-spacing: 0.02em;
        ">${dirSymbol}</span>
        <span style="letter-spacing: 0.02em;">${trainNumber}</span>
      </div>
    `,
    iconSize: [92, 28],
    iconAnchor: [46, 14],
  });
}

export function MapView() {
  const { filteredTrains, selectTrain, language } = useTrainStore();
  const trains = filteredTrains();

  return (
    <div style={{
      position: 'relative',
      height: 'calc(100vh - 200px)',
      minHeight: '460px',
      borderRadius: '16px',
      overflow: 'hidden',
      margin: '0 16px 16px',
      border: '1px solid var(--border-subtle)',
    }}>
      {/* Floating Map Legend & Guide */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        zIndex: 400,
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '14px',
        padding: '10px 14px',
        fontSize: '0.75rem',
        color: '#f8fafc',
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        maxWidth: '280px',
        pointerEvents: 'auto',
      }}>
        <div style={{ fontWeight: '800', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🧭</span>
          <span>Route & Direction Guide</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#2dd4bf', fontWeight: '900', background: 'rgba(45,212,191,0.15)', padding: '1px 5px', borderRadius: '4px' }}>▲ NB:</span>
          <span style={{ fontSize: '0.72rem' }}>Northbound (Mangaluru → Mumbai / Roha)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#38bdf8', fontWeight: '900', background: 'rgba(56,189,248,0.15)', padding: '1px 5px', borderRadius: '4px' }}>▼ SB:</span>
          <span style={{ fontSize: '0.72rem' }}>Southbound (Mumbai / Roha → Goa / Mangaluru)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'inline-block', width: '12px', height: '3px', background: '#2dd4bf', borderRadius: '1px' }} />
          <span>Konkan Railway 738 km Route</span>
        </div>
      </div>

      <MapContainer
        center={[15.6, 73.8]}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
          subdomains="abcd"
          maxZoom={19}
        />

        {/* Route polyline with subtle glow */}
        <Polyline
          positions={routeLatLngs}
          color="#2dd4bf"
          weight={4}
          opacity={0.85}
        />

        {/* Station markers */}
        {STATIONS.map(st => (
          <CircleMarker
            key={st.code}
            center={[st.lat, st.lng]}
            radius={st.type === 'major' ? 5.5 : 3}
            fillColor={st.type === 'major' ? '#3b9eff' : '#64748b'}
            color={st.type === 'major' ? '#ffffff' : '#94a3b8'}
            fillOpacity={0.9}
            weight={1.5}
          >
            <Popup className="custom-leaflet-popup">
              <div style={{ padding: '6px 8px', minWidth: '170px', color: '#f8fafc' }}>
                <strong style={{ fontSize: '13px', color: '#ffffff' }}>
                  {language === 'hi' ? st.nameHi : st.name} ({st.code})
                </strong>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                  {st.state} · {st.km} km from Roha
                </div>
                <div style={{ marginTop: '6px', fontSize: '10px', color: '#2dd4bf', textTransform: 'uppercase', fontWeight: '800' }}>
                  {st.type === 'major' ? '⭐ Major Station' : 'Minor Station'}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Train markers */}
        {trains.map(train => {
          const station = STATIONS.find(s => s.code === train.lastStationCode);
          if (!station) return null;
          const color = CATEGORY_COLORS[train.category] ?? '#3b82f6';
          const routeProgress = getRouteProgress(train, language);
          const dirDetails = getDirectionDetails(train.direction, language);

          return (
            <Marker
              key={train.trainNumber}
              position={[station.lat, station.lng]}
              icon={createTrainIcon(color, train.direction, train.trainNumber)}
              eventHandlers={{
                click: () => {
                  selectTrain(train.trainNumber);
                },
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div style={{ padding: '10px 8px', minWidth: '260px', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
                  {/* Category & Highly Visible Direction Banner */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      background: color, color: '#ffffff', fontSize: '10px',
                      fontWeight: '800', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase'
                    }}>
                      {train.category}
                    </span>

                    <span style={{
                      fontSize: '11px',
                      fontWeight: '900',
                      color: dirDetails.color,
                      background: dirDetails.badgeBg,
                      border: `1px solid ${dirDetails.badgeBorder}`,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      <span>{dirDetails.arrow}</span>
                      <span>{dirDetails.subText}</span>
                    </span>
                  </div>

                  {/* Train Title */}
                  <div style={{ fontWeight: '900', fontSize: '15px', color: '#ffffff', marginBottom: '2px' }}>
                    #{train.trainNumber} · {train.trainName}
                  </div>

                  {/* Route Summary */}
                  <div style={{ fontSize: '12px', color: 'var(--accent-teal)', fontWeight: '700', marginBottom: '10px' }}>
                    {routeProgress.sourceName} ➔ {routeProgress.destName}
                  </div>

                  {/* Route progress snippet */}
                  <div style={{
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    fontSize: '11px',
                    marginBottom: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}>
                    <div>
                      <strong>📍 Current Station:</strong> {train.lastStationName} ({routeProgress.krSectorKm} km)
                    </div>
                    <div>
                      <strong>🕒 Status:</strong>{' '}
                      <span style={{ textTransform: 'capitalize', fontWeight: '700', color: '#ffffff' }}>
                        {train.status}
                      </span>
                      {train.actualTime ? ` at ${train.actualTime}` : ''}
                    </div>
                    <div>
                      <strong>⏱️ Punctuality:</strong>{' '}
                      <span style={{
                        fontWeight: '800',
                        color: train.delayMinutes > 5 ? '#ef4444' : train.delayMinutes < 0 ? '#22c55e' : '#38bdf8',
                      }}>
                        {train.delayMinutes === 0 ? '✅ On time' : train.delayMinutes > 0 ? `🔴 ${formatDelay(train.delayMinutes, { showUnit: 'long', lang: language })}` : `🟢 ${formatDelay(train.delayMinutes, { showUnit: 'long', lang: language })}`}
                      </span>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      🛣️ {routeProgress.coveredKm} km covered ({routeProgress.progressPercent}%) · {routeProgress.remainingKm} km left
                    </div>
                  </div>

                  {/* Open Complete Details Button */}
                  <button
                    onClick={() => selectTrain(train.trainNumber)}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(90deg, #3b82f6, #2dd4bf)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontWeight: '800',
                      fontSize: '12px',
                      padding: '9px 12px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    }}
                  >
                    View Full Journey & Delay Graph →
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
