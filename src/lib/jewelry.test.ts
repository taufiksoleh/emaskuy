import { describe, expect, it } from 'vitest';
import { KARAT_PURITY, computeJewelry } from './jewelry';

describe('computeJewelry', () => {
  it('values the gold content of 10 g of 18K', () => {
    const r = computeJewelry({ weightGrams: 10, kadarPct: 75, pricePerGram: 2_400_000, deductionPct: 0 });
    expect(r.pureGrams).toBe(7.5);
    expect(r.karat).toBe(18);
    expect(r.value).toBe(18_000_000);
    expect(r.perGram).toBe(1_800_000);
  });

  it('applies the shop deduction to the buy-back estimate', () => {
    const r = computeJewelry({ weightGrams: 10, kadarPct: 70, pricePerGram: 2_000_000, deductionPct: 10 });
    expect(r.value).toBe(14_000_000);
    expect(r.sellBack).toBe(12_600_000);
  });

  it('clamps nonsense input', () => {
    const r = computeJewelry({ weightGrams: -1, kadarPct: 150, pricePerGram: NaN, deductionPct: 200 });
    expect(r).toMatchObject({ pureGrams: 0, value: 0, sellBack: 0 });
    expect(r.karat).toBe(24);
  });

  it('lists standard hallmark purities', () => {
    const pct = Object.fromEntries(KARAT_PURITY.map((k) => [k.karat, k.pct]));
    expect(pct[18]).toBe(75);
    expect(pct[22]).toBe(91.6);
    expect(pct[9]).toBe(37.5);
  });
});
