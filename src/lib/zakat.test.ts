import { describe, expect, it } from 'vitest';
import { NISAB_GRAMS, computeZakat, type ZakatInput } from './zakat';

const base: ZakatInput = {
  investGrams: 0,
  jewelry: { grams: 0, kadar: 0.75, worn: false },
  includeWorn: false,
  haulMet: true,
  pricePerGram: 2_400_000,
};

describe('computeZakat', () => {
  it('is not due below the 85 g nisab', () => {
    const r = computeZakat({ ...base, investGrams: 84.9 });
    expect(r.due).toBe(false);
    expect(r.reason).toBe('below-nisab');
    expect(r.shortfallGrams).toBeCloseTo(0.1, 9);
    expect(r.zakatValue).toBe(0);
  });

  it('is due at exactly 85 g: 2.5% in grams and money', () => {
    const r = computeZakat({ ...base, investGrams: NISAB_GRAMS });
    expect(r.due).toBe(true);
    expect(r.zakatGrams).toBeCloseTo(2.125, 9);
    expect(r.zakatValue).toBeCloseTo(2.125 * 2_400_000, 3);
    expect(r.nisabValue).toBe(85 * 2_400_000);
    expect(r.progress).toBe(1);
  });

  it('waits for the haul', () => {
    const r = computeZakat({ ...base, investGrams: 100, haulMet: false });
    expect(r.due).toBe(false);
    expect(r.reason).toBe('haul-not-met');
    expect(r.zakatGrams).toBe(0);
  });

  it('counts stored jewelry by its pure-gold content', () => {
    const r = computeZakat({ ...base, investGrams: 70, jewelry: { grams: 20, kadar: 0.75, worn: false } });
    expect(r.jewelryPureGrams).toBe(15);
    expect(r.pureGrams).toBe(85);
    expect(r.due).toBe(true);
  });

  it('counts worn jewelry only when opted in', () => {
    const worn = { grams: 20, kadar: 0.75, worn: true };
    expect(computeZakat({ ...base, investGrams: 70, jewelry: worn }).due).toBe(false);
    expect(computeZakat({ ...base, investGrams: 70, jewelry: worn, includeWorn: true }).due).toBe(true);
  });

  it('still gives a verdict without a price (offline)', () => {
    const r = computeZakat({ ...base, investGrams: 100, pricePerGram: null });
    expect(r.due).toBe(true);
    expect(r.zakatGrams).toBeCloseTo(2.5, 9);
    expect(r.zakatValue).toBeNull();
    expect(r.nisabValue).toBeNull();
  });

  it('ignores negative and invalid input', () => {
    const r = computeZakat({ ...base, investGrams: -5, jewelry: { grams: NaN, kadar: 2, worn: false } });
    expect(r.pureGrams).toBe(0);
    expect(r.shortfallGrams).toBe(85);
  });
});
