/**
 * Layout — shared chrome: Navbar + content slot + Footer.
 *
 * Routing contract: this Layout renders `{children}`, so App.tsx wraps
 * `<Routes>` inside `<Layout>` (children pattern — never mix with <Outlet/>).
 * The Navbar is `sticky top-0 z-50` in normal flow: pages must NOT add
 * nav-height padding themselves.
 */
import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { LangSuggest } from './LangSuggest';
import { useI18n } from '@/lib/i18n';

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg0 text-t1">
      <a
        href="#main"
        className="sr-only z-[100] rounded-lg bg-gold px-4 py-2 font-display text-sm font-semibold text-bg0 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t('nav.skip')}
      </a>
      <Navbar />
      <LangSuggest />
      {/* pb-24 di mobile agar konten tidak tertutup bottom navigation bar */}
      <main id="main" tabIndex={-1} className="flex-1 pb-24 outline-none lg:pb-0">
        {children}
      </main>
      <Footer />
    </div>
  );
}
