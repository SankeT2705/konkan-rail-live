import { useEffect, useRef, useCallback } from 'react';
import { useTrainStore } from '../store/useTrainStore';
import { API_URL, WS_URL, SAME_ORIGIN_URL } from '../lib/api';
import fallbackData from '../data/fallbackTrains.json';

const REST_POLL_INTERVAL = 25_000;
const WS_RECONNECT_DELAY = 10_000;

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pollTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const isFetching = useRef<boolean>(false);

  const {
    applyWsDiff,
    setTrains,
    setWsConnected,
    setIsRestConnected,
    setFetchError,
    setLoading,
  } = useTrainStore();

  const fetchWithTimeout = async (url: string, timeoutMs = 6000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data;
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  };

  const fetchTrains = useCallback(async () => {
    if (isFetching.current) return;
    isFetching.current = true;

    // Build candidates list
    const candidates: string[] = [];
    if (API_URL) {
      candidates.push(`${API_URL}/api/trains`);
    }
    const relativeUrl = `${SAME_ORIGIN_URL}/api/trains`;
    if (!candidates.includes(relativeUrl)) {
      candidates.push(relativeUrl);
    }
    // Also try plain relative path
    if (!candidates.includes('/api/trains')) {
      candidates.push('/api/trains');
    }

    let success = false;
    for (const url of candidates) {
      try {
        const res = await fetchWithTimeout(url, 6000);
        const list = res.trains ?? res.data ?? [];
        if (Array.isArray(list) && list.length > 0) {
          setTrains(list, {
            stale: res.stale ?? false,
            staleSinceMinutes: res.staleSinceMinutes ?? 0,
            lastScrapeAt: res.lastScrapeAt ?? new Date().toISOString(),
            lastUpdateAtUpstream: res.lastUpdateAtUpstream ?? '',
          });
          setIsRestConnected(true);
          setFetchError(null);
          success = true;
          break;
        }
      } catch {
        // Try next candidate
      }
    }

    if (!success) {
      // Fallback if no candidate worked and we have no trains yet
      if (useTrainStore.getState().trains.length === 0) {
        console.warn('[api] All remote endpoints failed. Loading cached fallback dataset.');
        setTrains(fallbackData.trains as any, {
          stale: true,
          staleSinceMinutes: 5,
          lastScrapeAt: fallbackData.lastScrapeAt,
          lastUpdateAtUpstream: fallbackData.lastUpdateAtUpstream,
        });
        setFetchError('Live feed unreachable. Showing scheduled trains fallback.');
      }
      setIsRestConnected(false);
      setLoading(false);
    }

    isFetching.current = false;
  }, [setTrains, setIsRestConnected, setFetchError, setLoading]);

  useEffect(() => {
    // 1. Immediate initial fetch
    fetchTrains();

    // 2. Setup WebSocket if WS_URL is available
    function connectWs() {
      if (!WS_URL) return;

      try {
        ws.current = new WebSocket(WS_URL);
      } catch (e) {
        console.warn('[ws] Failed to initialize WebSocket:', e);
        scheduleWsReconnect();
        return;
      }

      ws.current.onopen = () => {
        console.log('[ws] Connected to live train stream');
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
        console.warn('[ws] Connection error');
      };

      ws.current.onclose = () => {
        setWsConnected(false);
        scheduleWsReconnect();
      };
    }

    function scheduleWsReconnect() {
      clearTimeout(reconnectTimer.current);
      if (WS_URL) {
        reconnectTimer.current = setTimeout(connectWs, WS_RECONNECT_DELAY);
      }
    }

    connectWs();

    // 3. Regular REST polling fallback (active when WS is disconnected or unsupported)
    pollTimer.current = setInterval(() => {
      const state = useTrainStore.getState();
      if (!state.wsConnected) {
        fetchTrains();
      }
    }, REST_POLL_INTERVAL);

    return () => {
      clearTimeout(reconnectTimer.current);
      clearInterval(pollTimer.current);
      ws.current?.close();
    };
  }, [fetchTrains, applyWsDiff, setTrains, setWsConnected]);
}
