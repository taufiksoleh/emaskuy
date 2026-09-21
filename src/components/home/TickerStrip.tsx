/**
 * Section 0 — Ticker strip: full-width 40px marquee, hairlines top+bottom.
 * Hover pauses; item hover shows "updated ago"; click non-XAU → toast.
 */
import { useMemo } from 'react';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { formatUsd, formatIdr, formatAgo, xauUsdToIdrGram, type Unit } from '@/lib/gold';
import type { MetalSymbol } from '@/lib/api';
import { cn } from '@/lib/utils';
import { DeltaChip } from '../ui-atoms/DeltaChip';

interface TickerItem {
  id: string;
  symbol: string;
  nameKey?: string;
  render: () => string;
  deltaPct: number;
  updatedAt: number;
  isGold: boolean;
}

export function TickerStrip() {
  const { lang, t, unit } = useI18n();
  const { metals, usdIdr, status, loading } = useGoldPrice();

  const items = useMemo<TickerItem[]>(() => {
    const nameKeys: Record<MetalSymbol, string> = {
      XAU: 'common.gold',
      XAG: 'common.silver',
      XPT: 'common.platinum',
      XPD: 'common.palladium',
    };
    const list: TickerItem[] = metals
      .filter((m) => m.price > 0)
      .map((m) => ({
        id: m.symbol,
        symbol: `${m.symbol}/USD`,
        nameKey: nameKeys[m.symbol],
        render: () => formatUsd(m.price, lang),
        deltaPct: m.changePct,
        updatedAt: m.updatedAt,
        isGold: m.symbol === 'XAU',
      }));
    if (usdIdr > 0) {
      list.push({
        id: 'USDIDR',
        symbol: 'USD/IDR',
        render: () => formatIdr(usdIdr, lang),
        deltaPct: 0,
        updatedAt: Date.now(),
        isGold: false,
      });
    }
    const gold = metals.find((m) => m.symbol === 'XAU');
    if (gold && gold.price > 0 && usdIdr > 0) {
      list.push({
        id: 'XAUGR',
        symbol: 'XAU/IDR gr',
        render: () => formatIdr(xauUsdToIdrGram(gold.price, usdIdr), lang),
        deltaPct: gold.changePct,
        updatedAt: gold.updatedAt,
        isGold: true,
      });
    }
    return list;
  }, [metals, usdIdr, lang]);

  if (items.length === 0) {
    return (
      <div className="sticky top-16 z-40 flex h-10 items-center overflow-hidden border-b border-hairline bg-bg1 px-4">
        {loading ? (
          <div className="skeleton-shimmer h-4 w-64 rounded" />
        ) : (
          <span className="font-mono text-xs tabular text-t3">{t('common.offlineBanner')}</span>
        )}
      </div>
    );
  }

  const onClick = (item: TickerItem) => {
    if (!item.isGold) {
      toast(t('common.comingSoon'), {
        description: item.symbol,
      });
    }
  };

  const row = (keyPrefix: string) => (
    <div className="flex h-10 shrink-0 items-center" aria-hidden={keyPrefix === 'b'}>
      {items.map((item) => (
        <button
          key={`${keyPrefix}-${item.id}`}
          onClick={() => onClick(item)}
          title={`${item.nameKey ? t(item.nameKey) : item.symbol} · ${formatAgo(item.updatedAt, lang)}`}
          className="group flex h-full cursor-pointer items-center gap-2.5 border-r border-hairline px-5 transition-colors hover:bg-bg2"
        >
          <span className="label-micro group-hover:text-t2">{item.symbol}</span>
          <span
            className="font-mono text-[13px] font-medium tabular text-t1"
            key={unit /* re-render on unit switch for consistency */}
          >
            {item.render()}
          </span>
          {item.deltaPct !== 0 && <DeltaChip value={item.deltaPct} size="sm" />}
          {status !== 'live' && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
        </button>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        'marquee-paused sticky top-16 z-40 h-10 overflow-hidden border-b border-hairline bg-bg1',
      )}
    >
      <div className="marquee-track flex h-10 w-max">
        {row('a')}
        {row('b')}
      </div>
    </div>
  );
}

export type { Unit };
