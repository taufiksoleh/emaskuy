import { describe, expect, it } from 'vitest';
import { resolveGramPrice } from './gramPrice';

const live = { xauUsd: 4147.6, rates: { IDR: 17921.7, MYR: 4.08 }, manual: NaN };

describe('resolveGramPrice', () => {
  it('converts spot to rupiah per gram', () => {
    expect(resolveGramPrice('spot', { ...live, currency: 'IDR' })).toBeCloseTo(2_389_805, -2);
  });

  it('converts spot to any currency per gram', () => {
    expect(resolveGramPrice('spot', { ...live, currency: 'MYR' })).toBeCloseTo((4147.6 / 31.1034768) * 4.08, 6);
    expect(resolveGramPrice('spot', { ...live, currency: 'SAR' })).toBeCloseTo((4147.6 / 31.1034768) * 3.75, 6);
  });

  it('converts spot to dollars per gram', () => {
    expect(resolveGramPrice('spot', { ...live, currency: 'USD' })).toBeCloseTo(133.35, 2);
  });

  it('is unknown without a live price or rate', () => {
    expect(resolveGramPrice('spot', { ...live, xauUsd: 0, currency: 'USD' })).toBeNull();
    expect(resolveGramPrice('spot', { ...live, rates: {}, currency: 'IDR' })).toBeNull();
  });

  it('uses the typed price for the manual basis', () => {
    expect(resolveGramPrice('manual', { ...live, manual: 2_500_000, currency: 'IDR' })).toBe(2_500_000);
    expect(resolveGramPrice('manual', { ...live, currency: 'IDR' })).toBeNull();
  });
});

describe('Antam bases', () => {
  const antam = { sellPerGram: 2_580_000, buybackPerGram: 2_375_000 };

  it('uses the Antam sell or buyback price per gram', () => {
    expect(resolveGramPrice('antam', { ...live, currency: 'IDR', antam })).toBe(2_580_000);
    expect(resolveGramPrice('buyback', { ...live, currency: 'IDR', antam })).toBe(2_375_000);
  });

  it('converts them to dollars with the live rate', () => {
    expect(resolveGramPrice('antam', { ...live, currency: 'USD', antam })).toBeCloseTo(2_580_000 / 17921.7, 6);
    expect(resolveGramPrice('buyback', { ...live, rates: {}, currency: 'USD', antam })).toBeNull();
  });
});
