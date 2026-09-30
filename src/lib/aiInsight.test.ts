import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => vi.unstubAllGlobals());

describe('useAiInsight runtime refresh', () => {
  // Each case needs its own module instance: the singleton only refetches
  // once per lifetime (see aiInsight.ts), which in a real app is per page load.
  async function freshModule() {
    vi.resetModules();
    return import('./aiInsight');
  }

  it('adopts a freshly fetched insight with a newer generatedAt', async () => {
    const { subscribeAiInsight, getAiInsight } = await freshModule();
    const before = getAiInsight().generatedAt;
    const fresh = {
      generatedAt: '2099-01-01T09:00:00+07:00',
      sentiment: 'bullish',
      bullets: [{ id: 'a', en: 'a' }],
    };
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => fresh })));

    const unsubscribe = subscribeAiInsight(() => {});
    await new Promise((r) => setTimeout(r, 0));

    expect(getAiInsight().generatedAt).not.toBe(before);
    expect(getAiInsight().sentiment).toBe('bullish');
    unsubscribe();
  });

  it('keeps the bundled insight when the fetch fails', async () => {
    const { subscribeAiInsight, getAiInsight } = await freshModule();
    const before = getAiInsight();
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new Error('offline'))));

    const unsubscribe = subscribeAiInsight(() => {});
    await new Promise((r) => setTimeout(r, 0));

    expect(getAiInsight()).toEqual(before);
    unsubscribe();
  });

  it('ignores a malformed response', async () => {
    const { subscribeAiInsight, getAiInsight } = await freshModule();
    const before = getAiInsight();
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ oops: true }) })));

    const unsubscribe = subscribeAiInsight(() => {});
    await new Promise((r) => setTimeout(r, 0));

    expect(getAiInsight()).toEqual(before);
    unsubscribe();
  });
});
