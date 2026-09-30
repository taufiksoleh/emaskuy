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
import { alertHit, alertPrice, loadAlerts, saveAlerts, MAX_ALERTS, type PriceAlert } from '@/lib/alerts';
import { registerStrings, useI18n } from '@/lib/i18n';
import { WEIGHT, formatMoney } from '@/lib/money';
import { fill } from '@/lib/utils';
import { useGoldPrice } from './useGoldPrice';

registerStrings({
  'alerts.toast.above': {
    id: 'Alert terpicu: emas menembus {target}/{unit}',
    en: 'Alert triggered: gold broke above {target}/{unit}',
  },
  'alerts.toast.below': {
    id: 'Alert terpicu: emas turun ke {target}/{unit}',
    en: 'Alert triggered: gold dropped to {target}/{unit}',
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
  const { gold, rates } = useGoldPrice();
  const [alerts, setAlerts] = useState<PriceAlert[]>(loadAlerts);
  // Mirrors `alerts` so the price-watching effect can compare against the
  // previous state without re-subscribing on every alert change.
  const prevRef = useRef<PriceAlert[]>(alerts);
  // Guards against double-fire across re-renders for the same trigger event.
  const toastedRef = useRef<Set<string>>(new Set());

  /** Persist first; a user edit that can't be saved is not applied. */
  const update = (next: PriceAlert[], applyOnFailure = false): boolean => {
    const saved = saveAlerts(next);
    if (!saved) toast.error(t('common.saveFailed'), { id: 'save-failed' });
    if (saved || applyOnFailure) setAlerts(next);
    return saved;
  };

  const addAlert = (alert: PriceAlert): boolean => {
    if (alerts.length >= MAX_ALERTS) return false;
    return update([...alerts, alert]);
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
      if (!alertHit(a, alertPrice(a, price, rates))) return a;
      changed = true;
      // Only toast when this alert was untriggered before this check and we
      // haven't toasted for this trigger yet (re-render guard).
      const wasTriggered = prev.find((p) => p.id === a.id)?.triggeredAt != null;
      if (!wasTriggered && !toastedRef.current.has(a.id)) {
        toastedRef.current.add(a.id);
        const target = formatMoney(a.target, a.currency, lang);
        toast(fill(t(`alerts.toast.${a.direction}`), { target, unit: WEIGHT[a.weight].short }));
      }
      return { ...a, triggeredAt: now };
    });
    prevRef.current = next;
    // Mark triggers even if storage fails, so the same alert doesn't re-fire.
    if (changed) update(next, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price, rates, alerts]);

  return { alerts, addAlert, removeAlert, resetAlert };
}
