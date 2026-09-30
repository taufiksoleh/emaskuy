/**
 * Section 0 — Ticker strip: full-width 40px marquee, hairlines top+bottom.
 * Hover pauses; item hover shows "updated ago"; click non-XAU → toast.
 */
import { useMemo } from 'react';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n';
import { useDisplay } from '@/hooks/useDisplay';
import { useGoldPrice, useXauChange } from '@/hooks/useGoldPrice';
import { formatUsd, formatIdr, formatAgo, formatDateOnly, formatNumber, xauUsdToIdrGram } from '@/lib/gold';
import type { MetalSymbol } from '@/lib/api';
import { WEIGHT, formatMoney, pricePer, rateOf } from '@/lib/money';
import { cn } from '@/lib/utils';
import { DeltaChip } from '../ui-atoms/DeltaChip';

interface TickerItem {
  id: string;
  symbol: string;
  nameKey?: string;
  render: () => string;
  deltaPct: number;
  updatedAt: number;
  /** Tooltip detail; defaults to "updated … ago" */
  note?: string;
  isGold: boolean;
}

export function TickerStrip() {
  const { lang, t } = useI18n();
  const { currency, weight } = useDisplay();
  const { metals, usdIdr, rates, fx, status, loading } = useGoldPrice();
  const idrChange = useXauChange('IDR', 'g').pct;
  const localChange = useXauChange(currency, weight).pct;

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
    // ECB publishes one reference rate per business day.
    const ecbNote = fx?.date ? `ECB ${formatDateOnly(fx.date, lang)}` : undefined;
    if (usdIdr > 0) {
      list.push({
        id: 'USDIDR',
        symbol: 'USD/IDR',
        render: () => formatIdr(usdIdr, lang),
        deltaPct: 0,
        updatedAt: fx?.updatedAt ?? 0,
        note: ecbNote,
        isGold: false,
      });
    }
    const gold = metals.find((m) => m.symbol === 'XAU');
    if (gold && gold.price > 0 && usdIdr > 0) {
      list.push({
        id: 'XAUGR',
        symbol: 'XAU/IDR gr',
        render: () => formatIdr(xauUsdToIdrGram(gold.price, usdIdr), lang),
        deltaPct: idrChange,
        updatedAt: gold.updatedAt,
        isGold: true,
      });
    }
    // The visitor's own currency, when it's neither of the above
    const rate = rateOf(currency, rates);
    if (currency !== 'USD' && currency !== 'IDR' && rate > 0) {
      list.push({
        id: `USD${currency}`,
        symbol: `USD/${currency}`,
        render: () => formatNumber(rate, lang, { decimals: rate >= 100 ? 2 : 4 }),
        deltaPct: 0,
        updatedAt: fx?.updatedAt ?? 0,
        note: ecbNote,
        isGold: false,
      });
      if (gold && gold.price > 0) {
        list.push({
          id: `XAU${currency}`,
          symbol: `XAU/${currency} ${WEIGHT[weight].short}`,
          render: () => formatMoney(pricePer(gold.price, currency, weight, rates), currency, lang),
          deltaPct: localChange,
          updatedAt: gold.updatedAt,
          isGold: true,
        });
      }
    }
    return list;
  }, [metals, usdIdr, rates, fx, idrChange, localChange, currency, weight, lang]);

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
          tabIndex={keyPrefix === 'b' ? -1 : undefined}
          title={`${item.nameKey ? t(item.nameKey) : item.symbol} · ${item.note ?? formatAgo(item.updatedAt, lang)}`}
          className="group flex h-full cursor-pointer items-center gap-2.5 border-r border-hairline px-5 transition-colors hover:bg-bg2"
        >
          <span className="label-micro group-hover:text-t2">{item.symbol}</span>
          <span className="font-mono text-[13px] font-medium tabular text-t1">
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

