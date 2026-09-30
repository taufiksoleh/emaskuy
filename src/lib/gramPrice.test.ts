import { describe, expect, it } from 'vitest';
import { resolveGramPrice } from './gramPrice';

const live = { xauUsd: 4147.6, usdIdr: 17921.7, manual: NaN };

describe('resolveGramPrice', () => {
  it('converts spot to rupiah per gram', () => {
    expect(resolveGramPrice('spot', { ...live, currency: 'idr' })).toBeCloseTo(2_389_805, -2);
  });

  it('converts spot to dollars per gram', () => {
    expect(resolveGramPrice('spot', { ...live, currency: 'usd' })).toBeCloseTo(133.35, 2);
  });

  it('is unknown without a live price or rate', () => {
    expect(resolveGramPrice('spot', { ...live, xauUsd: 0, currency: 'usd' })).toBeNull();
    expect(resolveGramPrice('spot', { ...live, usdIdr: 0, currency: 'idr' })).toBeNull();
  });

  it('uses the typed price for the manual basis', () => {
    expect(resolveGramPrice('manual', { ...live, manual: 2_500_000, currency: 'idr' })).toBe(2_500_000);
    expect(resolveGramPrice('manual', { ...live, currency: 'idr' })).toBeNull();
  });
});

describe('Antam bases', () => {
  const antam = { sellPerGram: 2_580_000, buybackPerGram: 2_375_000 };

  it('uses the Antam sell or buyback price per gram', () => {
    expect(resolveGramPrice('antam', { ...live, currency: 'idr', antam })).toBe(2_580_000);
    expect(resolveGramPrice('buyback', { ...live, currency: 'idr', antam })).toBe(2_375_000);
  });

  it('converts them to dollars with the live rate', () => {
    expect(resolveGramPrice('antam', { ...live, currency: 'usd', antam })).toBeCloseTo(2_580_000 / 17921.7, 6);
    expect(resolveGramPrice('buyback', { ...live, usdIdr: 0, currency: 'usd', antam })).toBeNull();
  });
});
