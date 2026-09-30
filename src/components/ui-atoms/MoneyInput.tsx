/**
 * MoneyInput — text input for amounts in the active language's number
 * format ("2.580.000" in ID, "2,580,000" in EN). Holds the raw string; the
 * owner parses it with `parseAmount`. The thousands grouping redraws on
 * every keystroke (not just on blur), so it stays visible while typing.
 */
import { useLayoutEffect, useRef, type ChangeEvent } from 'react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';
import { formatRaw, formatWhileTyping, parseAmount, separatorsFor } from '@/lib/number';

/**
 * Count the characters in `raw` that `formatWhileTyping` would keep: every
 * digit, plus the decimal separator itself the first time it appears (only
 * when `decimals` allows one). Group separators and anything else dropped
 * by the formatter don't count — mirrors formatWhileTyping's own rules so
 * the count lines up with its output one-for-one.
 */
function countKept(raw: string, decSep: string, decimals: number): number {
  let n = 0;
  let sawDecimal = false;
  for (const ch of raw) {
    if (ch >= '0' && ch <= '9') n++;
    else if (ch === decSep && !sawDecimal && decimals > 0) {
      sawDecimal = true;
      n++;
    }
  }
  return n;
}

/** The index right after the `keptCount`-th kept character (digit or the
 * single decimal separator) in a `formatWhileTyping` result — skipping
 * over its purely decorative group separators without counting them. */
function caretAfterKept(formatted: string, groupSep: string, keptCount: number): number {
  if (keptCount <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (formatted[i] === groupSep) continue;
    seen++;
    if (seen === keptCount) return i + 1;
  }
  return formatted.length;
}

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
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCaretRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const caret = pendingCaretRef.current;
    pendingCaretRef.current = null;
    if (caret != null) inputRef.current?.setSelectionRange(caret, caret);
  }, [value]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const el = e.target;
    const { group, decimal } = separatorsFor(lang);
    const cursor = el.selectionStart ?? el.value.length;
    const keptBefore = countKept(el.value.slice(0, cursor), decimal, decimals);
    const formatted = formatWhileTyping(el.value, lang, decimals);
    const caret = caretAfterKept(formatted, group, keptBefore);
    // Write the filtered text straight to the DOM too: if `formatted`
    // equals the previous `value` (e.g. a stray letter got dropped
    // entirely), React bails out of re-rendering, and without this the
    // browser's own edit to the input would stay stuck on screen.
    el.value = formatted;
    el.setSelectionRange(caret, caret);
    pendingCaretRef.current = caret;
    onChange(formatted);
  };

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
        ref={inputRef}
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={onInputChange}
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
