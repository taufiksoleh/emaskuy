import { describe, expect, it } from 'vitest';
import {
  antamData,
  antamOneGram,
  antamRows,
  brandRows,
  buybackPerGramFor,
  historyWithSpot,
  staleness,
  type AntamData,
} from './antam';
import { normalizeInsight } from './aiInsight';

const data: AntamData = {
  schemaVersion: 1,
  priceDate: '2026-09-29',
  updatedAt: '2026-09-29T09:00:00+07:00',
  source: { name: 'test', url: 'https://example.com' },
  note: { id: 'catatan', en: 'note' },
  antam: {
    buybackPerGram: 2_375_000,
    sizes: [
      { grams: 5, sell: 12_650_000 },
      { grams: 1, sell: 2_580_000 },
    ],
  },
  history: [
    { date: '2026-09-26', sell1g: 2_613_000, buyback: null },
    { date: '2026-09-29', sell1g: 2_580_000, buyback: 2_375_000 },
  ],
};

describe('antamRows', () => {
  it('sorts sizes and derives per-gram price, premium and spread', () => {
    const [one, five] = antamRows(data, 2_400_000);
    expect(one.grams).toBe(1);
    expect(one.perGram).toBe(2_580_000);
    expect(one.vsSpotPct).toBeCloseTo(7.5, 6);
    expect(one.buybackTotal).toBe(2_375_000);
    expect(one.spreadPct).toBeCloseTo((205_000 / 2_580_000) * 100, 6);
    expect(five.perGram).toBe(2_530_000);
  });

  it('leaves the premium empty without a spot price', () => {
    expect(antamRows(data, null)[0].vsSpotPct).toBeNull();
  });

  it('finds the 1 g price, or falls back to history', () => {
    expect(antamOneGram(data)).toBe(2_580_000);
    expect(antamOneGram({ ...data, antam: { ...data.antam, sizes: [{ grams: 5, sell: 1 }] } })).toBe(2_580_000);
  });
});

describe('other brands', () => {
  const withBrands: AntamData = { ...data, others: { galeri24: { sellPerGram: 2_490_000, buybackPerGram: 2_300_000 } } };

  it('values a bar at its own brand buyback when quoted, else at Antam buyback', () => {
    expect(buybackPerGramFor(withBrands, 'galeri24')).toBe(2_300_000);
    expect(buybackPerGramFor(withBrands, 'ubs')).toBe(2_375_000);
    expect(buybackPerGramFor(withBrands, 'antam')).toBe(2_375_000);
    expect(buybackPerGramFor(data, 'galeri24')).toBe(2_375_000);
  });

  it('lists Antam first and only the brands the file quotes', () => {
    expect(brandRows(data)).toEqual([]);
    const rows = brandRows(withBrands);
    expect(rows.map((r) => r.brand)).toEqual(['antam', 'galeri24']);
    expect(rows[0].sellPerGram).toBe(2_580_000);
    expect(rows[1].spreadPct).toBeCloseTo((190_000 / 2_490_000) * 100, 6);
  });
});

describe('staleness', () => {
  it('counts calendar days in WIB, not UTC', () => {
    // 30 Sep 16:59 UTC is still 30 Sep 23:59 WIB; one minute later it is 1 Oct.
    expect(staleness(data, Date.parse('2026-09-30T16:59:00Z'))).toEqual({ ageDays: 1, level: 'fresh' });
    expect(staleness(data, Date.parse('2026-09-30T17:00:00Z'))).toEqual({ ageDays: 2, level: 'aging' });
    expect(staleness(data, Date.parse('2026-10-03T12:00:00Z')).level).toBe('stale');
  });
});

describe('historyWithSpot', () => {
  it('pairs each Antam day with the latest spot fixing on or before it', () => {
    const spot = [
      { date: '2026-09-25', t: Date.parse('2026-09-25T00:00:00Z'), usd: 4200, idr: 2_420_000 },
      { date: '2026-09-29', t: Date.parse('2026-09-29T00:00:00Z'), usd: 4150, idr: 2_390_000 },
    ];
    expect(historyWithSpot(data, spot).map((r) => r.spot)).toEqual([2_420_000, 2_390_000]);
    expect(historyWithSpot(data, [])[0].spot).toBeNull();
  });
});

describe('committed content', () => {
  it('ships a usable Antam file', () => {
    const d = antamData();
    expect(antamOneGram(d)).toBeGreaterThan(0);
    expect(d.history[d.history.length - 1].date).toBe(d.priceDate);
  });
});

describe('normalizeInsight', () => {
  it('falls back to neutral for an unknown sentiment', () => {
    const r = normalizeInsight({ generatedAt: '2026-09-29T10:00:00+07:00', sentiment: 'moon', bullets: [] });
    expect(r.sentiment).toBe('neutral');
    expect(r.generatedAt).toBe(Date.parse('2026-09-29T03:00:00Z'));
    expect(r.sources).toEqual([]);
  });
});
