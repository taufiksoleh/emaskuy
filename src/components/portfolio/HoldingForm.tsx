/**
 * HoldingForm — add or edit one holding: product type, weight, purity for
 * jewelry, price paid per gram, date and note.
 */
import { useState } from 'react';
import { toast } from 'sonner';
import { registerStrings, useI18n } from '@/lib/i18n';
import { isoDateLocal as todayIso } from '@/lib/gold';
import { formatRaw, parseAmount } from '@/lib/number';
import { PRODUCT_TYPES, type Holding, type ProductType } from '@/lib/portfolio';
import { cn } from '@/lib/utils';
import { Field } from '../calculator/Field';
import { KaratPicker } from '../calculator/KaratPicker';
import { MoneyInput } from '../ui-atoms/MoneyInput';

registerStrings({
  'portfolio.type': { id: 'Jenis emas', en: 'Type of gold' },
  'portfolio.type.antam': { id: 'Antam', en: 'Antam' },
  'portfolio.type.ubs': { id: 'UBS', en: 'UBS' },
  'portfolio.type.galeri24': { id: 'Galeri24', en: 'Galeri24' },
  'portfolio.type.lotus': { id: 'Lotus Archi', en: 'Lotus Archi' },
  'portfolio.type.digital': { id: 'Emas digital', en: 'Digital gold' },
  'portfolio.type.perhiasan': { id: 'Perhiasan', en: 'Jewelry' },
  'portfolio.type.lainnya': { id: 'Lainnya', en: 'Other' },
  'portfolio.grams': { id: 'Berat', en: 'Weight' },
  'portfolio.kadar': { id: 'Kadar perhiasan', en: 'Jewelry purity' },
  'portfolio.buyPrice': { id: 'Harga beli per gram', en: 'Buy price per gram' },
  'portfolio.buyPriceHelp': {
    id: 'Harga yang Anda bayar dibagi berat barangnya.',
    en: 'What you paid divided by the weight of the item.',
  },
  'portfolio.date': { id: 'Tanggal beli', en: 'Purchase date' },
  'portfolio.note': { id: 'Catatan (opsional)', en: 'Note (optional)' },
  'portfolio.invalid': {
    id: 'Isi berat, harga beli, dan kadar dengan benar.',
    en: 'Enter a valid weight, buy price and purity.',
  },
});

export interface HoldingDraft {
  type: ProductType;
  grams: number;
  kadarPct: number;
  buyPricePerGram: number;
  date: string;
  note?: string;
}

const inputCls =
  'w-full rounded-lg border border-hairline bg-bg3 px-3 py-2.5 font-mono text-sm tabular text-t1 outline-none transition-colors focus:border-goldline focus:ring-2 focus:ring-gold/40';

export function HoldingForm({
  idPrefix,
  initial,
  submitLabel,
  onSubmit,
}: {
  idPrefix: string;
  initial?: Holding;
  submitLabel: string;
  /** Returns true when saved; the add form then clears itself */
  onSubmit: (draft: HoldingDraft) => boolean;
}) {
  const { lang, t } = useI18n();
  const [type, setType] = useState<ProductType>(initial?.type ?? 'antam');
  const [gramsRaw, setGramsRaw] = useState(initial ? formatRaw(initial.grams, lang, 4) : '');
  const [kadarRaw, setKadarRaw] = useState(() =>
    formatRaw(initial?.type === 'perhiasan' ? initial.kadarPct : 75, lang, 1),
  );
  const [priceRaw, setPriceRaw] = useState(initial ? formatRaw(initial.buyPricePerGram, lang, 0) : '');
  const [date, setDate] = useState(initial?.date ?? todayIso());
  const [note, setNote] = useState(initial?.note ?? '');
  const [invalid, setInvalid] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const grams = parseAmount(gramsRaw, lang);
    const price = parseAmount(priceRaw, lang);
    const kadar = type === 'perhiasan' ? parseAmount(kadarRaw, lang) : 100;
    if (!(grams > 0) || !(price > 0) || !(kadar > 0 && kadar <= 100)) {
      setInvalid(true);
      toast.error(t('portfolio.invalid'));
      return;
    }
    setInvalid(false);
    const saved = onSubmit({
      type,
      grams,
      kadarPct: kadar,
      buyPricePerGram: price,
      date: date || todayIso(),
      note: note.trim() || undefined,
    });
    if (saved && !initial) {
      setGramsRaw('');
      setPriceRaw('');
      setDate(todayIso());
      setNote('');
    }
  };

  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label={t('portfolio.type')}>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('portfolio.type')}>
          {PRODUCT_TYPES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setType(p)}
              aria-pressed={type === p}
              className={cn(
                'cursor-pointer rounded-md border px-2.5 py-1 text-[12px] transition-colors',
                type === p
                  ? 'border-goldline bg-bg2 text-gold'
                  : 'border-hairline bg-bg2 text-t2 hover:border-goldline hover:text-gold',
              )}
            >
              {t(`portfolio.type.${p}`)}
            </button>
          ))}
        </div>
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t('portfolio.grams')} htmlFor={id('grams')}>
          <MoneyInput id={id('grams')} value={gramsRaw} onChange={setGramsRaw} suffix="gr" decimals={4} invalid={invalid} placeholder="5" />
        </Field>
        <Field label={t('portfolio.buyPrice')} htmlFor={id('price')} help={t('portfolio.buyPriceHelp')}>
          <MoneyInput
            id={id('price')}
            value={priceRaw}
            onChange={setPriceRaw}
            prefix="Rp"
            decimals={0}
            invalid={invalid}
            placeholder={lang === 'id' ? '2.580.000' : '2,580,000'}
          />
        </Field>
      </div>

      {type === 'perhiasan' && (
        <Field label={t('portfolio.kadar')} htmlFor={id('kadar')}>
          <KaratPicker id={id('kadar')} value={kadarRaw} onChange={setKadarRaw} invalid={invalid} />
        </Field>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t('portfolio.date')} htmlFor={id('date')}>
          <input id={id('date')} type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
        </Field>
        <Field label={t('portfolio.note')} htmlFor={id('note')}>
          <input
            id={id('note')}
            type="text"
            maxLength={200}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>

      <button
        type="submit"
        className="cursor-pointer self-start rounded-lg bg-gold px-5 py-2.5 font-display text-sm font-semibold text-bg0 transition-opacity hover:opacity-90"
      >
        {submitLabel}
      </button>
    </form>
  );
}
