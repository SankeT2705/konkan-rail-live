import { useRef, useEffect } from 'react';
import { useTrainStore } from '../store/useTrainStore';
import { useT } from '../i18n';

export function SearchBar() {
  const t = useT();
  const { searchQuery, setSearch } = useTrainStore();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setSearch('');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div style={{ position: 'relative', flex: 1, maxWidth: '420px' }}>
      <div style={{
        position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
        color: 'var(--text-muted)', pointerEvents: 'none', fontSize: '1rem',
      }}>🔍</div>
      <input
        ref={inputRef}
        id="search-trains"
        type="text"
        value={searchQuery}
        onChange={e => setSearch(e.target.value)}
        placeholder={t.search}
        style={{
          width: '100%',
          padding: '10px 40px 10px 38px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.9rem',
          outline: 'none',
          transition: 'border-color 150ms, box-shadow 150ms',
        }}
        onFocus={e => {
          e.target.style.borderColor = 'var(--accent-blue)';
          e.target.style.boxShadow = '0 0 0 3px rgba(59,158,255,0.15)';
        }}
        onBlur={e => {
          e.target.style.borderColor = 'var(--border-subtle)';
          e.target.style.boxShadow = 'none';
        }}
      />
      {searchQuery && (
        <button
          style={{
            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', color: 'var(--text-muted)',
            cursor: 'pointer', fontSize: '1rem', padding: '2px',
          }}
          onClick={() => setSearch('')}
        >×</button>
      )}
    </div>
  );
}
