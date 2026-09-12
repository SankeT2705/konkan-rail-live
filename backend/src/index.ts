import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import healthRouter from './routes/health';
import trainsRouter from './routes/trains';
import stationsRouter from './routes/stations';
import { startScraper, attachWebSocketServer } from './scrapeService';

const PORT = parseInt(process.env.PORT ?? '3001', 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? '*';

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Request logger (minimal)
app.use((req, _res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// ── REST routes ────────────────────────────────────────────────────────────────
app.use('/api/health',   healthRouter);
app.use('/api/trains',   trainsRouter);
app.use('/api/stations', stationsRouter);

// Root ping (useful for keep-alive cron on free hosting)
app.get('/', (_req, res) => {
  res.send('Konkan Rail Live API is running. Visit /api/health for status.');
});

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

// ── WebSocket ──────────────────────────────────────────────────────────────────
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws/trains' });

wss.on('connection', (ws) => {
  console.log('[ws] Client connected');

  // Send current snapshot immediately on connect
  const { getAllTrains } = require('./cache');
  const { getCacheStatus } = require('./cache');
  const trains = getAllTrains();
  const status = getCacheStatus();
  ws.send(JSON.stringify({
    type: 'snapshot',
    trains,
    stale: status.stale,
    lastScrapeAt: status.lastScrapeAt,
    lastUpdateAtUpstream: status.lastUpdateAtUpstream,
  }));

  ws.on('close', () => console.log('[ws] Client disconnected'));
  ws.on('error', err => console.error('[ws] Error:', err.message));
});

attachWebSocketServer(wss);

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[server] Port ${PORT} is already in use. Terminating cleanly.`);
  } else {
    console.error(`[server] Server error:`, err);
  }
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`[server] Konkan Rail Live API listening on port ${PORT}`);
  startScraper();
});

export { app, server };
