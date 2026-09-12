import { Router, Request, Response } from 'express';
import { getCacheStatus } from '../cache';

const router = Router();
const START_TIME = Date.now();
const VERSION = '1.0.0';

router.get('/', (_req: Request, res: Response) => {
  const status = getCacheStatus();
  res.json({
    status: status.stale ? 'degraded' : 'ok',
    uptime: Math.floor((Date.now() - START_TIME) / 1000),
    lastScrapeAt: status.lastScrapeAt,
    lastScrapeSuccess: status.lastScrapeSuccess,
    stale: status.stale,
    staleSinceMinutes: status.staleSinceMinutes,
    trainCount: status.trainCount,
    version: VERSION,
  });
});

export default router;
