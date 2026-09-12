import { useTrainStore } from '../store/useTrainStore';
import { useT } from '../i18n';
import type { FilterCategory, FilterDirection } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  passenger: 'var(--clr-passenger)',
  express: 'var(--clr-express)',
  superfast: 'var(--clr-superfast)',
  premium: 'var(--clr-premium)',
  goods: 'var(--clr-goods)',
};

export function FilterChips() {
  const t = useT();
  const {
    filterCategory, setFilterCategory,
    filterDirection, setFilterDirection,
    showDelayedOnly, setShowDelayedOnly,
    trains,
  } = useTrainStore();

  const categories: FilterCategory[] = ['all', 'passenger', 'express', 'superfast', 'premium', 'goods'];
  const directions: FilterDirection[] = ['all', 'up', 'down'];

  const countFor = (cat: FilterCategory) =>
    cat === 'all' ? trains.length : trains.filter(t => t.category === cat).length;

  const chipStyle = (active: boolean, color?: string) => ({
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '0.78rem',
    fontWeight: active ? '700' : '500',
    cursor: 'pointer',
    border: 'none',
    fontFamily: 'var(--font-sans)',
    transition: 'all 150ms',
    background: active
      ? (color ? `${color}22` : 'var(--bg-elevated)')
      : 'var(--bg-card)',
    color: active ? (color ?? 'var(--text-primary)') : 'var(--text-muted)',
    outline: active ? `1px solid ${color ?? 'var(--border-subtle)'}` : '1px solid var(--border-subtle)',
  });

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'nowrap',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none',
      gap: '8px',
      alignItems: 'center',
      padding: '4px 0',
      maxWidth: '100%',
    }}>
      {/* Category chips */}
      {categories.map(cat => (
        <button
          key={cat}
          id={`filter-cat-${cat}`}
          style={{ ...chipStyle(filterCategory === cat, cat !== 'all' ? CATEGORY_COLORS[cat] : undefined), whiteSpace: 'nowrap' }}
          onClick={() => setFilterCategory(cat)}
        >
          {t[cat as keyof typeof t] as string}
          <span style={{ opacity: 0.6, marginLeft: '4px', fontSize: '0.7rem' }}>
            {countFor(cat)}
          </span>
        </button>
      ))}

      <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)', margin: '0 4px', flexShrink: 0 }} />

      {/* Direction chips */}
      {directions.map(dir => (
        <button
          key={dir}
          id={`filter-dir-${dir}`}
          style={{ ...chipStyle(filterDirection === dir), whiteSpace: 'nowrap' }}
          onClick={() => setFilterDirection(dir)}
        >
          {dir === 'all' ? 'All Directions' : dir === 'up' ? '▲ Northbound' : '▼ Southbound'}
        </button>
      ))}

      <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)', margin: '0 4px', flexShrink: 0 }} />

      {/* Delayed only */}
      <button
        id="filter-delayed"
        style={chipStyle(showDelayedOnly, '#ef4444')}
        onClick={() => setShowDelayedOnly(!showDelayedOnly)}
      >
        🔴 {t.delayedOnly}
      </button>
    </div>
  );
}
