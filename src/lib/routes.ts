/**
 * EmasKuy — every page's URL in both languages. Indonesian pages live at the
 * root (/kalkulator/zakat), English ones under /en with English words
 * (/en/calculator/zakat). The URL decides the language; nothing redirects by
 * browser language.
 */
import type { Lang } from './strings';

export const PAGE_PATHS = {
  home: { id: '/', en: '/en' },
  analysis: { id: '/analisis', en: '/en/analysis' },
  calculator: { id: '/kalkulator', en: '/en/calculator' },
  calcZakat: { id: '/kalkulator/zakat', en: '/en/calculator/zakat' },
  calcJewelry: { id: '/kalkulator/perhiasan', en: '/en/calculator/jewelry' },
  calcTarget: { id: '/kalkulator/target', en: '/en/calculator/target' },
  portfolio: { id: '/portofolio', en: '/en/portfolio' },
  about: { id: '/tentang', en: '/en/about' },
} as const satisfies Record<string, Record<Lang, string>>;

export type PageKey = keyof typeof PAGE_PATHS;

/** In sitemap and navigation order. */
export const PAGE_KEYS = Object.keys(PAGE_PATHS) as PageKey[];

export const isPageKey = (key: string): key is PageKey => key in PAGE_PATHS;

export function pathFor(key: PageKey, lang: Lang): string {
  return PAGE_PATHS[key][lang];
}

const ARTICLE_BASE: Record<Lang, string> = { id: '/analisis/', en: '/en/analysis/' };

export function articlePath(slug: string, lang: Lang): string {
  return `${ARTICLE_BASE[lang]}${slug}`;
}

/** Metals other than gold (gold is the home page). */
export type MetalPageSymbol = 'XAG' | 'XPT' | 'XPD';
export const METAL_PAGES: MetalPageSymbol[] = ['XAG', 'XPT', 'XPD'];
const METAL_SLUGS: Record<MetalPageSymbol, Record<Lang, string>> = {
  XAG: { id: 'perak', en: 'silver' },
  XPT: { id: 'platinum', en: 'platinum' },
  XPD: { id: 'paladium', en: 'palladium' },
};
export const METAL_BASE: Record<Lang, string> = { id: '/logam/', en: '/en/metals/' };

export function metalPath(symbol: MetalPageSymbol, lang: Lang): string {
  return `${METAL_BASE[lang]}${METAL_SLUGS[symbol][lang]}`;
}

export function metalFromSlug(slug: string | undefined, lang: Lang): MetalPageSymbol | null {
  return METAL_PAGES.find((s) => METAL_SLUGS[s][lang] === slug) ?? null;
}

/** English under /en, else Indonesian. */
export function langOfPath(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'id';
}

/**
 * The same page in `lang`: /kalkulator/perhiasan ⇄ /en/calculator/jewelry,
 * /analisis/x ⇄ /en/analysis/x. Unknown pages go to that language's home.
 */
export function alternate(pathname: string, lang: Lang): string {
  const path = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const from = langOfPath(path);
  if (from === lang) return path;
  for (const key of PAGE_KEYS) {
    if (PAGE_PATHS[key][from] === path) return PAGE_PATHS[key][lang];
  }
  const base = ARTICLE_BASE[from];
  if (path.startsWith(base) && path.length > base.length) return articlePath(path.slice(base.length), lang);
  const metal = path.startsWith(METAL_BASE[from]) ? metalFromSlug(path.slice(METAL_BASE[from].length), from) : null;
  if (metal) return metalPath(metal, lang);
  return PAGE_PATHS.home[lang];
}
