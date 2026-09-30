/**
 * MoneyInput — text input for amounts in the active language's number
 * format ("2.580.000" in ID, "2,580,000" in EN). Holds the raw string; the
 * owner parses it with `parseAmount`. On blur a valid value is re-grouped.
 */
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';
import { formatRaw, parseAmount } from '@/lib/number';

export interface MoneyInputProps {
  value: string;
  onChange: (raw: string) => void;
  /** Leading symbol, e.g. "Rp" or "$" */
  prefix?: string;
  /** Trailing unit, e.g. "%" or "gr" */
  suffix?: string;
  invalid?: boolean;
  /** Max fraction digits kept when re-grouping on blur */
  decimals?: number;
  id?: string;
  ariaLabel?: string;
  placeholder?: string;
  onEnter?: () => void;
  className?: string;
  inputClassName?: string;
}

export function MoneyInput({
  value,
  onChange,
  prefix,
  suffix,
  invalid = false,
  decimals = 2,
  id,
  ariaLabel,
  placeholder,
  onEnter,
  className,
  inputClassName,
}: MoneyInputProps) {
  const { lang } = useI18n();

  const onBlur = () => {
    const n = parseAmount(value, lang);
    if (!Number.isFinite(n)) return;
    const grouped = formatRaw(n, lang, decimals);
    if (grouped !== value) onChange(grouped);
  };

  return (
    <div
      className={cn(
        'flex items-center rounded-lg border bg-bg3 transition-colors focus-within:ring-2 focus-within:ring-gold/40',
        invalid ? 'border-down' : 'border-hairline',
        className,
      )}
    >
      {prefix && <span className="pl-3 font-mono text-sm text-t3">{prefix}</span>}
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={onEnter ? (e) => e.key === 'Enter' && onEnter() : undefined}
        aria-label={ariaLabel}
        aria-invalid={invalid}
        className={cn(
          'w-full min-w-0 bg-transparent px-3 py-2.5 text-right font-mono text-sm tabular text-t1 outline-none placeholder:text-t3',
          prefix && 'pl-2',
          suffix && 'pr-2',
          inputClassName,
        )}
      />
      {suffix && <span className="pr-3 font-mono text-sm text-t3">{suffix}</span>}
    </div>
  );
}
