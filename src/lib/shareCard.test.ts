import { describe, expect, it } from 'vitest';
import { CARD_AREA, CARD_FORMATS, CARD_SIZE, clampLines, fitFontSize, fitParagraphs, wrapLines } from './shareCard';

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

/** One unit per character, so widths are character counts. */
const chars = (s: string) => s.length;

describe('wrapLines', () => {
  it('breaks between words without exceeding the width', () => {
    expect(wrapLines('emas naik lagi hari ini', 10, chars)).toEqual(['emas naik', 'lagi hari', 'ini']);
  });

  it('breaks a word longer than the line by characters', () => {
    expect(wrapLines('a supercalifragilistic b', 8, chars)).toEqual(['a', 'supercal', 'ifragili', 'stic b']);
  });

  it('collapses extra whitespace and returns nothing for empty text', () => {
    expect(wrapLines('  satu   dua  ', 20, chars)).toEqual(['satu dua']);
    expect(wrapLines('   ', 20, chars)).toEqual([]);
  });
});

describe('clampLines', () => {
  it('leaves short text alone', () => {
    expect(clampLines(['satu', 'dua'], 3, 10, chars)).toEqual(['satu', 'dua']);
  });

  it('cuts to the limit and ends with an ellipsis that fits', () => {
    const out = clampLines(['emas naik', 'lagi hari', 'ini'], 2, 9, chars);
    expect(out).toEqual(['emas naik', 'lagi…']);
    expect(out.every((l) => l.length <= 9)).toBe(true);
  });

  it('drops trailing punctuation before the ellipsis', () => {
    expect(clampLines(['naik,', 'turun'], 1, 20, chars)).toEqual(['naik…']);
  });

  it('returns nothing when no line is allowed', () => {
    expect(clampLines(['a', 'b'], 0, 10, chars)).toEqual([]);
  });
});

describe('fitParagraphs', () => {
  // Characters are half as wide as the font size.
  const measureAt = (size: number) => (s: string) => s.length * size * 0.5;
  const spacing = { lineHeight: 1, gap: 0 };
  const bullets = ['aaaa bbbb cccc dddd', 'eeee ffff gggg hhhh'];

  it('picks the largest size at which everything fits', () => {
    // At 20 each 19-char bullet fits on one 190-wide line: 2 lines × 20 = 40.
    const fit = fitParagraphs(bullets, 200, 40, { max: 30, min: 10 }, measureAt, spacing);
    expect(fit).toMatchObject({ size: 20, clipped: false });
    expect(fit.blocks).toEqual([['aaaa bbbb cccc dddd'], ['eeee ffff gggg hhhh']]);
  });

  it('keeps whole paragraphs and cuts the next one short at the minimum size', () => {
    // At 10 each bullet wraps to 10px lines: 2 + 2 lines fit in 50px, leaving
    // one line for the third bullet, too few to start it.
    const three = [...bullets, 'iiii jjjj kkkk llll mmmm nnnn'];
    const fit = fitParagraphs(three, 50, 50, { max: 10, min: 10 }, measureAt, spacing);
    expect(fit.clipped).toBe(true);
    expect(fit.size).toBe(10);
    expect(fit.blocks[0]).toEqual(['aaaa bbbb', 'cccc dddd']);
    expect(fit.blocks[1]).toEqual(['eeee ffff', 'gggg hhhh']);
    expect(fit.blocks).toHaveLength(2);
  });

  it('cuts a paragraph with an ellipsis when at least two lines fit', () => {
    const fit = fitParagraphs(['aaaa bbbb cccc dddd eeee ffff'], 50, 20, { max: 10, min: 10 }, measureAt, spacing);
    expect(fit.clipped).toBe(true);
    // 10 characters × 5px fill the 50px line exactly.
    expect(fit.blocks).toEqual([['aaaa bbbb', 'cccc dddd…']]);
  });
});

describe('card sizes', () => {
  it('match WhatsApp chat, Instagram feed, status/story and TikTok formats', () => {
    expect(CARD_FORMATS).toEqual(['square', 'portrait', 'story', 'tiktok']);
    expect(CARD_SIZE.square).toEqual([1080, 1080]);
    expect(CARD_SIZE.portrait).toEqual([1080, 1350]);
    expect(CARD_SIZE.story).toEqual([1080, 1920]);
    expect(CARD_SIZE.tiktok).toEqual([1080, 1920]);
  });

  it('keep TikTok content clear of the app overlays and leave room to write', () => {
    const a = CARD_AREA.tiktok;
    // Top tabs, right-hand buttons, bottom caption and music.
    expect(a.top).toBeGreaterThanOrEqual(160);
    expect(a.right).toBeGreaterThanOrEqual(150);
    expect(a.bottom).toBeGreaterThanOrEqual(420);
    const [w, h] = CARD_SIZE.tiktok;
    expect(w - a.left - a.right).toBeGreaterThanOrEqual(800);
    expect(h - a.top - a.bottom).toBeGreaterThanOrEqual(1200);
  });
});
