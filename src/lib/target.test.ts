import { describe, expect, it } from 'vitest';
import { simulate } from './calc';
import { computeTarget } from './target';

const price = 2_400_000;

describe('computeTarget', () => {
  it('splits the cost evenly at 0% growth and no spread', () => {
    const r = computeTarget({ targetGrams: 10, months: 12, growthPct: 0, spreadPct: 0, pricePerGram: price, initial: 0 });
    expect(r.monthly).toBeCloseTo((10 * price) / 12, 6);
    expect(r.totalPaid).toBeCloseTo(10 * price, 4);
  });

  it.each([12, 60, 120])('buys exactly the target over %i months', (months) => {
    const inp = { targetGrams: 25, months, growthPct: 8, spreadPct: 2, pricePerGram: price, initial: 5_000_000 };
    const { monthly } = computeTarget(inp);
    const sim = simulate({
      mode: 'dca',
      initial: inp.initial,
      monthly,
      years: 1,
      months,
      growthPct: inp.growthPct,
      buyPrice: price,
      spreadPct: inp.spreadPct,
    });
    expect(sim.grams).toBeCloseTo(25, 6);
  });

  it('needs nothing more when the initial amount already buys the target', () => {
    const r = computeTarget({ targetGrams: 1, months: 12, growthPct: 8, spreadPct: 0, pricePerGram: price, initial: price * 2 });
    expect(r.alreadyMet).toBe(true);
    expect(r.monthly).toBe(0);
  });

  it('projects the future price', () => {
    const r = computeTarget({ targetGrams: 10, months: 24, growthPct: 8, spreadPct: 0, pricePerGram: price, initial: 0 });
    expect(r.futurePrice).toBeCloseTo(price * 1.08 ** 2, 0);
  });

  it('is empty without a price', () => {
    const r = computeTarget({ targetGrams: 10, months: 12, growthPct: 8, spreadPct: 0, pricePerGram: 0, initial: 0 });
    expect(r.monthly).toBe(0);
    expect(r.alreadyMet).toBe(false);
  });
});
