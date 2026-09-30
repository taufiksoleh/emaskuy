import { afterEach, describe, expect, it, vi } from 'vitest';
import { DISPLAY_KEY, loadDisplayPrefs } from './display';

function stubStorage(seed: Record<string, string>) {
  const data = new Map(Object.entries(seed));
  vi.stubGlobal('localStorage', {
    get length() {
      return data.size;
    },
    key: (i: number) => [...data.keys()][i] ?? null,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  });
  return data;
}

afterEach(() => vi.unstubAllGlobals());

describe('loadDisplayPrefs', () => {
  it('is null until the visitor chooses', () => {
    stubStorage({});
    expect(loadDisplayPrefs()).toBeNull();
  });

  it('migrates the old unit toggle and keeps the old key', () => {
    const data = stubStorage({ 'emaskuy.unit': 'usd-oz' });
    expect(loadDisplayPrefs()).toEqual({ currency: 'USD', weight: 'ozt' });
    expect(JSON.parse(data.get(DISPLAY_KEY)!)).toEqual({ currency: 'USD', weight: 'ozt' });
    expect(data.get('emaskuy.unit')).toBe('usd-oz');

    stubStorage({ 'emaskuy.unit': 'idr-gr' });
    expect(loadDisplayPrefs()).toEqual({ currency: 'IDR', weight: 'g' });
  });

  it('prefers the saved choice and ignores invalid ones', () => {
    stubStorage({ [DISPLAY_KEY]: JSON.stringify({ currency: 'MYR', weight: 'g' }), 'emaskuy.unit': 'usd-oz' });
    expect(loadDisplayPrefs()).toEqual({ currency: 'MYR', weight: 'g' });

    stubStorage({ [DISPLAY_KEY]: JSON.stringify({ currency: 'XYZ', weight: 'g' }) });
    expect(loadDisplayPrefs()).toBeNull();
  });
});
