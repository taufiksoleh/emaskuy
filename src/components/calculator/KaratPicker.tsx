/**
 * KaratPicker — purity of jewelry gold: karat chips or a typed "kadar" %,
 * the way Indonesian shops quote it ("kadar 70%", "emas muda").
 */
import { registerStrings, useI18n } from '@/lib/i18n';
import { COMMON_KADAR_PCT, KARAT_PURITY } from '@/lib/jewelry';
import { formatRaw, parseAmount } from '@/lib/number';
import { cn } from '@/lib/utils';
import { MoneyInput } from '../ui-atoms/MoneyInput';

registerStrings({
  'karat.label': { id: 'Karat', en: 'Karat' },
  'karat.manual': { id: 'atau kadar (%)', en: 'or purity (%)' },
});

const chip =
  'cursor-pointer rounded-md border px-2 py-1 font-mono text-[11px] tabular transition-colors';

export function KaratPicker({
  id,
  value,
  onChange,
  invalid,
}: {
  id: string;
  /** Raw purity percent text */
  value: string;
  onChange: (raw: string) => void;
  invalid?: boolean;
}) {
  const { lang, t } = useI18n();
  const pct = parseAmount(value, lang);
  const pick = (p: number) => onChange(formatRaw(p, lang, 1));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('karat.label')}>
        {KARAT_PURITY.map((k) => (
          <button
            key={k.karat}
            type="button"
            onClick={() => pick(k.pct)}
            aria-pressed={pct === k.pct}
            title={`${k.karat}K = ${formatRaw(k.pct, lang, 1)}%`}
            className={cn(
              chip,
              pct === k.pct ? 'border-goldline bg-bg2 text-gold' : 'border-hairline bg-bg2 text-t2 hover:border-goldline hover:text-gold',
            )}
          >
            {k.karat}K
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-t3">{t('karat.manual')}</span>
        {COMMON_KADAR_PCT.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => pick(p)}
            aria-pressed={pct === p}
            className={cn(
              chip,
              pct === p ? 'border-goldline bg-bg2 text-gold' : 'border-hairline bg-bg3 text-t3 hover:text-gold',
            )}
          >
            {formatRaw(p, lang, 1)}%
          </button>
        ))}
        <MoneyInput
          id={id}
          value={value}
          onChange={onChange}
          suffix="%"
          decimals={1}
          invalid={invalid}
          className="w-28"
          inputClassName="py-1.5"
        />
      </div>
    </div>
  );
}
