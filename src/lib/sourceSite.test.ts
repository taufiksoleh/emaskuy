import { describe, expect, it } from 'vitest';
import { sourceSite } from './sourceSite';

describe('sourceSite', () => {
  it('names known sites and drops www.', () => {
    const s = sourceSite('https://www.kitco.com/news/article/2026-09-30/gold');
    expect(s).toEqual({
      host: 'kitco.com',
      name: 'Kitco',
      icon: 'https://www.google.com/s2/favicons?domain=www.kitco.com&sz=32',
    });
  });

  it('gives a subdomain its parent site name', () => {
    expect(sourceSite('https://money.kompas.com/read/2026/10/01/x')?.name).toBe('Kompas');
    expect(sourceSite('https://finance.yahoo.com/markets/x')?.name).toBe('Yahoo Finance');
  });

  it('falls back to the bare host for unknown sites', () => {
    expect(sourceSite('https://www.example.co.id/a?b=1')?.name).toBe('example.co.id');
  });

  it('does not match a host that only ends with a known name', () => {
    expect(sourceSite('https://notkitco.com/x')?.name).toBe('notkitco.com');
  });

  it('returns null for an invalid URL', () => {
    expect(sourceSite('not a url')).toBeNull();
  });
});
