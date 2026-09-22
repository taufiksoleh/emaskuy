/**
 * MiniLivePrice — compact mono price chip with tick-flash, used in the
 * analysis index header and the article reader's sticky rail.
 */
import { useEffect, useRef, useState } from 'react';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { useI18n } from '@/lib/i18n';
import { convertPrice, formatUnitPrice, formatPct } from '@/lib/gold';
import { cn } from '@/lib/utils';

export function MiniLivePrice({ className }: { className?: string }) {
  const { lang, unit } = useI18n();
  const { gold, usdIdr, status } = useGoldPrice();
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const prevRef = useRef<number | null>(null);
  const price = gold?.price ?? 0;

  useEffect(() => {
    if (prevRef.current !== null && price !== prevRef.current) {
      setFlash(price > prevRef.current ? 'up' : 'down');
      const t = setTimeout(() => setFlash(null), 650);
      return () => clearTimeout(t);
    }
    prevRef.current = price;
  }, [price]);

  if (!gold) return null;
  const display = convertPrice(price, usdIdr, unit);
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border border-hairline bg-bg1 px-3 py-2 font-mono text-[13px] tabular',
        flash === 'up' && 'tick-up',
        flash === 'down' && 'tick-down',
        className,
      )}
    >
      <span
        className={cn('h-1.5 w-1.5 rounded-full', status === 'live' && 'status-pulse')}
        style={{
          backgroundColor:
            status === 'live' ? 'var(--up)' : status === 'cached' ? 'var(--gold)' : 'var(--down)',
        }}
      />
      <span className="text-gold">{price > 0 ? formatUnitPrice(display, unit, lang) : '—'}</span>
      <span style={{ color: gold.changePct >= 0 ? 'var(--up)' : 'var(--down)' }}>
        {formatPct(gold.changePct, lang)}
      </span>
    </div>
  );
}
