/**
 * LangSuggest — offers the page in the visitor's browser language when it
 * is the other one of ours (English on /…, Indonesian on /en/…).
 *
 * Nothing redirects on the browser language: crawlers render with en-US and
 * each language has its own URLs. Either button saves the choice, so the
 * bar shows at most once.
 */
import { useState } from 'react';
import { Languages } from 'lucide-react';
import { useI18n, type Lang } from '@/lib/i18n';
import { hasSavedLang } from '@/lib/preferences';

const COPY: Record<Lang, { ask: string; yes: string; no: string }> = {
  en: { ask: 'View EmasKuy in English?', yes: 'English', no: 'Tetap Bahasa Indonesia' },
  id: { ask: 'Lihat EmasKuy dalam Bahasa Indonesia?', yes: 'Bahasa Indonesia', no: 'Stay in English' },
};

function suggestion(pageLang: Lang): Lang | null {
  if (typeof navigator === 'undefined' || hasSavedLang()) return null;
  if (/bot|crawl|spider|slurp|lighthouse|headless/i.test(navigator.userAgent)) return null;
  const preferred = (navigator.languages?.[0] ?? navigator.language ?? '').toLowerCase();
  const wants: Lang | null = preferred.startsWith('en') ? 'en' : preferred.startsWith('id') ? 'id' : null;
  return wants && wants !== pageLang ? wants : null;
}

export function LangSuggest() {
  const { lang, setLang } = useI18n();
  const [offer, setOffer] = useState(() => suggestion(lang));
  if (!offer || offer === lang) return null;

  const choose = (l: Lang) => {
    setLang(l);
    setOffer(null);
  };
  const copy = COPY[offer];

  return (
    <div className="border-b border-hairline bg-bg1" lang={offer}>
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 text-sm md:px-6">
        <span className="flex items-center gap-2 text-t2">
          <Languages className="h-4 w-4 text-gold" aria-hidden />
          {copy.ask}
        </span>
        <span className="flex gap-2">
          <button
            onClick={() => choose(offer)}
            className="cursor-pointer rounded-md bg-gold px-3 py-1 font-display text-xs font-semibold text-bg0"
          >
            {copy.yes}
          </button>
          <button
            onClick={() => choose(lang)}
            lang={lang}
            className="cursor-pointer rounded-md border border-hairline px-3 py-1 font-display text-xs font-medium text-t2 transition-colors hover:text-t1"
          >
            {copy.no}
          </button>
        </span>
      </div>
    </div>
  );
}
