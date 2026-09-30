/**
 * Page shell: Kalkulator Emas — `/kalkulator/*`. Shared label, live price
 * and tabs; each calculator renders in the outlet with its own H1.
 */
import { Outlet } from 'react-router';
import { registerStrings, useI18n } from '@/lib/i18n';
import { useDisplay } from '@/hooks/useDisplay';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { Badge } from '@/components/ui-atoms/Badge';
import { CalcTabs } from '@/components/calculator/CalcTabs';

registerStrings({
  'calc.hub.label': { id: 'Kalkulator Emas', en: 'Gold Calculators' },
});

export default function CalculatorHub() {
  const { t } = useI18n();
  const d = useDisplay();
  const { gold, status } = useGoldPrice();
  const statusVariant = status === 'live' ? 'live' : status === 'cached' ? 'cached' : 'offline';

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 pt-6">
        <span className="label-micro !text-gold">{t('calc.hub.label')}</span>
        <div className="flex items-center gap-2">
          {gold && gold.price > 0 && (
            <span className="rounded-lg border border-hairline bg-bg2 px-3 py-1.5 font-mono text-sm tabular text-gold">
              {d.approx}
              {d.format(d.price(gold.price))}/{d.label.split('/')[1]}
            </span>
          )}
          <Badge variant={statusVariant} />
        </div>
      </div>
      <CalcTabs />
      <Outlet />
    </div>
  );
}
