/**
 * EmasKuy — i18n context (design.md §8).
 *
 * Lightweight dictionary-based i18n. Page agents add their own keys by
 * calling `registerStrings({ ... })` once at module scope in their own files,
 * then consuming them with `const { t } = useI18n()`.
 *
 * ```ts
 * registerStrings({ 'calc.title': { id: 'Kalkulator Investasi', en: 'Investment Calculator' } });
 * const title = t('calc.title');
 * ```
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { LANG_KEY, detectLang, writePref } from './preferences';
import { registerStrings, translate, type Lang } from './strings';

export { registerStrings } from './strings';
export type { Lang, StringEntry } from './strings';

registerStrings({
  'nav.dashboard': { id: 'Dasbor', en: 'Dashboard' },
  'nav.analysis': { id: 'Analisis', en: 'Analysis' },
  'nav.calculator': { id: 'Kalkulator', en: 'Calculator' },
  'nav.portfolio': { id: 'Portofolio', en: 'Portfolio' },
  'nav.about': { id: 'Tentang', en: 'About' },
  'nav.main': { id: 'Navigasi utama', en: 'Main navigation' },
  'nav.skip': { id: 'Langsung ke konten', en: 'Skip to content' },
  // Calculator names: also used by the footer and home CTA.
  'calc.tab.investment': { id: 'Investasi', en: 'Investment' },
  'calc.tab.zakat': { id: 'Zakat Emas', en: 'Gold Zakat' },
  'calc.tab.jewelry': { id: 'Perhiasan', en: 'Jewelry' },
  'calc.tab.target': { id: 'Target Emas', en: 'Gold Target' },
  'nav.language': { id: 'Bahasa', en: 'Language' },
  'common.live': { id: 'LIVE', en: 'LIVE' },
  'common.cached': { id: 'CACHE', en: 'CACHE' },
  'common.offline': { id: 'OFFLINE', en: 'OFFLINE' },
  'common.comingSoon': { id: 'Segera hadir', en: 'Coming soon' },
  'common.gold': { id: 'Emas', en: 'Gold' },
  'common.silver': { id: 'Perak', en: 'Silver' },
  'common.platinum': { id: 'Platinum', en: 'Platinum' },
  'common.palladium': { id: 'Paladium', en: 'Palladium' },
  'common.saveFailed': {
    id: 'Gagal menyimpan: penyimpanan browser penuh atau diblokir. Perubahan belum tersimpan.',
    en: 'Could not save: browser storage is full or blocked. Your change was not saved.',
  },
  'common.offlineBanner': {
    id: 'Menampilkan data terakhir tersimpan',
    en: 'Showing last saved data',
  },
  'footer.tagline': {
    id: 'Terminal analisis emas real-time: harga live, grafik, dan kalkulator investasi.',
    en: 'Real-time gold analysis terminal: live prices, charts, and an investment calculator.',
  },
  'footer.sources': {
    id: 'Data harga: gold-api.com · Kurs: Frankfurter · Historis: NBP',
    en: 'Price data: gold-api.com · FX: Frankfurter · Historical: NBP',
  },
  'footer.disclaimer': {
    id: 'Konten di EmasKuy hanya untuk tujuan informasi dan edukasi — bukan nasihat keuangan. Data dapat tertunda. Kinerja masa lalu tidak menjamin hasil di masa depan.',
    en: 'EmasKuy content is for informational and educational purposes only — not financial advice. Data may be delayed. Past performance does not guarantee future results.',
  },
  'footer.navigate': { id: 'Navigasi', en: 'Navigate' },
  'footer.legal': { id: 'Legal', en: 'Legal' },
});

export interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Translate a registered key. Falls back to the key itself when missing. */
  t: (key: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    writePref(LANG_KEY, l);
  }, []);

  const t = useCallback((key: string): string => translate(key, lang), [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
