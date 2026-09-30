import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, describe, expect, it } from 'vitest';
import { checkAntam, checkArticles, checkChangedFiles, checkInsight } from './validate-content.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (rel) => JSON.parse(readFileSync(path.join(ROOT, rel), 'utf8'));
const todayWib = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(Date.now());

const antam = () => ({
  schemaVersion: 1,
  priceDate: '2026-09-29',
  updatedAt: '2026-09-29T09:00:00+07:00',
  source: { name: 'Logam Mulia', url: 'https://www.logammulia.com/id/harga-emas-hari-ini' },
  note: { id: 'Harga resmi Antam hari ini.', en: 'Official Antam prices today.' },
  antam: {
    buybackPerGram: 2_375_000,
    sizes: [
      { grams: 1, sell: 2_580_000 },
      { grams: 5, sell: 12_675_000 },
    ],
  },
  history: [
    { date: '2026-09-28', sell1g: 2_597_000, buyback: null },
    { date: '2026-09-29', sell1g: 2_580_000, buyback: 2_375_000 },
  ],
});
const onDay = { today: '2026-09-29' };

describe('checkAntam', () => {
  it('accepts a valid file', () => {
    expect(checkAntam(antam(), onDay)).toEqual({ errors: [], warnings: [] });
  });

  it('accepts the committed file', () => {
    expect(checkAntam(readJson('src/content/antam.json'), { today: todayWib() }).errors).toEqual([]);
  });

  it('reports schema errors with their path', () => {
    const d = antam();
    d.antam.sizes[1].grams = 7;
    d.updatedAt = '2026-09-29T02:00:00Z';
    d.extra = true;
    const { errors } = checkAntam(d, onDay);
    expect(errors.some((e) => e.startsWith('antam.sizes.1.grams:'))).toBe(true);
    expect(errors.some((e) => e.startsWith('updatedAt:') && e.includes('WIB'))).toBe(true);
    expect(errors.some((e) => e.includes('extra'))).toBe(true);
  });

  it('checks other brands against the Antam price', () => {
    const d = antam();
    d.others = { galeri24: { sellPerGram: 2_490_000, buybackPerGram: 2_300_000 } };
    expect(checkAntam(d, onDay).errors).toEqual([]);

    d.others.ubs = { sellPerGram: 2_490_000, buybackPerGram: 2_490_000 };
    d.others.galeri24.sellPerGram = 249_000;
    d.others.galeri24.buybackPerGram = 230_000;
    expect(checkAntam(d, onDay).errors).toEqual([
      'others.galeri24.sellPerGram is 10% of the Antam 1 g price; check the digits',
      'others.ubs: buybackPerGram must be below sellPerGram',
    ]);
  });

  it('rejects a price date in the future', () => {
    expect(checkAntam(antam(), { today: '2026-09-28' }).errors).toEqual([expect.stringContaining('in the future')]);
  });

  it('requires the 1 g bar and unique sizes', () => {
    const noOne = antam();
    noOne.antam.sizes = [{ grams: 5, sell: 12_675_000 }];
    expect(checkAntam(noOne, onDay).errors).toContain('antam.sizes must include the 1 g bar');

    const dup = antam();
    dup.antam.sizes.push({ grams: 5, sell: 12_675_000 });
    expect(checkAntam(dup, onDay).errors).toContain('antam.sizes has duplicate sizes');
  });

  it('rejects a buyback at or above the selling price', () => {
    const d = antam();
    d.antam.buybackPerGram = 2_580_000;
    d.history[1].buyback = 2_580_000;
    expect(checkAntam(d, onDay).errors).toContain('buybackPerGram must be below the 1 g selling price');
  });

  it('rejects a spread outside 2–20%', () => {
    for (const buyback of [2_560_000, 1_900_000]) {
      const d = antam();
      d.antam.buybackPerGram = buyback;
      d.history[1].buyback = buyback;
      expect(checkAntam(d, onDay).errors).toEqual([expect.stringMatching(/spread .* outside 2–20%/)]);
    }
  });

  it('catches a per-gram price typed as the bar price', () => {
    const d = antam();
    d.antam.sizes[1].sell = 2_535_000;
    expect(checkAntam(d, onDay).errors).toEqual([expect.stringContaining('5 g costs 20% of the 1 g price per gram')]);
  });

  it('requires a sorted history without duplicate dates', () => {
    const unsorted = antam();
    unsorted.history.reverse();
    expect(checkAntam(unsorted, onDay).errors).toContain('history must be sorted by date without duplicates');

    const dup = antam();
    dup.history.unshift({ date: '2026-09-28', sell1g: 2_597_000, buyback: null });
    expect(checkAntam(dup, onDay).errors).toContain('history must be sorted by date without duplicates');
  });

  it("requires history's last entry to match today's prices", () => {
    const d = antam();
    d.history[1].sell1g = 2_597_000;
    expect(checkAntam(d, onDay).errors).toEqual([expect.stringContaining("history's last entry")]);

    const missingDay = antam();
    missingDay.history.pop();
    expect(checkAntam(missingDay, onDay).errors).toEqual([expect.stringContaining("history's last entry")]);
  });

  it('accepts a last entry without buyback', () => {
    const d = antam();
    d.history[1].buyback = null;
    expect(checkAntam(d, onDay).errors).toEqual([]);
  });

  it('rejects a 1 g price far from the previous file', () => {
    const previous = antam();
    previous.antam.sizes[0].sell = 258_000;
    expect(checkAntam(antam(), { ...onDay, previous }).errors).toEqual([expect.stringContaining('check the digits')]);
  });

  it('warns on a large daily move and on old prices', () => {
    const previous = antam();
    previous.antam.sizes[0].sell = 2_400_000;
    expect(checkAntam(antam(), { ...onDay, previous })).toEqual({
      errors: [],
      warnings: ['1 g price moved 7.5% since the last file'],
    });
    expect(checkAntam(antam(), { today: '2026-10-03' }).warnings).toEqual(['Antam prices are 4 days old']);
    expect(checkAntam(antam(), { today: '2026-10-02' }).warnings).toEqual([]);
  });
});

