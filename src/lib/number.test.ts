import { describe, expect, it } from 'vitest';
import { formatRaw, formatWhileTyping, parseAmount, reformatRaw } from './number';

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

describe('formatWhileTyping', () => {
  it('groups the integer part as digits accumulate (id)', () => {
    expect(formatWhileTyping('1', 'id', 0)).toBe('1');
    expect(formatWhileTyping('12', 'id', 0)).toBe('12');
    expect(formatWhileTyping('123', 'id', 0)).toBe('123');
    expect(formatWhileTyping('1234', 'id', 0)).toBe('1.234');
    expect(formatWhileTyping('1234567', 'id', 0)).toBe('1.234.567');
  });

  it('groups with the en-US separator', () => {
    expect(formatWhileTyping('1234567', 'en', 0)).toBe('1,234,567');
  });

  it('keeps a decimal part typed with the active language separator', () => {
    expect(formatWhileTyping('2500,5', 'id', 2)).toBe('2.500,5');
    expect(formatWhileTyping('2500.5', 'en', 2)).toBe('2,500.5');
  });

  it('caps the fraction at the given number of decimals', () => {
    expect(formatWhileTyping('1,23456', 'id', 4)).toBe('1,2345');
    // with decimals=0 there is no decimal separator at all, so a comma is
    // just dropped and the digits on both sides merge as one integer
    expect(formatWhileTyping('1,5', 'id', 0)).toBe('15');
  });

  it('drops the other language\'s separators and any other stray characters, then regroups the remaining digits', () => {
    // a manually typed group separator is dropped, but the digits it left
    // still get regrouped by our own logic — "1234" groups the same way
    expect(formatWhileTyping('1.234', 'id', 0)).toBe('1.234');
    // "." is not id's decimal mark, so it's dropped and every digit
    // (both sides of it) becomes part of the integer, then regrouped
    expect(formatWhileTyping('2500.5', 'id', 2)).toBe('25.005');
    expect(formatWhileTyping('Rp 1000', 'id', 0)).toBe('1.000');
  });

  it('collapses redundant leading zeros but keeps a lone one', () => {
    expect(formatWhileTyping('0', 'id', 0)).toBe('0');
    expect(formatWhileTyping('00', 'id', 0)).toBe('0');
    expect(formatWhileTyping('0500', 'id', 0)).toBe('500');
  });

  it('every prefix of a typed number round-trips through parseAmount', () => {
    const target = '2580000';
    let typed = '';
    for (const ch of target) {
      typed += ch;
      const shown = formatWhileTyping(typed, 'id', 0);
      expect(parseAmount(shown, 'id')).toBe(Number(typed));
    }
  });
});
