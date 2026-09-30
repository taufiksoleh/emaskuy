/**
 * EmasKuy — the daily AI market insight (src/content/ai-insight.json),
 * written by the content agent and checked in CI.
 */
import raw from '@/content/ai-insight.json';

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

const INSIGHT = normalizeInsight(raw);

export function useAiInsight(): AiInsight {
  return INSIGHT;
}
