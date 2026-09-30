/**
 * AlertsPanel — price alerts: users set an above/below target in the display
 * currency and weight and get a toast when the live price crosses it. Each
 * alert keeps its own unit. Alerts are stored in localStorage and checked
 * against the 30s live poll.
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
import { formatDate } from '@/lib/gold';
import { formatRaw, parseAmount } from '@/lib/number';
import { MAX_ALERTS, type PriceAlert } from '@/lib/alerts';
import { CURRENCY, formatMoney, unitLabel } from '@/lib/money';
import { fill } from '@/lib/utils';
import { useDisplay } from '@/hooks/useDisplay';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { requestAlertNotifications, usePriceAlerts } from '@/hooks/usePriceAlerts';
import { MoneyInput } from '../ui-atoms/MoneyInput';
import { Panel } from '../ui-atoms/Panel';
import { SegToggle } from '../ui-atoms/SegToggle';

registerStrings({
  'alerts.title': { id: 'Alert Harga', en: 'Price Alerts' },
  'alerts.direction.above': { id: 'Di atas', en: 'Above' },
  'alerts.direction.below': { id: 'Di bawah', en: 'Below' },
  'alerts.add': { id: 'Tambah', en: 'Add' },
  'alerts.target': { id: 'Target harga', en: 'Target price' },
  'alerts.reset': { id: 'Aktifkan lagi', en: 'Re-arm alert' },
  'alerts.remove': { id: 'Hapus alert', en: 'Delete alert' },
  'alerts.unitHint': { id: 'dalam {label}', en: 'in {label}' },
  'alerts.currentPrice': { id: 'Harga saat ini', en: 'Current price' },
  'alerts.empty': {
    id: 'Belum ada alert. Buat target harga dan kami beri tahu saat tercapai.',
    en: "No alerts yet. Set a price target and we'll let you know when it's hit.",
  },
  'alerts.status.triggered': { id: 'Terpicu', en: 'Triggered' },
  'alerts.status.waiting': { id: 'menunggu', en: 'waiting' },
  'alerts.maxReached': { id: 'Maks. 10 alert', en: 'Max 10 alerts' },
  'alerts.footer': {
    id: 'Alert disimpan di browser ini dan diperiksa selama EmasKuy terbuka, di halaman mana pun, tiap 30 detik (tiap menit bila tab di latar belakang). Izinkan notifikasi untuk diberi tahu saat tab tidak terlihat; di iPhone/iPad, pasang EmasKuy ke Layar Utama dulu (iOS 16.4+). Alert tidak berjalan bila semua tab EmasKuy ditutup.',
    en: 'Alerts are stored in this browser and checked while EmasKuy is open, on any page, every 30 seconds (every minute in a background tab). Allow notifications to hear about them when the tab is hidden; on iPhone/iPad, add EmasKuy to the Home Screen first (iOS 16.4+). Alerts do not run once every EmasKuy tab is closed.',
  },
  'alerts.notifyBlocked': {
    id: 'Notifikasi diblokir di browser ini; alert hanya muncul di halaman.',
    en: 'Notifications are blocked in this browser; alerts only show on the page.',
  },
});

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function AlertsPanel() {
  const { t, lang } = useI18n();
  const d = useDisplay();
  const { gold } = useGoldPrice();
  const { alerts, addAlert, removeAlert, resetAlert } = usePriceAlerts();
  const [direction, setDirection] = useState<'above' | 'below'>('above');
  const [rawTarget, setRawTarget] = useState('');

  const target = parseAmount(rawTarget, lang);
  const targetValid = rawTarget.trim() !== '' && Number.isFinite(target) && target > 0;
  const maxReached = alerts.length >= MAX_ALERTS;
  const canAdd = targetValid && !maxReached;

  const currentPrice = useMemo(() => (gold && gold.price > 0 ? d.price(gold.price) : 0), [gold, d]);
  const decimals = CURRENCY[d.currency].decimals;

  const onAdd = () => {
    if (!canAdd) return;
    requestAlertNotifications();
    const alert: PriceAlert = {
      id: `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      metal: 'XAU',
      currency: d.currency,
      weight: d.weight,
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
                <span className="text-gold">{d.format(currentPrice)}</span>
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
            <MoneyInput
              value={rawTarget}
              onChange={setRawTarget}
              onEnter={onAdd}
              prefix={CURRENCY[d.currency].symbol}
              decimals={decimals}
              ariaLabel={t('alerts.target')}
              placeholder={currentPrice > 0 ? formatRaw(Math.round(currentPrice), lang, 0) : undefined}
              className="w-44"
              inputClassName="py-2"
            />
            <button
              onClick={onAdd}
              disabled={!canAdd}
              className="rounded-lg bg-gold px-4 py-2 font-display text-sm font-semibold text-bg0 transition hover:brightness-110 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t('alerts.add')}
            </button>
            <span className="font-mono text-[11px] text-t3">
              {fill(t('alerts.unitHint'), { label: d.label })}
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
                      {formatMoney(a.target, a.currency, lang)}
                    </span>
                    <span className="font-mono text-[11px] text-t3">{unitLabel(a.currency, a.weight)}</span>
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
                            aria-label={t('alerts.reset')}
                            title={t('alerts.reset')}
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
                        aria-label={t('alerts.remove')}
                        title={t('alerts.remove')}
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
            {typeof Notification !== 'undefined' && Notification.permission === 'denied' && (
              <span className="mt-1 block text-down">{t('alerts.notifyBlocked')}</span>
            )}
          </p>
        </Panel>
      </motion.div>
    </section>
  );
}
