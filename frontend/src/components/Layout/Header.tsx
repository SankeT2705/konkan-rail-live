import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrainStore } from '../../store/useTrainStore';
import { useT } from '../../i18n';
import type { Theme, ViewMode } from '../../types';

export function Header() {
  const t = useT();
  const {
    theme, setTheme, language, setLanguage,
    viewMode, setViewMode, wsConnected,
    isRestConnected, stale,
    lastScrapeAt,
  } = useTrainStore();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const themes: { value: Theme; label: string }[] = [
    { value: 'dark', label: t.darkMode },
    { value: 'light', label: t.lightMode },
    { value: 'high-contrast', label: t.highContrast },
  ];

  const isLive = wsConnected || isRestConnected;
  const timeSince = lastScrapeAt
    ? Math.max(0, Math.floor((Date.now() - new Date(lastScrapeAt).getTime()) / 1000))
    : null;

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: 'rgba(8,13,26,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{
        maxWidth: '1400px', margin: '0 auto',
        padding: '0 12px',
        display: 'flex', alignItems: 'center', gap: '8px',
        height: '60px',
        width: '100%',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '0 0 auto' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-blue))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: '800', color: '#fff',
            boxShadow: 'var(--glow-teal)', flexShrink: 0,
          }}>🚂</div>
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
              <span className="hide-mobile">{t.appName}</span>
              <span className="show-mobile-only">KR Live</span>
            </div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }} className="hide-mobile">
              ROHA → SURATHKAL · 738 KM
            </div>
          </div>
        </div>

        {/* View toggle */}
        <div style={{
          display: 'flex', gap: '2px', padding: '2px',
          background: 'var(--bg-elevated)', borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          flexShrink: 0,
        }}>
          {(['schematic', 'map'] as ViewMode[]).map(m => (
            <button
              key={m}
              id={`view-toggle-${m}`}
              className="btn"
              onClick={() => setViewMode(m)}
              style={{
                padding: '4px 10px', fontSize: '0.75rem',
                borderRadius: '7px',
                background: viewMode === m
                  ? 'linear-gradient(135deg, var(--accent-blue), var(--accent-teal))'
                  : 'transparent',
                color: viewMode === m ? '#fff' : 'var(--text-secondary)',
                fontWeight: viewMode === m ? '700' : '500',
                transition: 'all 200ms',
                whiteSpace: 'nowrap',
              }}
            >
              {m === 'schematic' ? t.schematic : t.map}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, minWidth: '4px' }} />

        {/* WS/REST indicator + last updated */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}
          className="hide-mobile">
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: isLive ? (stale ? '#eab308' : '#22c55e') : '#ef4444',
            boxShadow: isLive ? (stale ? '0 0 6px #eab308' : '0 0 6px #22c55e') : '0 0 6px #ef4444',
            flexShrink: 0,
          }} />
          {isLive ? (stale ? 'Live (Cached)' : (wsConnected ? 'Live (WS)' : 'Live')) : 'Connecting...'}
          {timeSince !== null && (
            <span>· {t.lastUpdated} {timeSince}s {t.ago}</span>
          )}
        </div>

        {/* Language toggle */}
        <button
          id="lang-toggle"
          className="btn btn-ghost"
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          style={{ padding: '4px 8px', fontSize: '0.75rem', minWidth: '38px', flexShrink: 0 }}
        >
          {language === 'en' ? 'हिं' : 'EN'}
        </button>

        {/* Theme selector */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            id="theme-toggle"
            className="btn btn-ghost"
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            style={{ padding: '4px 8px', fontSize: '0.9rem' }}
          >
            {theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '⚡'}
          </button>
          <AnimatePresence>
            {showThemeMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute', right: 0, top: '44px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px', padding: '6px',
                  minWidth: '140px', zIndex: 50,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}
                onMouseLeave={() => setShowThemeMenu(false)}
              >
                {themes.map(({ value, label }) => (
                  <button
                    key={value}
                    className="btn"
                    onClick={() => { setTheme(value); setShowThemeMenu(false); }}
                    style={{
                      width: '100%', justifyContent: 'flex-start',
                      padding: '8px 12px', fontSize: '0.825rem',
                      borderRadius: '8px',
                      background: theme === value ? 'var(--bg-card)' : 'transparent',
                      color: theme === value ? 'var(--accent-blue)' : 'var(--text-secondary)',
                      fontWeight: theme === value ? '700' : '400',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
