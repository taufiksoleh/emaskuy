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

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg0 text-t1">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
