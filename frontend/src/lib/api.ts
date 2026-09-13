/**
 * Centralized API & WebSocket configuration for production and development.
 * Automatically handles protocol upgrades (http -> https, ws -> wss),
 * same-origin Vercel serverless deployments, and intelligent fallbacks.
 */

function isDummyPlaceholder(url?: string): boolean {
  if (!url) return true;
  return (
    url.includes('konkan-rail-backend.onrender.com') ||
    url.includes('your-backend-domain') ||
    url.includes('api.yourdomain.com')
  );
}

function getResolvedEndpoints() {
  const isBrowser = typeof window !== 'undefined';
  const isLocalhost = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const currentOrigin = isBrowser ? window.location.origin : 'http://localhost:5173';

  // Explicitly injected environment variables
  const envApi = import.meta.env.VITE_API_URL?.trim();
  const envWs = import.meta.env.VITE_WS_URL?.trim();

  let apiUrl = '';
  let wsUrl = '';

  if (isLocalhost) {
    // Local development mode
    apiUrl = (envApi && !isDummyPlaceholder(envApi)) ? envApi : 'http://localhost:3001';
    wsUrl = envWs || 'ws://localhost:3001/ws/trains';
  } else {
    // Deployed / Production mode (e.g. Vercel)
    if (envApi && !isDummyPlaceholder(envApi) && !envApi.includes('localhost')) {
      apiUrl = envApi.replace(/\/+$/, '');
      if (envWs) {
        wsUrl = envWs;
      } else if (apiUrl.startsWith('https://')) {
        wsUrl = apiUrl.replace('https://', 'wss://') + '/ws/trains';
      } else if (apiUrl.startsWith('http://')) {
        wsUrl = apiUrl.replace('http://', 'ws://') + '/ws/trains';
      }
    } else {
      // In production without external backend, use same-origin (Vercel serverless API)
      apiUrl = currentOrigin;
      // Vercel serverless does not maintain persistent WebSockets; use polling
      wsUrl = envWs && !isDummyPlaceholder(envWs) ? envWs : '';
    }
  }

  return {
    API_URL: apiUrl.replace(/\/+$/, ''),
    WS_URL: wsUrl,
    SAME_ORIGIN_URL: currentOrigin.replace(/\/+$/, ''),
  };
}

export const { API_URL, WS_URL, SAME_ORIGIN_URL } = getResolvedEndpoints();
