export function SkeletonLoader() {
  return (
    <div style={{ padding: '16px' }}>
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
      {[1,2,3,4,5].map(i => (
        <div key={i} className="skeleton" style={{ height: '68px', borderRadius: '12px', marginBottom: '8px' }} />
      ))}
    </div>
  );
}
