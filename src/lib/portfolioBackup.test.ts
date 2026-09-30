import { describe, expect, it } from 'vitest';
import { exportCsv, exportJson, mergeHoldings, parseBackup } from './portfolioBackup';
import type { Holding } from './portfolio';

const h = (id: string, updatedAt: number, extra: Partial<Holding> = {}): Holding => ({
  id,
  type: 'antam',
  grams: 5,
  kadarPct: 100,
  buyPricePerGram: 2_580_000,
  currency: 'IDR',
  date: '2026-09-30',
  updatedAt,
  ...extra,
});

describe('parseBackup', () => {
  it('round-trips an export', () => {
    const r = parseBackup(exportJson([h('a', 1), h('b', 2)]));
    expect(r).toEqual({ ok: true, holdings: [h('a', 1), h('b', 2)], invalid: 0 });
  });

  it('accepts a bare v1 array and counts invalid rows', () => {
    const r = parseBackup(JSON.stringify([{ id: 'x', grams: 1, buyPriceIdrPerGram: 2_000_000 }, { id: 'bad' }]));
    expect(r.ok && r.holdings.length).toBe(1);
    expect(r.ok && r.invalid).toBe(1);
  });

  it.each([
    ['x'.repeat(1_000_001), 'too_large'],
    ['{not json', 'not_json'],
    [JSON.stringify({ app: 'other', kind: 'portfolio', holdings: [] }), 'wrong_app'],
    [JSON.stringify({ app: 'emaskuy', kind: 'portfolio', schemaVersion: 9, holdings: [] }), 'unsupported_version'],
    [JSON.stringify({ app: 'emaskuy', kind: 'portfolio', schemaVersion: 2, holdings: [] }), 'empty'],
    ['42', 'wrong_app'],
  ])('rejects %#', (text, error) => {
    expect(parseBackup(text)).toEqual({ ok: false, error });
  });
});

describe('mergeHoldings', () => {
  it('adds new ids, updates newer copies and skips the rest', () => {
    const r = mergeHoldings([h('a', 5), h('b', 5)], [h('a', 9, { grams: 7 }), h('b', 1), h('c', 1)]);
    expect(r.added).toBe(1);
    expect(r.updated).toBe(1);
    expect(r.skipped).toBe(1);
    expect(r.holdings.find((x) => x.id === 'a')?.grams).toBe(7);
    expect(r.holdings).toHaveLength(3);
  });
});

describe('exportCsv', () => {
  const label = (t: string) => (t === 'antam' ? 'Antam' : t);

  it('uses semicolons, decimal commas and a BOM for Indonesian Excel', () => {
    const csv = exportCsv([h('a', 1, { grams: 2.5, note: 'hadiah; ultah' })], 'id', label);
    expect(csv.startsWith('\uFEFFTanggal;Jenis;')).toBe(true);
    expect(csv).toContain('2026-09-30;Antam;2,5;100;2580000;6450000;"hadiah; ultah"\r\n');
  });

  it('uses commas and decimal points in English', () => {
    const csv = exportCsv([h('a', 1, { grams: 2.5 })], 'en', label);
    expect(csv).toContain('2026-09-30,Antam,2.5,100,2580000,6450000,\r\n');
  });

  it('defuses formulas and quotes quotes', () => {
    const csv = exportCsv([h('a', 1, { note: '=HYPERLINK("x")' })], 'en', label);
    expect(csv).toContain(`"'=HYPERLINK(""x"")"`);
  });
});
