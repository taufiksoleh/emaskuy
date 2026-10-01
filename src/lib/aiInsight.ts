/**
 * EmasKuy — the daily AI market insight (src/content/ai-insight.json),
 * written by the content agent and checked in CI.
 *
 * Ships inline via the `raw` import below, then `useAiInsight()` also
 * refetches the same file (served unhashed at /content/ai-insight.json —
 * see vite/copy-content.ts) once per session, the same way `useAntam()`
 * does — see that module's docstring for why.
 */
import { useSyncExternalStore } from 'react';
import raw from '@/content/ai-insight.json';
import { withBase } from './utils';

export type InsightSentiment = 'bullish' | 'bearish' | 'neutral';

export interface AiInsight {
  /** Unix ms */
  generatedAt: number;
  sentiment: InsightSentiment;
  bullets: { id: string; en: string }[];
  sources: { title: string; url: string }[];
}

interface RawInsight {
  generatedAt: string;
  sentiment: string;
  bullets: { id: string; en: string }[];
  sources?: { title: string; url: string }[];
}

const SENTIMENTS: InsightSentiment[] = ['bullish', 'bearish', 'neutral'];

export function normalizeInsight(r: RawInsight): AiInsight {
  return {
    generatedAt: Date.parse(r.generatedAt),
    sentiment: SENTIMENTS.includes(r.sentiment as InsightSentiment) ? (r.sentiment as InsightSentiment) : 'neutral',
    bullets: r.bullets,
    sources: r.sources ?? [],
  };
}

function isRawInsight(v: unknown): v is RawInsight {
  const o = v as Partial<RawInsight> | null;
  return !!o && typeof o.generatedAt === 'string' && Array.isArray(o.bullets);
}

let data: AiInsight = normalizeInsight(raw);
let started = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

async function refresh(): Promise<void> {
  try {
    const res = await fetch(withBase('/content/ai-insight.json'), { cache: 'no-store' });
    if (!res.ok) return;
    const json = await res.json();
    if (isRawInsight(json)) {
      const next = normalizeInsight(json);
      if (next.generatedAt !== data.generatedAt) {
        data = next;
        emit();
      }
    }
  } catch {
    /* offline or blocked: keep whatever shipped with the build */
  }
}

function ensureStarted() {
  if (started) return;
  started = true;
  void refresh();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  ensureStarted();
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): AiInsight {
  return data;
}

/** For tests; not meant for app code (use `useAiInsight()` there). */
export { subscribe as subscribeAiInsight, getSnapshot as getAiInsight };

export function useAiInsight(): AiInsight {
  return useSyncExternalStore(subscribe, getSnapshot);
}
