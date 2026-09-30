/**
 * DisplayPicker — the currency and weight unit prices are shown in. A
 * compact trigger ("IDR/gr") opens a dialog with every supported currency
 * and weight; the choice applies site-wide and is saved in this browser.
 */
import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useDisplay } from '@/hooks/useDisplay';
import { registerStrings, useI18n } from '@/lib/i18n';
import { formatNumber } from '@/lib/gold';
import { CURRENCIES, CURRENCY, WEIGHT, WEIGHT_UNITS, type WeightUnit } from '@/lib/money';
import { cn, fill } from '@/lib/utils';

registerStrings({
  'display.open': { id: 'Mata uang dan satuan harga: {label}. Ganti', en: 'Price currency and unit: {label}. Change' },
  'display.title': { id: 'Mata uang & satuan', en: 'Currency & unit' },
  'display.desc': {
    id: 'Harga emas di seluruh situs memakai pilihan ini. Tersimpan di browser ini.',
    en: 'Gold prices across the site use this choice. Saved in this browser.',
  },
  'display.currency': { id: 'Mata uang', en: 'Currency' },
  'display.weight': { id: 'Satuan berat', en: 'Weight unit' },
  'display.note': {
    id: 'Kurs referensi harian Bank Sentral Eropa. Riyal Saudi dan dirham UEA memakai patokan resminya terhadap dolar AS.',
    en: 'Daily European Central Bank reference rates. The Saudi riyal and UAE dirham use their official dollar pegs.',
  },
  'display.done': { id: 'Selesai', en: 'Done' },
  'display.close': { id: 'Tutup', en: 'Close' },
});

const option = (active: boolean) =>
  cn(
    'cursor-pointer rounded-lg border px-3 py-2 text-left transition-colors',
    active ? 'border-gold/70 bg-gold/10 text-gold' : 'border-hairline bg-bg2 text-t2 hover:border-goldline hover:text-t1',
  );

/** "31,1 gr", "≈3,33 gr · Aceh" */
function weightHint(w: WeightUnit, lang: 'id' | 'en'): string {
  const m = WEIGHT[w];
  const grams = `${m.approx ? '≈' : ''}${formatNumber(m.grams, lang, { decimals: 2, minDecimals: 0 })} gr`;
  return m.region ? `${grams} · ${m.region[lang]}` : grams;
}

export function DisplayPicker({ size = 'md', className }: { size?: 'sm' | 'md'; className?: string }) {
  const { lang, t } = useI18n();
  const d = useDisplay();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={fill(t('display.open'), { label: d.label })}
        aria-haspopup="dialog"
        className={cn(
          'inline-flex cursor-pointer items-center gap-1 rounded-lg border border-hairline bg-bg3 font-mono font-medium text-gold transition-colors hover:border-goldline',
          size === 'sm' ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs',
          className,
        )}
      >
        {d.label}
        <ChevronDown className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} aria-hidden />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="z-[100] max-h-[92dvh] gap-4 overflow-y-auto border-goldline bg-bg1 p-5 text-t1 sm:max-w-lg"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="font-display text-lg font-semibold text-t1">{t('display.title')}</DialogTitle>
              <DialogDescription className="mt-1 text-sm text-t2">{t('display.desc')}</DialogDescription>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t('display.close')}
              className="cursor-pointer rounded-md p-1 text-t3 transition-colors hover:text-t1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div role="group" aria-label={t('display.currency')}>
            <h3 className="label-micro">{t('display.currency')}</h3>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CURRENCIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={c === d.currency}
                  onClick={() => d.setCurrency(c)}
                  className={option(c === d.currency)}
                >
                  <span className="block font-mono text-sm font-semibold">
                    {c} <span className="font-normal text-t3">{CURRENCY[c].symbol}</span>
                  </span>
                  <span className="block truncate text-[11px] text-t3">{CURRENCY[c].name[lang]}</span>
                </button>
              ))}
            </div>
          </div>

          <div role="group" aria-label={t('display.weight')}>
            <h3 className="label-micro">{t('display.weight')}</h3>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {WEIGHT_UNITS.map((w) => (
                <button
                  key={w}
                  type="button"
                  aria-pressed={w === d.weight}
                  onClick={() => d.setWeight(w)}
                  className={option(w === d.weight)}
                >
                  <span className="block font-mono text-sm font-semibold">
                    {WEIGHT[w].short}
                    {WEIGHT[w].name[lang] !== WEIGHT[w].short && (
                      <span className="font-body text-[11px] font-normal text-t3"> {WEIGHT[w].name[lang]}</span>
                    )}
                  </span>
                  <span className="block truncate text-[11px] text-t3">{weightHint(w, lang)}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-t3">{t('display.note')}</p>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full cursor-pointer rounded-lg bg-gold py-2.5 font-display text-sm font-semibold text-bg0 transition-opacity hover:opacity-90"
          >
            {t('display.done')}
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
