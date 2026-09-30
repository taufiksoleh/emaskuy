import { describe, expect, it } from 'vitest';
import { CARD_SIZE, fitFontSize } from './shareCard';

describe('fitFontSize', () => {
  // Monospace digits are ~0.6em wide.
  const measure = (text: string) => (size: number) => text.length * size * 0.6;

  it('keeps the largest size that fits', () => {
    expect(fitFontSize(measure('Rp2.410.729'), 888, 168, 72)).toBe(134);
  });

  it('never goes below the minimum', () => {
    expect(fitFontSize(measure('Rp1.234.567.890.123.456'), 400, 168, 72)).toBe(72);
  });

  it('uses the maximum when there is room', () => {
    expect(fitFontSize(measure('$4,183'), 888, 168, 72)).toBe(168);
  });
});

describe('card sizes', () => {
  it('match WhatsApp chat and status formats', () => {
    expect(CARD_SIZE.square).toEqual([1080, 1080]);
    expect(CARD_SIZE.story).toEqual([1080, 1920]);
  });
});
