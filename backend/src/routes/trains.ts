import { Router, Request, Response } from 'express';
import {
  getAllTrains, getTrainByNumber, getTrainsByStationCode, getCacheStatus, getHistory
} from '../cache';

const router = Router();

function makeResponse<T>(data: T) {
  const status = getCacheStatus();
  return {
    success: true,
    data,
    trains: Array.isArray(data) ? data : undefined,
    stale: status.stale,
    staleSinceMinutes: status.staleSinceMinutes,
    lastScrapeAt: status.lastScrapeAt,
    lastUpdateAtUpstream: status.lastUpdateAtUpstream,
  };
}

// GET /api/trains — all currently running trains
router.get('/', (_req: Request, res: Response) => {
  res.json(makeResponse(getAllTrains()));
});

// GET /api/trains/:trainNumber — single train + history
router.get('/:trainNumber', (req: Request, res: Response) => {
  const train = getTrainByNumber(req.params.trainNumber);
  if (!train) {
    res.status(404).json({ success: false, error: 'Train not found or not currently running' });
    return;
  }
  const history = getHistory(req.params.trainNumber);
  res.json(makeResponse({ ...train, history }));
});

export default router;
