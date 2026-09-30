import { describe, expect, it } from 'vitest';
import { calcPresets, simulate, type CalcInputs } from './calc';

const base: CalcInputs = {
  mode: 'lump',
  initial: 10_000_000,
  monthly: 1_000_000,
  years: 10,
  growthPct: 0,
  buyPrice: 2_400_000,
  spreadPct: 0,
};

describe('simulate', () => {
  it('keeps value equal to invested at 0% growth and no spread', () => {
    const r = simulate(base);
    expect(r.finalValue).toBeCloseTo(r.totalInvested, 6);
    expect(r.grams).toBeCloseTo(10_000_000 / 2_400_000, 9);
  });

  it('charges the spread on every purchase', () => {
    const r = simulate({ ...base, spreadPct: 2 });
    expect(r.finalValue).toBeCloseTo(10_000_000 / 1.02, 2);
  });

  it('compounds the assumed growth', () => {
    const r = simulate({ ...base, growthPct: 8 });
    expect(r.finalValue).toBeCloseTo(10_000_000 * 1.08 ** 10, 0);
    expect(r.yearly).toHaveLength(10);
  });

  it('adds monthly contributions in DCA mode', () => {
    const r = simulate({ ...base, mode: 'dca', years: 2 });
    expect(r.totalInvested).toBe(10_000_000 + 24 * 1_000_000);
  });

  it('clamps the duration to 1–30 years', () => {
    expect(simulate({ ...base, years: 99 }).yearly).toHaveLength(30);
    expect(simulate({ ...base, years: 0 }).yearly).toHaveLength(1);
  });
});

describe('calcPresets', () => {
  it('keeps the hand-picked rupiah and dollar amounts', () => {
    expect(calcPresets('IDR', {}).initial).toBe(10_000_000);
    expect(calcPresets('USD', {}).chips.monthly).toEqual([25, 50, 100, 250]);
  });

  it('converts the dollar amounts to 1-2-5 steps in other currencies', () => {
    const myr = calcPresets('MYR', { MYR: 4.081 });
    expect(myr.initial).toBe(2000);
    expect(myr.monthly).toBe(500);
    expect(myr.chips.initial).toEqual([500, 2000, 5000, 20_000]);
    expect(calcPresets('JPY', { JPY: 148.2 }).initial).toBe(100_000);
  });

  it('falls back to dollar amounts without a rate', () => {
    expect(calcPresets('THB', {}).initial).toBe(500);
  });
});
