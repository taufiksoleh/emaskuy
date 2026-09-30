import { describe, expect, it } from 'vitest';
import { formatRaw, parseAmount, reformatRaw } from './number';

describe('parseAmount (id)', () => {
  it.each([
    ['2.580.000', 2580000],
    ['1.000', 1000],
    ['1.000.000', 1000000],
    ['2.407.123,46', 2407123.46],
    ['2,5', 2.5],
    ['12,50', 12.5],
    ['Rp 1.250.000', 1250000],
    ['2,5%', 2.5],
    ['-1.234', -1234],
  ])('%s → %d', (raw, expected) => {
    expect(parseAmount(raw, 'id')).toBe(expected);
  });

  it('reads the dot as a decimal when it cannot be a thousands separator', () => {
    expect(parseAmount('557.1', 'id')).toBe(557.1);
    expect(parseAmount('12.50', 'id')).toBe(12.5);
    expect(parseAmount('0.500', 'id')).toBe(0.5);
    // v1 wrote this into the buy-price field and read it back as 240 million
    expect(parseAmount('2407123.46', 'id')).toBe(2407123.46);
  });

  it('rejects malformed text', () => {
    for (const raw of ['', 'abc', '1.23.456', '1,2,3', '1.2,3.4', '-', '.', 'Rp']) {
      expect(parseAmount(raw, 'id')).toBeNaN();
    }
  });
});

describe('parseAmount (en)', () => {
  it.each([
    ['2,407,123.46', 2407123.46],
    ['1,000', 1000],
    ['557.1', 557.1],
    ['$4,350', 4350],
    // Indonesian-formatted input in EN mode still parses
    ['2.407.123', 2407123],
    ['1,5', 1.5],
  ])('%s → %d', (raw, expected) => {
    expect(parseAmount(raw, 'en')).toBe(expected);
  });
});

describe('formatRaw round-trip', () => {
  it.each([0.5, 12.5, 1000, 2407123.46, 1e9])('%d survives id and en', (v) => {
    expect(parseAmount(formatRaw(v, 'id'), 'id')).toBe(v);
    expect(parseAmount(formatRaw(v, 'en'), 'en')).toBe(v);
  });

  it('writes grouped values without trailing zeros', () => {
    expect(formatRaw(2407123, 'id', 0)).toBe('2.407.123');
    expect(formatRaw(2407123.456, 'en', 2)).toBe('2,407,123.46');
    expect(formatRaw(2.5, 'id')).toBe('2,5');
  });

  it('reformats between languages', () => {
    expect(reformatRaw('2.407.123', 'id', 'en', 0)).toBe('2,407,123');
    expect(reformatRaw('250.000', 'id', 'en', 0)).toBe('250,000');
    expect(reformatRaw('77,39', 'id', 'en')).toBe('77.39');
    expect(reformatRaw('oops', 'id', 'en')).toBe('oops');
  });
});
