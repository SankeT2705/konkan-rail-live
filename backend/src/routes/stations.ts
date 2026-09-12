import { Router, Request, Response } from 'express';
import { STATIONS, STATION_BY_CODE } from '../stations';
import { getTrainsByStationCode, getCacheStatus } from '../cache';

const router = Router();

function cacheHeaders(res: Response) {
  // Stations are static — cache aggressively
  res.set('Cache-Control', 'public, max-age=3600');
}

// GET /api/stations — full station list
router.get('/', (req: Request, res: Response) => {
  cacheHeaders(res);
  res.json({ success: true, data: STATIONS });
});

// GET /api/stations/:code/trains — trains at/near this station
router.get('/:code/trains', (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase();
  const station = STATION_BY_CODE.get(code);
  if (!station) {
    res.status(404).json({ success: false, error: 'Station not found' });
    return;
  }
  const status = getCacheStatus();
  const trains = getTrainsByStationCode(code);
  res.json({
    success: true,
    data: { station, trains },
    stale: status.stale,
    staleSinceMinutes: status.staleSinceMinutes,
    lastScrapeAt: status.lastScrapeAt,
  });
});

export default router;
