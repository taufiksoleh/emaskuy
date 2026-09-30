/**
 * EmasKuy — per-route titles, descriptions and link-preview data (ID/EN).
 *
 * One registry feeds both the build-time prerendered HTML of every route
 * (src/seo/prerender.ts) and the runtime tags (useDocumentMeta). Keep
 * titles close to what people search for: "harga emas hari ini",
 * "kalkulator zakat emas", …
 */
import type { Article } from '@/data/articles';
import { ogImagePath } from './img';
import { PAGE_PATHS, articlePath, isPageKey } from './routes';
import type { Lang } from './strings';

export const SITE_NAME = 'EmasKuy';
export const SITE_URL = 'https://emaskuy.com';
const DEFAULT_OG_IMAGE = '/og-cover.png';

export interface L10n {
  id: string;
  en: string;
}

/** What kind of structured data the page gets. */
export type PageKind = 'home' | 'collection' | 'app' | 'faq' | 'none';

/** Titles and descriptions; the URLs are in routes.ts under the same keys. */
export interface PageMeta {
  title: L10n;
  description: L10n;
  kind?: PageKind;
  noindex?: boolean;
}

const ROUTES = {
  home: {
    kind: 'home',
    title: {
      id: 'Harga Emas Hari Ini: Live per Gram, Antam & Grafik',
      en: 'Gold Price Today: Live per Gram, Antam & Charts',
    },
    description: {
      id: 'Harga emas live per gram dalam Rupiah dan USD/oz, harga Antam, grafik histori sejak 2013, alert harga, dan kalkulator investasi emas.',
      en: 'Live gold price per gram in rupiah and USD/oz, Antam prices, history charts since 2013, price alerts and a gold investment calculator.',
    },
  },
  analysis: {
    kind: 'collection',
    title: {
      id: 'Analisis Harga Emas Terbaru & Prediksi Pasar',
      en: 'Latest Gold Price Analysis & Market Outlook',
    },
    description: {
      id: 'Analisis pasar emas terbaru: The Fed, rupiah, bank sentral, harga Antam, dan strategi investasi emas untuk investor Indonesia.',
      en: 'The latest gold market analysis: the Fed, the rupiah, central banks, Antam prices and gold investing strategies.',
    },
  },
  calculator: {
    kind: 'app',
    title: {
      id: 'Kalkulator Investasi Emas: Simulasi DCA & Lump Sum',
      en: 'Gold Investment Calculator: DCA & Lump-Sum Simulator',
    },
    description: {
      id: 'Simulasikan investasi emas sekaligus atau rutin (DCA) dengan harga emas live hari ini, lengkap dengan proyeksi per tahun.',
      en: "Simulate lump-sum or recurring (DCA) gold investing at today's live gold price, with a year-by-year projection.",
    },
  },
  calcZakat: {
    kind: 'app',
    title: {
      id: `Kalkulator Zakat Emas ${new Date().getFullYear()}: Nisab 85 Gram`,
      en: `Gold Zakat Calculator ${new Date().getFullYear()}: 85-Gram Nisab`,
    },
    description: {
      id: 'Hitung zakat emas dan perhiasan dengan harga emas hari ini: nisab 85 gram emas murni, zakat 2,5% setelah haul.',
      en: "Calculate zakat on gold and jewelry at today's gold price: an 85-gram nisab of pure gold and 2.5% after a lunar year.",
    },
  },
  calcJewelry: {
    kind: 'app',
    title: {
      id: 'Kalkulator Harga Emas Perhiasan per Gram (Karat & Kadar)',
      en: 'Gold Jewelry Value Calculator by Karat & Purity',
    },
    description: {
      id: 'Hitung nilai emas perhiasan dari berat dan kadar (24K, 22K, 18K, 17K, emas muda) dengan harga emas hari ini, plus perkiraan harga jual kembali.',
      en: "Work out the gold value of jewelry from its weight and karat at today's gold price, plus an estimated resale price.",
    },
  },
  calcTarget: {
    kind: 'app',
    title: {
      id: 'Kalkulator Target Tabungan Emas: Mahar, Umrah, Pendidikan',
      en: 'Gold Savings Target Calculator',
    },
    description: {
      id: 'Berapa yang perlu ditabung tiap bulan untuk punya sekian gram emas? Hitung rencana tabungan emas untuk mahar, umrah, atau pendidikan.',
      en: 'How much to save each month to own a set amount of gold? Plan gold savings for a dowry, umrah or education.',
    },
  },
  portfolio: {
    kind: 'app',
    title: {
      id: 'Portofolio Emas: Catat Pembelian & Untung Rugi',
      en: 'Gold Portfolio: Track Purchases and Profit/Loss',
    },
    description: {
      id: 'Catat pembelian emas Anda dan pantau nilai serta untung rugi secara live. Data tersimpan hanya di browser Anda.',
      en: 'Record your gold purchases and track value and profit/loss live. Data stays in your browser.',
    },
  },
  about: {
    kind: 'faq',
    title: {
      id: 'Tentang EmasKuy: Sumber Data & Metodologi',
      en: 'About EmasKuy: Data Sources & Methodology',
    },
    description: {
      id: 'Dari mana harga emas EmasKuy berasal dan bagaimana kami menghitung harga per gram dalam Rupiah.',
      en: 'Where EmasKuy gold prices come from and how we calculate the rupiah price per gram.',
    },
  },
  notFound: {
    title: { id: 'Halaman tidak ditemukan', en: 'Page not found' },
    description: {
      id: 'Halaman yang Anda cari tidak ada di EmasKuy.',
      en: 'The page you are looking for does not exist on EmasKuy.',
    },
    noindex: true,
  },
} satisfies Record<string, PageMeta>;

export type RouteKey = keyof typeof ROUTES;
export const ROUTE_META: Record<RouteKey, PageMeta> = ROUTES;

export function fullTitle(title: string): string {
  return `${title} | ${SITE_NAME}`;
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Everything that goes into <head> for one page. */
export interface HeadData {
  lang: Lang;
  title: string;
  description: string;
  /** Absolute URL, no trailing slash except the root */
  canonical?: string;
  /** Absolute URL of this page in each language (hreflang) */
  alternates?: Record<Lang, string>;
  /** Absolute URL */
  ogImage: string;
  ogType: 'website' | 'article';
  noindex: boolean;
}

export function routeHead(key: RouteKey, lang: Lang): HeadData {
  const meta = ROUTE_META[key];
  const paths = isPageKey(key) ? PAGE_PATHS[key] : null;
  return {
    lang,
    title: fullTitle(meta.title[lang]),
    description: meta.description[lang],
    canonical: paths ? absoluteUrl(paths[lang]) : undefined,
    alternates: paths ? { id: absoluteUrl(paths.id), en: absoluteUrl(paths.en) } : undefined,
    ogImage: absoluteUrl(DEFAULT_OG_IMAGE),
    ogType: 'website',
    noindex: meta.noindex ?? false,
  };
}

export function articleHead(article: Article, lang: Lang): HeadData {
  return {
    lang,
    title: fullTitle(article.title[lang]),
    description: article.excerpt[lang],
    canonical: absoluteUrl(articlePath(article.slug, lang)),
    alternates: { id: absoluteUrl(articlePath(article.slug, 'id')), en: absoluteUrl(articlePath(article.slug, 'en')) },
    ogImage: absoluteUrl(ogImagePath(article.image) ?? DEFAULT_OG_IMAGE),
    ogType: 'article',
    noindex: false,
  };
}
