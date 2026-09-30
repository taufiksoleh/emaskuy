/**
 * LangSuggest — offers English to visitors whose browser prefers it.
 *
 * The site no longer auto-switches on the browser language (crawlers render
 * in en-US and would index English text on Indonesian pages). Either button
 * saves the choice, so the bar shows at most once.
 */
import { useState } from 'react';
import { Languages } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { hasSavedLang } from '@/lib/preferences';

function shouldSuggest(): boolean {
  if (typeof navigator === 'undefined' || hasSavedLang()) return false;
  const preferred = (navigator.languages?.[0] ?? navigator.language ?? '').toLowerCase();
  if (!preferred.startsWith('en')) return false;
  return !/bot|crawl|spider|slurp|lighthouse|headless/i.test(navigator.userAgent);
}

export function LangSuggest() {
  const { setLang } = useI18n();
  const [visible, setVisible] = useState(shouldSuggest);
  if (!visible) return null;

  const choose = (lang: 'id' | 'en') => {
    setLang(lang);
    setVisible(false);
  };

  return (
    <div className="border-b border-hairline bg-bg1" lang="en">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 text-sm md:px-6">
        <span className="flex items-center gap-2 text-t2">
          <Languages className="h-4 w-4 text-gold" aria-hidden />
          View EmasKuy in English?
        </span>
        <span className="flex gap-2">
          <button
            onClick={() => choose('en')}
            className="cursor-pointer rounded-md bg-gold px-3 py-1 font-display text-xs font-semibold text-bg0"
          >
            English
          </button>
          <button
            onClick={() => choose('id')}
            lang="id"
            className="cursor-pointer rounded-md border border-hairline px-3 py-1 font-display text-xs font-medium text-t2 transition-colors hover:text-t1"
          >
            Tetap Bahasa Indonesia
          </button>
        </span>
      </div>
    </div>
  );
}
