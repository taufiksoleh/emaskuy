import { describe, expect, it } from 'vitest';
import {
  convertMoney,
  dailyRateLookup,
  defaultCurrency,
  defaultWeight,
  formatMoney,
  formatMoneyCompact,
  niceRound,
  pricePer,
  rateOnOrBefore,
  unitLabel,
} from './money';

const OZ = 31.1034768;
const rates = { IDR: 17_921.7, MYR: 4.081, JPY: 148.2 };

describe('formatMoney', () => {
  it('uses the currency symbol with the UI language separators', () => {
    expect(formatMoney(2_580_000, 'IDR', 'id')).toBe('Rp2.580.000');
    expect(formatMoney(2_580_000, 'IDR', 'en')).toBe('Rp2,580,000');
    expect(formatMoney(4147.6, 'USD', 'en')).toBe('$4,147.60');
    expect(formatMoney(1234.5, 'MYR', 'id')).toBe('RM1.234,50');
    expect(formatMoney(19_250.4, 'JPY', 'en')).toBe('¥19,250');
  });

  it('keeps letter symbols apart from the amount with a no-break space', () => {
    expect(formatMoney(12.5, 'SAR', 'en')).toBe('SAR\u00a012.50');
  });

  it('puts the minus before the symbol and never prints -0', () => {
    expect(formatMoney(-5, 'EUR', 'en')).toBe('-€5.00');
    expect(formatMoney(-0.001, 'USD', 'en')).toBe('$0.00');
    expect(formatMoney(-0.4, 'IDR', 'id')).toBe('Rp0');
  });

  it('accepts other decimals', () => {
    expect(formatMoney(4147.6, 'USD', 'en', { decimals: 0 })).toBe('$4,148');
  });
});

describe('formatMoneyCompact', () => {
  it('writes rupiah in words: rb/jt/M in Indonesian, k/M/B in English', () => {
    expect(formatMoneyCompact(-1_500_000, 'IDR', 'id')).toBe('-Rp1,5 jt');
    expect(formatMoneyCompact(250_000, 'IDR', 'id')).toBe('Rp250 rb');
    expect(formatMoneyCompact(250_000, 'IDR', 'en')).toBe('Rp250 k');
    expect(formatMoneyCompact(2_000_000_000, 'IDR', 'en')).toBe('Rp2.0 B');
  });

  it('uses k/M/B for other currencies', () => {
    expect(formatMoneyCompact(1200, 'USD', 'en')).toBe('$1.2k');
    expect(formatMoneyCompact(3_400_000, 'KRW', 'id')).toBe('₩3,4M');
    expect(formatMoneyCompact(950, 'AED', 'en')).toBe('AED 950');
  });
});

describe('pricePer', () => {
  it('converts USD per troy ounce to any currency and weight', () => {
    expect(pricePer(4147.6, 'USD', 'ozt', rates)).toBeCloseTo(4147.6, 9);
    expect(pricePer(4147.6, 'IDR', 'g', rates)).toBeCloseTo((4147.6 / OZ) * 17_921.7, 6);
    expect(pricePer(4147.6, 'MYR', 'tola', rates)).toBeCloseTo((4147.6 / OZ) * 11.6638038 * 4.081, 6);
    expect(pricePer(4147.6, 'USD', 'kg', rates)).toBeCloseTo((4147.6 / OZ) * 1000, 6);
  });

  it('uses the fixed pegs without published rates', () => {
    expect(pricePer(4147.6, 'SAR', 'g', {})).toBeCloseTo((4147.6 / OZ) * 3.75, 9);
    expect(pricePer(4147.6, 'AED', 'g', {})).toBeCloseTo((4147.6 / OZ) * 3.6725, 9);
  });

  it('is 0 without a price or rate', () => {
    expect(pricePer(0, 'USD', 'g', rates)).toBe(0);
    expect(pricePer(4147.6, 'THB', 'g', rates)).toBe(0);
  });
});

describe('convertMoney', () => {
  it('converts through the dollar', () => {
    expect(convertMoney(17_921.7, 'IDR', 'USD', rates)).toBeCloseTo(1, 9);
    expect(convertMoney(1_000_000, 'IDR', 'MYR', rates)).toBeCloseTo((1_000_000 / 17_921.7) * 4.081, 9);
    expect(convertMoney(5, 'EUR', 'EUR', {})).toBe(5);
  });

  it('is null when a rate is missing', () => {
    expect(convertMoney(1, 'IDR', 'THB', rates)).toBeNull();
  });
});

describe('daily rates', () => {
  const byDate = {
    '2026-09-25': { IDR: 17_914, MYR: 4.074 },
    '2026-09-28': { IDR: 17_977, MYR: 4.083 },
  };

  it('takes the rate of the day or the latest earlier one within a week', () => {
    expect(rateOnOrBefore(byDate, '2026-09-28', 'IDR')).toBe(17_977);
    expect(rateOnOrBefore(byDate, '2026-09-27', 'MYR')).toBe(4.074);
    expect(rateOnOrBefore(byDate, '2026-10-06', 'IDR')).toBe(0);
    expect(rateOnOrBefore(byDate, '2026-09-20', 'IDR')).toBe(0);
  });

  it('needs no table for the dollar and pegged currencies', () => {
    expect(rateOnOrBefore({}, '2026-09-28', 'USD')).toBe(1);
    expect(rateOnOrBefore({}, '2026-09-28', 'SAR')).toBe(3.75);
  });

  it('looks up one currency series the same way', () => {
    const on = dailyRateLookup({ '2026-09-25': 4.074, '2026-09-28': 4.083, '2026-09-10': 4.1 });
    expect(on('2026-09-28')).toBe(4.083);
    expect(on('2026-09-26')).toBe(4.074);
    expect(on('2026-09-01')).toBe(0);
    expect(on('2026-10-06')).toBe(0);
  });
});

describe('niceRound', () => {
  it('rounds to 1-2-5 steps on a log scale', () => {
    expect(niceRound(408)).toBe(500);
    expect(niceRound(2040)).toBe(2000);
    expect(niceRound(75_000)).toBe(100_000);
    expect(niceRound(7)).toBe(5);
    expect(niceRound(0)).toBe(0);
  });
});

describe('first-visit defaults', () => {
  it('picks the currency from the time zone', () => {
    expect(defaultCurrency('Asia/Jakarta', 'en')).toBe('IDR');
    expect(defaultCurrency('Asia/Makassar', 'en')).toBe('IDR');
    expect(defaultCurrency('Asia/Kuala_Lumpur', 'id')).toBe('MYR');
    expect(defaultCurrency('Asia/Hong_Kong', 'id')).toBe('HKD');
    expect(defaultCurrency('Asia/Riyadh', 'id')).toBe('SAR');
    expect(defaultCurrency('Europe/Berlin', 'en')).toBe('EUR');
    expect(defaultCurrency('Australia/Perth', 'en')).toBe('AUD');
  });

  it('falls back to the site language elsewhere', () => {
    expect(defaultCurrency('America/New_York', 'id')).toBe('IDR');
    expect(defaultCurrency('America/New_York', 'en')).toBe('USD');
    expect(defaultCurrency('', 'en')).toBe('USD');
  });

  it('quotes dollars per troy ounce and other currencies per gram', () => {
    expect(defaultWeight('USD')).toBe('ozt');
    expect(defaultWeight('HKD')).toBe('g');
    expect(unitLabel('IDR', 'g')).toBe('IDR/gr');
    expect(unitLabel('USD', 'ozt')).toBe('USD/oz');
  });
});
