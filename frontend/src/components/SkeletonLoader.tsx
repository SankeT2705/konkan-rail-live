import { useState, useEffect } from 'react';

export function SkeletonLoader() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(e => e + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: '16px' }}>
      {/* Friendly cold-start helper banner if loading takes more than 3 seconds */}
      {elapsed >= 3 && (
        <div style={{
          marginBottom: '18px',
          padding: '12px 18px',
          background: 'rgba(59, 130, 246, 0.12)',
          border: '1px solid rgba(59, 130, 246, 0.28)',
          borderRadius: '12px',
          color: '#93c5fd',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          lineHeight: 1.4,
        }}>
          <span style={{ fontSize: '1.2rem', animation: 'spin 2s linear infinite', display: 'inline-block' }}>⚙</span>
          <div>
            <strong>Connecting to live railway server...</strong>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
              {elapsed < 8
                ? `Establishing secure stream (${elapsed}s)...`
                : `Waking up free cloud instance (${elapsed}s). Thanks for your patience, it will load in a moment!`}
            </div>
          </div>
        </div>
      )}

      {/* Track skeleton */}
      <div className="skeleton" style={{ height: '280px', borderRadius: '16px', marginBottom: '24px' }} />

      {/* Search + filter skeleton */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <div className="skeleton" style={{ height: '42px', flex: 1, borderRadius: '12px' }} />
        <div className="skeleton" style={{ height: '42px', width: '100px', borderRadius: '12px' }} />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[80, 100, 90, 110, 85, 95].map((w, i) => (
          <div key={i} className="skeleton" style={{ height: '32px', width: `${w}px`, borderRadius: '20px' }} />
        ))}
      </div>

      {/* Train list skeleton */}
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="skeleton" style={{ height: '68px', borderRadius: '12px', marginBottom: '8px' }} />
      ))}
    </div>
  );
}
