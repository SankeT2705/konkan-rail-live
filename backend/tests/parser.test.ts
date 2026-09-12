/**
 * Parser unit tests — run against the local fixture HTML.
 * These tests must pass before any live scraping is attempted.
 *
 * Run with: npm test (in backend/)
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseTrainsFromHtml } from '../src/scrapeService';

const fixtureHtml = readFileSync(
  join(__dirname, '../fixtures/sample.html'),
  'utf-8'
);

describe('parseTrainsFromHtml', () => {
  const now = new Date('2026-09-12T22:30:00+05:30');
  let result: ReturnType<typeof parseTrainsFromHtml>;

  it('should parse without throwing', () => {
    result = parseTrainsFromHtml(fixtureHtml, now);
    expect(result).toBeDefined();
  });

  it('should report success', () => {
    result = parseTrainsFromHtml(fixtureHtml, now);
    expect(result.success).toBe(true);
  });

  it('should parse all 5 trains from the fixture', () => {
    result = parseTrainsFromHtml(fixtureHtml, now);
    expect(result.trains.length).toBe(5);
  });

  it('should correctly parse train 12133 (odd) as UP direction', () => {
    result = parseTrainsFromHtml(fixtureHtml, now);
    const train = result.trains.find(t => t.trainNumber === '12133');
    expect(train).toBeDefined();
    expect(train!.direction).toBe('up'); // 12133 is odd → up (Mangalore→Roha direction pair)
  });

  it('train 12134 (even) should be DOWN direction', () => {
    result = parseTrainsFromHtml(fixtureHtml, now);
    const train = result.trains.find(t => t.trainNumber === '12134');
    expect(train!.direction).toBe('down'); // 12134 is even → down (Roha→Mangalore)
  });


  it('train 11003 (odd) should be up direction', () => {
    result = parseTrainsFromHtml(fixtureHtml, now);
    const train = result.trains.find(t => t.trainNumber === '11003');
    expect(train!.direction).toBe('up');
  });

  it('should parse positive delay correctly (12133 = +15 min)', () => {
    result = parseTrainsFromHtml(fixtureHtml, now);
    const train = result.trains.find(t => t.trainNumber === '12133');
    expect(train!.delayMinutes).toBe(15);
  });

  it('should parse negative delay (early) correctly (12134 = -5 min)', () => {
    result = parseTrainsFromHtml(fixtureHtml, now);
    const train = result.trains.find(t => t.trainNumber === '12134');
    expect(train!.delayMinutes).toBe(-5);
  });

  it('should map station names to known station codes', () => {
    result = parseTrainsFromHtml(fixtureHtml, now);
    const ratnagiriTrain = result.trains.find(t => t.trainNumber === '12133');
    // "Ratnagiri" should map to our station data
    expect(ratnagiriTrain!.lastStationCode).toBeTruthy();
    expect(ratnagiriTrain!.progressKm).toBeGreaterThan(0);
  });

  it('should infer category: 12133 should be superfast (prefix 12)', () => {
    result = parseTrainsFromHtml(fixtureHtml, now);
    const train = result.trains.find(t => t.trainNumber === '12133');
    expect(train!.category).toBe('superfast');
  });

  it('should infer category: 56302 should be passenger', () => {
    result = parseTrainsFromHtml(fixtureHtml, now);
    const train = result.trains.find(t => t.trainNumber === '56302');
    expect(train!.category).toBe('passenger');
  });

  it('should include valid ISO timestamps', () => {
    result = parseTrainsFromHtml(fixtureHtml, now);
    result.trains.forEach(t => {
      expect(() => new Date(t.lastUpdatedAt)).not.toThrow();
      expect(new Date(t.lastUpdatedAt).getTime()).not.toBeNaN();
    });
  });

  it('should set scrapeResult.scrapedAt to the passed-in Date', () => {
    result = parseTrainsFromHtml(fixtureHtml, now);
    expect(result.scrapedAt).toBe(now.toISOString());
  });

  it('should accurately parse the live Konkan Railway upstream table', () => {
    const liveHtml = readFileSync(join(__dirname, '../fixtures/latest_upstream.html'), 'utf-8');
    const liveResult = parseTrainsFromHtml(liveHtml, now);
    expect(liveResult.success).toBe(true);
    expect(liveResult.trains.length).toBeGreaterThanOrEqual(20);

    // Train 11004 (TUTARI) at SAWARDA (155 km), delay "1:9" -> 69 mins
    const tutari = liveResult.trains.find(t => t.trainNumber === '11004');
    expect(tutari).toBeDefined();
    expect(tutari!.lastStationName).toBe('Sawarda');
    expect(tutari!.progressKm).toBe(155);
    expect(tutari!.delayMinutes).toBe(69);
    expect(tutari!.status).toBe('arrived');

    // No train should be parsed with station name "ARRIVED" or "LEFT"
    const badStations = liveResult.trains.filter(t => t.lastStationName === 'ARRIVED' || t.lastStationName === 'LEFT');
    expect(badStations.length).toBe(0);

    // All trains should have a valid station along route (> 0 km for known mid-route stations)
    const midRouteTrains = liveResult.trains.filter(t => t.lastStationCode !== 'ROHA');
    midRouteTrains.forEach(t => {
      expect(t.progressKm).toBeGreaterThan(0);
    });
  });
});
