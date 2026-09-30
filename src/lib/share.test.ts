import { describe, expect, it } from 'vitest';
import { buildDailyPriceText, buildResultText, formatShareDate, waLink } from './share';

const t = (key: string) => key;
// 30 Sep 2026 02:15 UTC = 09:15 WIB
const AT = Date.parse('2026-09-30T02:15:00Z');

describe('formatShareDate', () => {
  it('reads like a WhatsApp date line in WIB', () => {
    expect(formatShareDate(AT, 'id', 'Asia/Jakarta')).toBe('Rab, 30 Sep 2026 · 09.15 WIB');
    expect(formatShareDate(AT, 'en', 'Asia/Jakarta')).toBe('Wed, Sep 30, 2026 · 09:15 WIB');
  });
});

describe('buildDailyPriceText', () => {
  const base = {
    at: AT,
    lang: 'id' as const,
    tz: 'Asia/Jakarta',
    idrPerGram: 2_410_729,
    usdPerOz: 4183.8,
    changePct: 0.88,
    antam: { price: 2_580_000, buyback: 2_375_000, date: '2026-09-29' },
  };

  it('bolds the key prices and ends with the link', () => {
    const text = buildDailyPriceText(base, t);
    expect(text.split('\n')).toEqual([
      '*share.daily.title*',
      'Rab, 30 Sep 2026 · 09.15 WIB',
      '',
      '• share.daily.spot: *Rp2.410.729*/gram (▲ +0,88% share.daily.24h)',
      '• XAU/USD: $4.183,80/oz',
      '• Antam 1 gr: *Rp2.580.000* (29 Sep 2026)',
      '• share.buyback: Rp2.375.000/gram',
      '',
      'share.daily.live: https://emaskuy.com/',
      '_share.disclaimer_',
    ]);
  });

  it('drops lines without data', () => {
    const text = buildDailyPriceText({ ...base, usdPerOz: null, antam: null, changePct: null }, t);
    expect(text).not.toContain('XAU/USD');
    expect(text).not.toContain('Antam');
    expect(text).toContain('*Rp2.410.729*/gram\n');
  });

  it('marks a fall', () => {
    expect(buildDailyPriceText({ ...base, changePct: -1.2 }, t)).toContain('(▼ -1,20%');
  });
});

describe('sharing helpers', () => {
  it('builds a result message', () => {
    const text = buildResultText('Zakat', [['Emas', '100 gr'], ['Zakat', 'Rp6.000.000', true]], '/kalkulator/zakat', t);
    expect(text).toBe(
      '*Zakat*\n• Emas: 100 gr\n• Zakat: *Rp6.000.000*\n\nshare.try: https://emaskuy.com/kalkulator/zakat\n_share.disclaimer_',
    );
  });

  it('encodes WhatsApp links', () => {
    const link = waLink('*Harga* & Rp2.410.729\nbaris 2');
    expect(link.startsWith('https://wa.me/?text=')).toBe(true);
    expect(decodeURIComponent(link.slice('https://wa.me/?text='.length))).toBe('*Harga* & Rp2.410.729\nbaris 2');
  });
});
