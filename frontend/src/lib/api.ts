/**
 * Centralized API & WebSocket configuration for production and development.
 * Automatically handles protocol upgrades (http -> https, ws -> wss)
 * and intelligent fallbacks.
 */

function getResolvedEndpoints() {
  const isBrowser = typeof window !== 'undefined';
  const isHttps = isBrowser && window.location.protocol === 'https:';
  const host = isBrowser ? window.location.hostname : 'localhost';

  // 1. Check explicitly injected environment variables
  const envApi = import.meta.env.VITE_API_URL;
  const envWs = import.meta.env.VITE_WS_URL;

  let apiUrl = envApi;
  if (!apiUrl) {
    // In local dev or unconfigured deployment, use port 3001
    apiUrl = `${isHttps ? 'https' : 'http'}://${host}:3001`;
  }

  let wsUrl = envWs;
  if (!wsUrl) {
    // If API URL is provided, derive WebSocket URL automatically from it
    if (apiUrl.startsWith('https://')) {
      wsUrl = apiUrl.replace('https://', 'wss://') + '/ws/trains';
    } else if (apiUrl.startsWith('http://')) {
      wsUrl = apiUrl.replace('http://', 'ws://') + '/ws/trains';
    } else {
      wsUrl = `${isHttps ? 'wss' : 'ws'}://${host}:3001/ws/trains`;
    }
  }

  return {
    API_URL: apiUrl.replace(/\/+$/, ''),
    WS_URL: wsUrl,
  };
}

export const { API_URL, WS_URL } = getResolvedEndpoints();
