import { describe, expect, it } from 'vitest';
import { ageInDays, formatDateOnly, formatIdr, formatUsd, parseLocalDate } from './gold';

describe('currency formatting', () => {
  it('puts the minus sign before the symbol', () => {
    expect(formatIdr(-123456, 'id')).toBe('-Rp123.456');
    expect(formatUsd(-5, 'en')).toBe('-$5.00');
  });

  it('never prints a negative zero', () => {
    expect(formatIdr(-0.4, 'id')).toBe('Rp0');
    expect(formatUsd(-0.001, 'en')).toBe('$0.00');
  });
});

describe('date-only strings', () => {
  // vitest.config.ts pins TZ=America/Los_Angeles, where Date.parse('2026-09-29')
  // is still 28 Sep locally.
  it('does not shift the day west of UTC', () => {
    expect(formatDateOnly('2026-09-29', 'id')).toBe('29 Sep 2026');
    expect(parseLocalDate('2026-09-29')?.getDate()).toBe(29);
  });

  it('counts calendar days', () => {
    const now = new Date(2026, 8, 30, 10).getTime();
    expect(ageInDays('2026-09-30', now)).toBe(0);
    expect(ageInDays('2026-09-29', now)).toBe(1);
    expect(ageInDays('2026-09-27', now)).toBe(3);
    expect(ageInDays('2026-10-01', now)).toBe(0);
  });
});
