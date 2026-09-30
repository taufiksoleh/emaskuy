import { describe, expect, it } from 'vitest';
import { PAGE_KEYS, PAGE_PATHS, alternate, articlePath, langOfPath, pathFor } from './routes';

describe('routes', () => {
  it('gives every page an Indonesian path at the root and an English one under /en', () => {
    for (const key of PAGE_KEYS) {
      expect(langOfPath(PAGE_PATHS[key].id)).toBe('id');
      expect(langOfPath(PAGE_PATHS[key].en)).toBe('en');
    }
    expect(pathFor('calcJewelry', 'id')).toBe('/kalkulator/perhiasan');
    expect(pathFor('calcJewelry', 'en')).toBe('/en/calculator/jewelry');
    expect(articlePath('gold-vs-stocks-2026', 'en')).toBe('/en/analysis/gold-vs-stocks-2026');
  });

  it('reads the language from the path, not from lookalikes', () => {
    expect(langOfPath('/en')).toBe('en');
    expect(langOfPath('/en/analysis/x')).toBe('en');
    expect(langOfPath('/')).toBe('id');
    expect(langOfPath('/energi')).toBe('id');
  });

  it('finds the same page in the other language', () => {
    expect(alternate('/kalkulator/perhiasan', 'en')).toBe('/en/calculator/jewelry');
    expect(alternate('/en/calculator/jewelry', 'id')).toBe('/kalkulator/perhiasan');
    expect(alternate('/', 'en')).toBe('/en');
    expect(alternate('/en', 'id')).toBe('/');
    expect(alternate('/tentang/', 'en')).toBe('/en/about');
    expect(alternate('/analisis/gold-vs-stocks-2026', 'en')).toBe('/en/analysis/gold-vs-stocks-2026');
    expect(alternate('/en/analysis/gold-vs-stocks-2026', 'id')).toBe('/analisis/gold-vs-stocks-2026');
  });

  it('maps metal pages by their own slugs', () => {
    expect(alternate('/logam/perak', 'en')).toBe('/en/metals/silver');
    expect(alternate('/en/metals/palladium', 'id')).toBe('/logam/paladium');
    expect(alternate('/logam/emas', 'en')).toBe('/en');
  });

  it('stays put in the same language and sends unknown pages home', () => {
    expect(alternate('/portofolio', 'id')).toBe('/portofolio');
    expect(alternate('/tidak-ada', 'en')).toBe('/en');
    expect(alternate('/en/nope', 'id')).toBe('/');
  });
});
