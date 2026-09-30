import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchFx } from './api';

afterEach(() => vi.unstubAllGlobals());

describe('fetchFx', () => {
  it('takes the newest day as today and keeps the recent days for yesterday’s close', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        rates: {
          '2026-09-28': { IDR: 17_977, MYR: 4.083 },
          '2026-09-29': { IDR: 17_922, MYR: 4.081, THB: -1 },
        },
      }),
    }));
    vi.stubGlobal('fetch', fetchMock);
    const fx = await fetchFx();
    expect(fx.status).toBe('live');
    expect(fx.date).toBe('2026-09-29');
    expect(fx.rates).toEqual({ IDR: 17_922, MYR: 4.081, SAR: 3.75, AED: 3.6725 });
    expect(fx.recent['2026-09-28'].IDR).toBe(17_977);
    expect(String(fetchMock.mock.calls[0])).toMatch(/base=USD&symbols=IDR,/);
  });

  it('is offline with only the pegs when the request fails and nothing is cached', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new Error('network'))));
    const fx = await fetchFx();
    expect(fx.status).toBe('offline');
    expect(fx.rates).toEqual({ SAR: 3.75, AED: 3.6725 });
  });
});
