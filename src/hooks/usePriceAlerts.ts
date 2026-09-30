/**
 * EmasKuy — price alerts, checked app-wide.
 *
 * One store holds the alerts (localStorage, synced across tabs) and a
 * watcher started in main.tsx checks them on every live price, on any page.
 * While an alert is armed the price poller keeps going once a minute in a
 * hidden tab. A crossing marks the alert triggered, shows a toast, and, if
 * the visitor allowed it, a system notification. Nothing runs once every
 * EmasKuy tab is closed; there is no push server.
 */
import { useSyncExternalStore } from 'react';
import { toast } from 'sonner';
import { ALERTS_KEY, MAX_ALERTS, checkAlerts, loadAlerts, saveAlerts, type PriceAlert } from '@/lib/alerts';
import { registerStrings, type Lang } from '@/lib/i18n';
import { WEIGHT, formatMoney } from '@/lib/money';
import { langOfPath, pathFor } from '@/lib/routes';
import { translate } from '@/lib/strings';
import { fill, withBase } from '@/lib/utils';
import { getGoldPrice, setBackgroundPolling, subscribeGoldPrice } from './useGoldPrice';

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

let alerts: PriceAlert[] = loadAlerts();
const listeners = new Set<() => void>();

const pageLang = (): Lang => (typeof location === 'undefined' ? 'id' : langOfPath(location.pathname));

function setAlerts(next: PriceAlert[]) {
  alerts = next;
  setBackgroundPolling(alerts.some((a) => !a.triggeredAt));
  for (const l of listeners) l();
}

/** Persist first; a user edit that can't be saved is not applied. */
function commit(next: PriceAlert[], applyOnFailure = false): boolean {
  const saved = saveAlerts(next);
  if (!saved) toast.error(translate('common.saveFailed', pageLang()), { id: 'save-failed' });
  if (saved || applyOnFailure) setAlerts(next);
  return saved;
}

function message(a: PriceAlert, lang: Lang): string {
  return fill(translate(`alerts.toast.${a.direction}`, lang), {
    target: formatMoney(a.target, a.currency, lang),
    unit: WEIGHT[a.weight].short,
  });
}

/** A system notification when the tab is in the background and the visitor allowed them. */
async function notify(a: PriceAlert, body: string, lang: Lang) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  const options: NotificationOptions = {
    body,
    tag: `emaskuy-alert-${a.id}`,
    icon: withBase('/icons/pwa-192.png'),
    data: { url: withBase(pathFor('home', lang)) },
  };
  try {
    const registration = await navigator.serviceWorker?.getRegistration();
    if (registration) {
      await registration.showNotification('EmasKuy', options);
      return;
    }
  } catch {
    /* fall back to a page notification */
  }
  try {
    new Notification('EmasKuy', options);
  } catch {
    /* some mobile browsers only allow service-worker notifications */
  }
}

function check() {
  const { gold, rates } = getGoldPrice();
  // Only a fresh price can trigger: a cached one may be hours old.
  if (!gold || gold.price <= 0 || gold.status !== 'live') return;
  const { next, fired } = checkAlerts(alerts, gold.price, rates, Date.now());
  if (fired.length === 0) return;
  // Mark triggers even if storage fails, so the same alert doesn't fire again.
  commit(next, true);
  const lang = pageLang();
  for (const a of fired) {
    const text = message(a, lang);
    toast(text);
    if (document.hidden) void notify(a, text, lang);
  }
}

let started = false;

/** Called once from main.tsx. */
export function startAlertWatcher(): void {
  if (started || typeof window === 'undefined') return;
  started = true;
  setBackgroundPolling(alerts.some((a) => !a.triggeredAt));
  subscribeGoldPrice(check);
  window.addEventListener('storage', (e) => {
    if (e.key === ALERTS_KEY) setAlerts(loadAlerts());
  });
}

/** Ask for notification permission; call from a click (browsers require a gesture). */
export function requestAlertNotifications(): void {
  if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
    void Notification.requestPermission().catch(() => undefined);
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export interface UsePriceAlerts {
  alerts: PriceAlert[];
  /** False when the max (10) is reached or saving failed. */
  addAlert: (alert: PriceAlert) => boolean;
  removeAlert: (id: string) => void;
  /** Clear triggeredAt so the alert becomes active again. */
  resetAlert: (id: string) => void;
}

export function usePriceAlerts(): UsePriceAlerts {
  const list = useSyncExternalStore(subscribe, () => alerts);
  return {
    alerts: list,
    addAlert: (alert) => (alerts.length >= MAX_ALERTS ? false : commit([...alerts, alert])),
    removeAlert: (id) => void commit(alerts.filter((a) => a.id !== id)),
    resetAlert: (id) => void commit(alerts.map((a) => (a.id === id ? { ...a, triggeredAt: undefined } : a))),
  };
}
