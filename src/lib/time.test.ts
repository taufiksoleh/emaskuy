import { describe, expect, it } from 'vitest';
import { formatClock, formatClockZone, zoneLabel } from './time';

// 29 Sep 2026 02:15:30 UTC = 09:15:30 WIB
const T = Date.parse('2026-09-29T02:15:30Z');

describe('zoneLabel', () => {
  it('names the Indonesian zones', () => {
    expect(zoneLabel('Asia/Jakarta', T)).toBe('WIB');
    expect(zoneLabel('Asia/Pontianak', T)).toBe('WIB');
    expect(zoneLabel('Asia/Makassar', T)).toBe('WITA');
    expect(zoneLabel('Asia/Jayapura', T)).toBe('WIT');
  });

  it('falls back to a UTC offset elsewhere', () => {
    expect(zoneLabel('Asia/Kuala_Lumpur', T)).toBe('UTC+8');
    expect(zoneLabel('Europe/London', T)).toBe('UTC+1'); // BST in September
    expect(zoneLabel('UTC', T)).toBe('UTC');
  });
});

describe('formatClock', () => {
  it('uses a dot in Indonesian and a colon in English', () => {
    expect(formatClock(T, 'id', { tz: 'Asia/Jakarta' })).toBe('09.15');
    expect(formatClock(T, 'en', { tz: 'Asia/Jakarta' })).toBe('09:15');
    expect(formatClock(T, 'id', { tz: 'Asia/Jakarta', seconds: true })).toBe('09.15.30');
  });

  it('labels the zone', () => {
    expect(formatClockZone(T, 'id', { tz: 'Asia/Makassar' })).toBe('10.15 WITA');
    expect(formatClockZone(T, 'en', { tz: 'Asia/Jayapura' })).toBe('11:15 WIT');
  });
});
