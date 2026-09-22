/**
 * DeltaChip — pill with mono font, colored bg at 12% opacity of up/down,
 * colored text (design.md §9).
 */
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber, type FormatOpts } from '@/lib/gold';
import { useI18n } from '@/lib/i18n';

export interface DeltaChipProps {
  /** Signed percentage value, e.g. 0.42 or -1.8 */
  value: number;
  /** Optional leading text, e.g. absolute change string */
  prefix?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  formatOpts?: FormatOpts;
}

export function DeltaChip({ value, prefix, size = 'md', className, formatOpts }: DeltaChipProps) {
  const { lang } = useI18n();
  const positive = value >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-mono tabular font-medium',
        size === 'sm' && 'px-1.5 py-0.5 text-[11px]',
        size === 'md' && 'px-2 py-0.5 text-[13px]',
        size === 'lg' && 'px-3 py-1 text-sm',
        className,
      )}
      style={{
        backgroundColor: positive
          ? 'color-mix(in srgb, var(--up) 12%, transparent)'
          : 'color-mix(in srgb, var(--down) 12%, transparent)',
        color: positive ? 'var(--up)' : 'var(--down)',
      }}
    >
      <Icon className={size === 'lg' ? 'h-3.5 w-3.5' : 'h-3 w-3'} strokeWidth={2.5} />
      {prefix}
      {`${value > 0 ? '+' : value < 0 ? '-' : ''}${formatNumber(Math.abs(value), lang, formatOpts ?? { decimals: 2 })}%`}
    </span>
  );
}
