/**
 * EmasKuy — per-route titles and descriptions (ID/EN).
 *
 * One registry feeds the browser tab title and meta tags at runtime
 * (useDocumentMeta). Keep titles close to what people search for:
 * "harga emas hari ini", "kalkulator investasi emas", …
 */
import type { Lang } from './i18n';

export const SITE_NAME = 'EmasKuy';

export interface L10n {
  id: string;
  en: string;
}

export interface PageMeta {
  title: L10n;
  description: L10n;
  noindex?: boolean;
}

export const ROUTE_META = {
  home: {
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
    title: {
      id: 'Kalkulator Investasi Emas: Simulasi DCA & Lump Sum',
      en: 'Gold Investment Calculator: DCA & Lump-Sum Simulator',
    },
    description: {
      id: 'Simulasikan investasi emas sekaligus atau rutin (DCA) dengan harga emas live hari ini, lengkap dengan proyeksi per tahun.',
      en: "Simulate lump-sum or recurring (DCA) gold investing at today's live gold price, with a year-by-year projection.",
    },
  },
  portfolio: {
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

export type RouteKey = keyof typeof ROUTE_META;

export function fullTitle(title: string): string {
  return `${title} | ${SITE_NAME}`;
}

export function localize(meta: PageMeta, lang: Lang) {
  return {
    title: fullTitle(meta.title[lang]),
    description: meta.description[lang],
    noindex: meta.noindex ?? false,
  };
}
