import { useT } from '../../i18n';

export function Footer() {
  const t = useT();
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--bg-surface)',
      padding: '20px 16px',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Disclaimer — mandatory and always visible */}
        <div style={{
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: '10px',
          padding: '12px 16px',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: '16px',
        }}>
          <span style={{ color: 'var(--accent-amber)', fontWeight: '700', marginRight: '6px' }}>⚠ Disclaimer:</span>
          {t.disclaimer}
        </div>

        <div style={{
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'space-between', alignItems: 'center',
          gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)',
        }}>
          <span>
            🚂 <strong style={{ color: 'var(--text-secondary)' }}>{t.appName}</strong>
            {' '}— Unofficial fan project
          </span>
          <span>
            Data source:{' '}
            <a
              href="https://konkanrailway.com/VisualTrain/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}
            >
              konkanrailway.com/VisualTrain
            </a>
          </span>
          <span>Built with ❤️ · OpenStreetMap · Free-tier hosting</span>
        </div>
      </div>
    </footer>
  );
}