const insight = () => ({
  schemaVersion: 1,
  generatedAt: '2026-09-29T10:00:00+07:00',
  sentiment: 'neutral',
  bullets: [1, 2, 3].map((n) => ({ id: `Poin nomor ${n} untuk hari ini.`, en: `Point number ${n} for the day.` })),
});
const at = (iso) => Date.parse(iso);

describe('checkInsight', () => {
  it('accepts a valid insight and the committed file', () => {
    expect(checkInsight(insight(), { now: at('2026-09-29T12:00:00+07:00') })).toEqual({ errors: [], warnings: [] });
    expect(checkInsight(readJson('src/content/ai-insight.json'), { now: Date.now() }).errors).toEqual([]);
  });

  it('rejects an unknown sentiment and too few bullets', () => {
    const d = insight();
    d.sentiment = 'mixed';
    d.bullets.pop();
    const { errors } = checkInsight(d, { now: at('2026-09-29T12:00:00+07:00') });
    expect(errors.some((e) => e.startsWith('sentiment:'))).toBe(true);
    expect(errors.some((e) => e.startsWith('bullets:'))).toBe(true);
  });

  it('rejects a future timestamp and warns when old', () => {
    expect(checkInsight(insight(), { now: at('2026-09-29T08:00:00+07:00') }).errors).toEqual([
      expect.stringContaining('in the future'),
    ]);
    expect(checkInsight(insight(), { now: at('2026-10-03T10:00:00+07:00') }).warnings).toEqual([
      'AI insight is more than 3 days old',
    ]);
  });
});

describe('checkArticles', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'emaskuy-articles-'));
  writeFileSync(path.join(dir, 'article-ok.png'), Buffer.alloc(1000));
  writeFileSync(path.join(dir, 'article-big.png'), Buffer.alloc(400_001));
  writeFileSync(path.join(dir, 'article-ok.webp'), Buffer.alloc(1000));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  const now = at('2026-09-30T00:00:00Z');
  const article = ({ slug = 'a', image = "withBase('/article-ok.png')", publishedAt = '2026-09-29T04:00:00Z' } = {}) =>
    `  {\n    slug: '${slug}',\n    image: ${image},\n    publishedAt: Date.parse('${publishedAt}'),\n  },\n`;

  it('accepts valid articles and the committed file', () => {
    expect(checkArticles(article() + article({ slug: 'b' }), { publicDir: dir, now }).errors).toEqual([]);
    const source = readFileSync(path.join(ROOT, 'src/data/articles.ts'), 'utf8');
    expect(checkArticles(source, { publicDir: path.join(ROOT, 'public'), now: Date.now() }).errors).toEqual([]);
  });

  it('rejects duplicate slugs', () => {
    expect(checkArticles(article() + article(), { publicDir: dir, now }).errors).toEqual(['duplicate slugs: a']);
  });

  it('rejects unwrapped, missing and oversized images', () => {
    const check = (image) => checkArticles(article({ image }), { publicDir: dir, now }).errors;
    expect(check("'/article-ok.png'")).toEqual(["image '/article-ok.png' must be wrapped: withBase('/article-ok.png')"]);
    expect(check("withBase('/article-nope.png')")).toEqual(['image /article-nope.png is missing from public/']);
    expect(check("withBase('/article-big.png')")).toEqual(['image /article-big.png is over 400 KB']);
  });

  it('only accepts PNG and JPG images', () => {
    expect(checkArticles(article({ image: "withBase('/article-ok.webp')" }), { publicDir: dir, now }).errors).toEqual([
      expect.stringContaining('must be a PNG or JPG'),
    ]);
  });

  it('rejects invalid and future publish dates', () => {
    const check = (publishedAt) => checkArticles(article({ publishedAt }), { publicDir: dir, now }).errors;
    expect(check('someday')).toEqual(["publishedAt 'someday' is not a date"]);
    expect(check('2026-10-01T00:00:00Z')).toEqual([expect.stringContaining('in the future')]);
  });
});

describe('checkChangedFiles', () => {
  it('limits content branches to content files', () => {
    const allowed = ['src/content/antam.json', 'src/content/ai-insight.json', 'src/data/articles.ts', 'public/article-new-post.jpg'];
    expect(checkChangedFiles(allowed, 'content/2026-09-30').errors).toEqual([]);
    expect(
      checkChangedFiles([...allowed, 'package.json', 'src/App.tsx', 'public/article-new-post.webp'], 'content/2026-09-30').errors,
    ).toEqual([
      'content branches may not change package.json',
      'content branches may not change src/App.tsx',
      'content branches may not change public/article-new-post.webp',
    ]);
  });

  it('lets other branches change code', () => {
    expect(checkChangedFiles(['src/App.tsx', 'package.json', 'package-lock.json'], 'feat/x').errors).toEqual([]);
  });

  it('rejects a lockfile change without package.json on any branch', () => {
    expect(checkChangedFiles(['package-lock.json'], 'feat/x').errors).toEqual([
      'package-lock.json changed without package.json; run `npm ci`, not `npm install`',
    ]);
  });
});
