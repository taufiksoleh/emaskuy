/**
 * AlertsPanel — price alerts: users set an above/below target in the active
 * display unit and get a toast when the live price crosses it. Alerts are
 * stored in localStorage and checked against the 30s live poll.
 */
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BellRing,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { registerStrings, useI18n } from '@/lib/i18n';
import { formatDate, formatUnitPrice, xauUsdToIdrGram } from '@/lib/gold';
import { MAX_ALERTS, type PriceAlert } from '@/lib/alerts';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { usePriceAlerts } from '@/hooks/usePriceAlerts';
import { Panel } from '../ui-atoms/Panel';
import { SegToggle } from '../ui-atoms/SegToggle';

registerStrings({
  'alerts.title': { id: 'Alert Harga', en: 'Price Alerts' },
  'alerts.direction.above': { id: 'Di atas', en: 'Above' },
  'alerts.direction.below': { id: 'Di bawah', en: 'Below' },
  'alerts.add': { id: 'Tambah', en: 'Add' },
  'alerts.unitHint.usd-oz': { id: 'dalam USD/oz', en: 'in USD/oz' },
  'alerts.unitHint.idr-gr': { id: 'per IDR/gr', en: 'per IDR/gr' },
  'alerts.currentPrice': { id: 'Harga saat ini', en: 'Current price' },
  'alerts.empty': {
    id: 'Belum ada alert. Buat target harga dan kami beri tahu saat tercapai.',
    en: "No alerts yet. Set a price target and we'll let you know when it's hit.",
  },
  'alerts.status.triggered': { id: 'Terpicu', en: 'Triggered' },
  'alerts.status.waiting': { id: 'menunggu', en: 'waiting' },
  'alerts.maxReached': { id: 'Maks. 10 alert', en: 'Max 10 alerts' },
  'alerts.footer': {
    id: 'Alert disimpan di browser ini dan diperiksa terhadap harga live setiap 30 detik selama situs terbuka.',
    en: 'Alerts are stored in this browser and checked against the live price every 30 seconds while the site is open.',
  },
});

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function AlertsPanel() {
  const { t, lang, unit } = useI18n();
  const { gold, usdIdr } = useGoldPrice();
  const { alerts, addAlert, removeAlert, resetAlert } = usePriceAlerts();
  const [direction, setDirection] = useState<'above' | 'below'>('above');
  const [rawTarget, setRawTarget] = useState('');

  const target = Number(rawTarget.replace(',', '.'));
  const targetValid = rawTarget.trim() !== '' && Number.isFinite(target) && target > 0;
  const maxReached = alerts.length >= MAX_ALERTS;
  const canAdd = targetValid && !maxReached;

  const currentPrice = useMemo(() => {
    if (!gold || gold.price <= 0) return 0;
    return unit === 'idr-gr' ? xauUsdToIdrGram(gold.price, usdIdr) : gold.price;
  }, [gold, usdIdr, unit]);

  const onAdd = () => {
    if (!canAdd) return;
    const alert: PriceAlert = {
      id: `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      unit,
      direction,
      target,
      createdAt: Date.now(),
    };
    if (addAlert(alert)) setRawTarget('');
  };

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-4 md:px-6">
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease }}
      >
        <Panel
          title={
            <span className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-goldline bg-gold/10">
                <BellRing className="h-4 w-4 text-gold" />
              </span>
              <span className="font-display text-xl font-semibold leading-[1.3] tracking-[-0.02em] text-t1">
                {t('alerts.title')}
              </span>
              <span className="rounded-md border border-goldline bg-bg3 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-widest text-gold">
                {alerts.length}/{MAX_ALERTS}
              </span>
            </span>
          }
          actions={
            currentPrice > 0 ? (
              <span className="font-mono text-xs text-t3 tabular-nums">
                {t('alerts.currentPrice')}:{' '}
                <span className="text-gold">{formatUnitPrice(currentPrice, unit, lang)}</span>
              </span>
            ) : undefined
          }
        >
          {/* creation form */}
          <div className="flex flex-wrap items-center gap-2">
            <SegToggle
              value={direction}
              onChange={setDirection}
              options={[
                { value: 'above', label: t('alerts.direction.above') },
                { value: 'below', label: t('alerts.direction.below') },
              ]}
              ariaLabel={t('alerts.title')}
            />
            <input
              type="number"
              inputMode="decimal"
              min={0}
              value={rawTarget}
              onChange={(e) => setRawTarget(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAdd()}
              placeholder={unit === 'idr-gr' ? '2500000' : '4350'}
              className="w-36 rounded-lg border border-hairline bg-bg3 px-3 py-2 font-mono text-sm text-t1 tabular-nums outline-none transition-colors placeholder:text-t3 focus:border-goldline focus:ring-1 focus:ring-gold/50"
            />
            <button
              onClick={onAdd}
              disabled={!canAdd}
              className="rounded-lg bg-gold px-4 py-2 font-display text-sm font-semibold text-bg0 transition hover:brightness-110 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t('alerts.add')}
            </button>
            <span className="font-mono text-[11px] text-t3">
              {t(`alerts.unitHint.${unit}`)}
              {maxReached && <span className="text-down"> · {t('alerts.maxReached')}</span>}
            </span>
          </div>

          {/* list */}
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Bell className="h-6 w-6 text-t3" />
              <p className="max-w-sm text-sm text-t3">{t('alerts.empty')}</p>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-hairline">
              {alerts.map((a, i) => {
                const triggered = a.triggeredAt != null;
                return (
                  <motion.li
                    key={a.id}
                    initial={{ x: -10, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.35, ease, delay: 0.05 + i * 0.05 }}
                    className="flex items-center gap-3 py-2.5"
                  >
                    {a.direction === 'above' ? (
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-up" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 shrink-0 text-down" />
                    )}
                    <span className="font-mono text-sm font-medium text-t1 tabular-nums">
                      {formatUnitPrice(a.target, a.unit, lang)}
                    </span>
                    <span className="font-mono text-[11px] text-t3">
                      {a.unit === 'idr-gr' ? 'IDR/gr' : 'USD/oz'}
                    </span>
                    <span className="hidden font-mono text-[11px] text-t3 sm:inline">
                      {formatDate(a.createdAt, lang)}
                    </span>
                    <span className="ml-auto flex items-center gap-2">
                      {triggered ? (
                        <>
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-up/40 bg-up/10 px-2 py-0.5 text-[11px] font-semibold text-up">
                            {t('alerts.status.triggered')}
                          </span>
                          <button
                            onClick={() => resetAlert(a.id)}
                            title={t('alerts.status.waiting')}
                            className="text-t3 transition-colors hover:text-gold"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <span className="font-mono text-[11px] text-t3">
                          {t('alerts.status.waiting')}…
                        </span>
                      )}
                      <button
                        onClick={() => removeAlert(a.id)}
                        className="text-t3 transition-colors hover:text-down"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          )}

          <p className="mt-4 border-t border-hairline pt-3 text-[11px] leading-relaxed text-t3">
            {t('alerts.footer')}
          </p>
        </Panel>
      </motion.div>
    </section>
  );
}
