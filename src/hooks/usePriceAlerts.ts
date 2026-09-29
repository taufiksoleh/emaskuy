/**
 * EmasKuy — usePriceAlerts hook.
 *
 * Local-state CRUD over the localStorage-backed alert list plus live
 * checking against `useGoldPrice()`: whenever the current price crosses an
 * alert's target, the alert is marked as triggered and a bilingual sonner
 * toast fires. Toasts only fire for alerts that were untriggered before the
 * check (tracked via a ref) so re-renders / remounts never double-fire.
 */
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { loadAlerts, saveAlerts, MAX_ALERTS, type PriceAlert } from '@/lib/alerts';
import { formatUnitPrice, xauUsdToIdrGram } from '@/lib/gold';
import { registerStrings, useI18n } from '@/lib/i18n';
import { useGoldPrice } from './useGoldPrice';

registerStrings({
  'alerts.toast.above.usd-oz': {
    id: 'Alert terpicu: emas menembus {target}/oz',
    en: 'Alert triggered: gold broke above {target}/oz',
  },
  'alerts.toast.below.usd-oz': {
    id: 'Alert terpicu: emas turun ke {target}/oz',
    en: 'Alert triggered: gold dropped to {target}/oz',
  },
  'alerts.toast.above.idr-gr': {
    id: 'Alert terpicu: emas menyentuh {target}/gram',
    en: 'Alert triggered: gold touched {target}/gram',
  },
  'alerts.toast.below.idr-gr': {
    id: 'Alert terpicu: emas turun ke {target}/gram',
    en: 'Alert triggered: gold dropped to {target}/gram',
  },
});

export interface UsePriceAlerts {
  alerts: PriceAlert[];
  /** False when the max (10) is reached — the alert is not added. */
  addAlert: (alert: PriceAlert) => boolean;
  removeAlert: (id: string) => void;
  /** Clear triggeredAt so the alert becomes active again. */
  resetAlert: (id: string) => void;
}

export function usePriceAlerts(): UsePriceAlerts {
  const { t, lang } = useI18n();
  const { gold, usdIdr } = useGoldPrice();
  const [alerts, setAlerts] = useState<PriceAlert[]>(loadAlerts);
  // Mirrors `alerts` so the price-watching effect can compare against the
  // previous state without re-subscribing on every alert change.
  const prevRef = useRef<PriceAlert[]>(alerts);
  // Guards against double-fire across re-renders for the same trigger event.
  const toastedRef = useRef<Set<string>>(new Set());

  const update = (next: PriceAlert[]) => {
    setAlerts(next);
    saveAlerts(next);
  };

  const addAlert = (alert: PriceAlert): boolean => {
    if (alerts.length >= MAX_ALERTS) return false;
    update([...alerts, alert]);
    return true;
  };

  const removeAlert = (id: string) => {
    toastedRef.current.delete(id);
    update(alerts.filter((a) => a.id !== id));
  };

  const resetAlert = (id: string) => {
    toastedRef.current.delete(id);
    update(alerts.map((a) => (a.id === id ? { ...a, triggeredAt: undefined } : a)));
  };

  // Live checking — runs whenever the polled price (or the list) changes.
  const price = gold?.price ?? 0;
  useEffect(() => {
    if (price <= 0) return;
    const prev = prevRef.current;
    const now = Date.now();
    let changed = false;
    const next = alerts.map((a) => {
      if (a.triggeredAt) return a;
      const current = a.unit === 'idr-gr' ? xauUsdToIdrGram(price, usdIdr) : price;
      if (current <= 0) return a;
      const hit =
        (a.direction === 'above' && current >= a.target) ||
        (a.direction === 'below' && current <= a.target);
      if (!hit) return a;
      changed = true;
      // Only toast when this alert was untriggered before this check and we
      // haven't toasted for this trigger yet (re-render guard).
      const wasTriggered = prev.find((p) => p.id === a.id)?.triggeredAt != null;
      if (!wasTriggered && !toastedRef.current.has(a.id)) {
        toastedRef.current.add(a.id);
        toast(t(`alerts.toast.${a.direction}.${a.unit}`).replace('{target}', formatUnitPrice(a.target, a.unit, lang)));
      }
      return { ...a, triggeredAt: now };
    });
    prevRef.current = next;
    if (changed) update(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price, usdIdr, alerts]);

  return { alerts, addAlert, removeAlert, resetAlert };
}
