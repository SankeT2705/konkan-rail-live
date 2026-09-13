import { useEffect, useRef } from 'react';
import { useTrainStore } from '../store/useTrainStore';
import { API_URL, WS_URL } from '../lib/api';

const RECONNECT_DELAY = 5000;

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { applyWsDiff, setTrains, setWsConnected } = useTrainStore();

  useEffect(() => {
    // Initial fetch via REST to immediately populate UI without waiting for WS handshake
    fetch(`${API_URL}/api/trains`)
      .then(res => res.json())
      .then(res => {
        const list = res.trains ?? res.data ?? [];
        if (Array.isArray(list) && list.length > 0) {
          setTrains(list, {
            stale: res.stale ?? false,
            staleSinceMinutes: res.staleSinceMinutes ?? 0,
            lastScrapeAt: res.lastScrapeAt ?? '',
            lastUpdateAtUpstream: res.lastUpdateAtUpstream ?? '',
          });
        }
      })
      .catch(err => console.warn('[api] Initial REST fetch error, relying on WS:', err));

    function connect() {
      try {
        ws.current = new WebSocket(WS_URL);
      } catch (e) {
        console.error('[ws] Failed to connect:', e);
        scheduleReconnect();
        return;
      }

      ws.current.onopen = () => {
        console.log('[ws] Connected');
        setWsConnected(true);
      };

      ws.current.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'snapshot') {
            setTrains(msg.trains ?? [], {
              stale: msg.stale ?? false,
              staleSinceMinutes: msg.staleSinceMinutes ?? 0,
              lastScrapeAt: msg.lastScrapeAt ?? '',
              lastUpdateAtUpstream: msg.lastUpdateAtUpstream ?? '',
            });
          } else if (msg.type === 'update') {
            applyWsDiff(msg.trains ?? [], msg.stale ?? false);
          }
        } catch (e) {
          console.error('[ws] Parse error:', e);
        }
      };

      ws.current.onerror = () => {
        console.warn('[ws] Error');
      };

      ws.current.onclose = () => {
        console.log('[ws] Disconnected. Reconnecting...');
        setWsConnected(false);
        scheduleReconnect();
      };
    }

    function scheduleReconnect() {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
    }

    connect();

    return () => {
      clearTimeout(reconnectTimer.current);
      ws.current?.close();
    };
  }, [applyWsDiff, setTrains, setWsConnected]);
}
