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
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Unit } from './gold';

export type Lang = 'id' | 'en';

export interface StringEntry {
  id: string;
  en: string;
}

type Dict = Record<string, StringEntry>;

const registry: Dict = {};

/** Register translation keys (idempotent per key). Call at module scope. */
export function registerStrings(entries: Dict): void {
  for (const k of Object.keys(entries)) {
    if (!(k in registry)) registry[k] = entries[k];
  }
}

registerStrings({
  'nav.dashboard': { id: 'Dasbor', en: 'Dashboard' },
  'nav.analysis': { id: 'Analisis', en: 'Analysis' },
  'nav.calculator': { id: 'Kalkulator', en: 'Calculator' },
  'nav.about': { id: 'Tentang', en: 'About' },
  'common.live': { id: 'LIVE', en: 'LIVE' },
  'common.cached': { id: 'CACHE', en: 'CACHE' },
  'common.offline': { id: 'OFFLINE', en: 'OFFLINE' },
  'common.comingSoon': { id: 'Segera hadir', en: 'Coming soon' },
  'common.gold': { id: 'Emas', en: 'Gold' },
  'common.silver': { id: 'Perak', en: 'Silver' },
  'common.platinum': { id: 'Platinum', en: 'Platinum' },
  'common.palladium': { id: 'Paladium', en: 'Palladium' },
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

const LANG_KEY = 'emaskuy.lang';
const UNIT_KEY = 'emaskuy.unit';

function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'id' || saved === 'en') return saved;
  } catch {
    /* ignore */
  }
  const nav = typeof navigator !== 'undefined' ? navigator.language?.toLowerCase() ?? '' : '';
  // Default ID (primary audience); browser override when it starts with `en`.
  return nav.startsWith('en') ? 'en' : 'id';
}

function detectUnit(): Unit {
  try {
    const saved = localStorage.getItem(UNIT_KEY);
    if (saved === 'usd-oz' || saved === 'idr-gr') return saved;
  } catch {
    /* ignore */
  }
  return 'usd-oz';
}

export interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Translate a registered key. Falls back to the key itself when missing. */
  t: (key: string) => string;
  /** Display unit for prices, shared between navbar and hero. */
  unit: Unit;
  setUnit: (unit: Unit) => void;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);
  const [unit, setUnitState] = useState<Unit>(detectUnit);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const setUnit = useCallback((u: Unit) => {
    setUnitState(u);
    try {
      localStorage.setItem(UNIT_KEY, u);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: string): string => registry[key]?.[lang] ?? key,
    [lang],
  );

  const value = useMemo(
    () => ({ lang, setLang, t, unit, setUnit }),
    [lang, setLang, t, unit, setUnit],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
