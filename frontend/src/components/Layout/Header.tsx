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
    lastScrapeAt,
  } = useTrainStore();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const themes: { value: Theme; label: string }[] = [
    { value: 'dark', label: t.darkMode },
    { value: 'light', label: t.lightMode },
    { value: 'high-contrast', label: t.highContrast },
  ];

  const timeSince = lastScrapeAt
    ? Math.floor((Date.now() - new Date(lastScrapeAt).getTime()) / 1000)
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
        padding: '0 16px',
        display: 'flex', alignItems: 'center', gap: '12px',
        height: '60px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '0 0 auto' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-blue))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: '800', color: '#fff',
            boxShadow: 'var(--glow-teal)',
          }}>🚂</div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>
              {t.appName}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'none' }}
              className="hide-mobile">
              ROHA → SURATHKAL · 738 KM
            </div>
          </div>
        </div>

        {/* View toggle */}
        <div style={{
          display: 'flex', gap: '4px', padding: '3px',
          background: 'var(--bg-elevated)', borderRadius: '10px',
          border: '1px solid var(--border-subtle)', marginLeft: '8px',
        }}>
          {(['schematic', 'map'] as ViewMode[]).map(m => (
            <button
              key={m}
              id={`view-toggle-${m}`}
              className="btn"
              onClick={() => setViewMode(m)}
              style={{
                padding: '5px 14px', fontSize: '0.8rem',
                borderRadius: '7px',
                background: viewMode === m
                  ? 'linear-gradient(135deg, var(--accent-blue), var(--accent-teal))'
                  : 'transparent',
                color: viewMode === m ? '#fff' : 'var(--text-secondary)',
                fontWeight: viewMode === m ? '700' : '500',
                transition: 'all 200ms',
              }}
            >
              {m === 'schematic' ? t.schematic : t.map}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* WS indicator + last updated */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}
          className="hide-mobile">
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: wsConnected ? '#22c55e' : '#ef4444',
            boxShadow: wsConnected ? '0 0 6px #22c55e' : '0 0 6px #ef4444',
          }} />
          {wsConnected ? 'Live' : 'Reconnecting...'}
          {timeSince !== null && (
            <span>· {t.lastUpdated} {timeSince}s {t.ago}</span>
          )}
        </div>

        {/* Language toggle */}
        <button
          id="lang-toggle"
          className="btn btn-ghost"
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          style={{ padding: '6px 12px', fontSize: '0.8rem', minWidth: '52px' }}
        >
          {language === 'en' ? 'हिं' : 'EN'}
        </button>

        {/* Theme selector */}
        <div style={{ position: 'relative' }}>
          <button
            id="theme-toggle"
            className="btn btn-ghost"
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            style={{ padding: '6px 10px', fontSize: '1rem' }}
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
