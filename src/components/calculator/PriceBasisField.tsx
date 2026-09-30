/**
 * PriceBasisField — which gold price a calculator uses: the live spot
 * price per gram, Antam's selling or buyback price, or one the user types
 * (e.g. a shop's quote).
 */
import type { DataStatus } from '@/lib/api';
import type { CalcCurrency } from '@/lib/calc';
import { fmtMoney } from '@/lib/calc';
import type { PriceBasis } from '@/lib/gramPrice';
import { registerStrings, useI18n } from '@/lib/i18n';
import { useAntam } from '@/lib/antam';
import { formatDateOnly } from '@/lib/gold';
import { cn, fill } from '@/lib/utils';
import { MoneyInput } from '../ui-atoms/MoneyInput';
import { SegToggle } from '../ui-atoms/SegToggle';
import { Field } from './Field';

registerStrings({
  'basis.label': { id: 'Harga emas per gram', en: 'Gold price per gram' },
  'basis.spot': { id: 'Spot', en: 'Spot' },
  'basis.antam': { id: 'Antam', en: 'Antam' },
  'basis.buyback': { id: 'Buyback', en: 'Buyback' },
  'basis.manual': { id: 'Isi sendiri', en: 'Custom' },
  'basis.antamHelp': {
    id: 'Harga jual Antam per gram (batangan 1 gram), per {date}.',
    en: "Antam's selling price per gram (1-gram bar), as of {date}.",
  },
  'basis.buybackHelp': {
    id: 'Harga buyback Antam per gram: yang Anda terima saat menjual kembali, per {date}.',
    en: "Antam's buyback price per gram, what you get when selling back, as of {date}.",
  },
  'basis.spotHelp': {
    id: 'Harga emas murni dunia dikonversi ke per gram. Harga toko/Antam biasanya lebih tinggi.',
    en: 'World pure-gold price converted per gram. Shop and Antam prices are usually higher.',
  },
  'basis.manualHelp': {
    id: 'Masukkan harga per gram emas murni dari toko atau aplikasi Anda.',
    en: 'Enter a pure-gold price per gram from your shop or app.',
  },
  'basis.unavailable': { id: 'Harga live belum tersedia', en: 'Live price not available yet' },
});

export function PriceBasisField({
  basis,
  onBasis,
  manualRaw,
  onManual,
  currency,
  perGram,
  status,
}: {
  basis: PriceBasis;
  onBasis: (b: PriceBasis) => void;
  manualRaw: string;
  onManual: (raw: string) => void;
  currency: CalcCurrency;
  perGram: number | null;
  status: DataStatus;
}) {
  const { lang, t } = useI18n();
  const antamDate = formatDateOnly(useAntam().priceDate, lang);
  const help = {
    spot: t('basis.spotHelp'),
    antam: fill(t('basis.antamHelp'), { date: antamDate }),
    buyback: fill(t('basis.buybackHelp'), { date: antamDate }),
    manual: t('basis.manualHelp'),
  }[basis];
  return (
    <Field label={t('basis.label')} htmlFor={basis === 'manual' ? 'basis-manual' : undefined} help={help}>
      <SegToggle
        ariaLabel={t('basis.label')}
        className="w-full [&>button]:flex-1"
        value={basis}
        onChange={onBasis}
        options={[
          { value: 'spot', label: t('basis.spot') },
          { value: 'antam', label: t('basis.antam') },
          { value: 'buyback', label: t('basis.buyback') },
          { value: 'manual', label: t('basis.manual') },
        ]}
      />
      {basis === 'manual' ? (
        <MoneyInput
          id="basis-manual"
          value={manualRaw}
          onChange={onManual}
          prefix={currency === 'idr' ? 'Rp' : '$'}
          decimals={currency === 'idr' ? 0 : 2}
          invalid={manualRaw.trim() !== '' && perGram === null}
        />
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-hairline bg-bg2 px-3 py-2.5 font-mono text-sm tabular">
          <span
            className={cn('h-1.5 w-1.5 rounded-full', status === 'live' && 'status-pulse')}
            style={{
              backgroundColor: status === 'live' ? 'var(--up)' : status === 'cached' ? 'var(--gold)' : 'var(--down)',
            }}
          />
          <span className="text-gold">{perGram !== null ? fmtMoney(perGram, currency, lang) : t('basis.unavailable')}</span>
        </div>
      )}
    </Field>
  );
}
