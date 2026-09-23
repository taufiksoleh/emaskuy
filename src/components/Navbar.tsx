/**
 * Navbar — sticky 64px, bg0/80 + backdrop-blur, bottom hairline (design.md §9).
 * Left: logo + wordmark + LIVE badge. Center: nav links with gold underline
 * (layoutId). Right: unit toggle + ID|EN pill + live price chip (tick-flash).
 * Mobile: bottom navigation bar fixed (gaya trading app modern).
 */
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { motion } from 'framer-motion';
import { Briefcase, Calculator, Info, LayoutDashboard, Moon, Newspaper, Sun } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/hooks/useTheme';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { convertPrice, formatUnitPrice, formatPct } from '@/lib/gold';
import { cn } from '@/lib/utils';
import { SegToggle } from './ui-atoms/SegToggle';

const LINKS = [
  { to: '/', key: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/analisis', key: 'nav.analysis', icon: Newspaper },
  { to: '/kalkulator', key: 'nav.calculator', icon: Calculator },
  { to: '/portofolio', key: 'nav.portfolio', icon: Briefcase },
  { to: '/tentang', key: 'nav.about', icon: Info },
] as const;

function LivePriceChip() {
  const { lang, unit } = useI18n();
  const { gold, usdIdr, status } = useGoldPrice();
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const prevRef = useRef<number | null>(null);
  const price = gold?.price ?? 0;

  useEffect(() => {
    if (prevRef.current !== null && price !== prevRef.current) {
      setFlash(price > prevRef.current ? 'up' : 'down');
      const t = setTimeout(() => setFlash(null), 650);
      return () => clearTimeout(t);
    }
    prevRef.current = price;
  }, [price]);

  if (!gold) return null;
  const display = convertPrice(price, usdIdr, unit);
  return (
    <div
      className={cn(
        'hidden items-center gap-1.5 rounded-lg border border-hairline bg-bg2 px-2.5 py-1.5 font-mono text-[13px] tabular lg:flex',
        flash === 'up' && 'tick-up',
        flash === 'down' && 'tick-down',
      )}
    >
      <span className="text-gold">{price > 0 ? formatUnitPrice(display, unit, lang) : '—'}</span>
      <span style={{ color: gold.changePct >= 0 ? 'var(--up)' : 'var(--down)' }}>
        {price > 0 && status !== 'offline' ? formatPct(gold.changePct, lang) : '—'}
      </span>
    </div>
  );
}

export function Navbar() {
  const { lang, setLang, t, unit, setUnit } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { status } = useGoldPrice();

  const statusVariant = status === 'live' ? 'live' : status === 'cached' ? 'cached' : 'offline';
  const themeLabel = theme === 'dark' ? t('theme.toLight') : t('theme.toDark');

  const themeButton = (className?: string) => (
    <button
      onClick={toggleTheme}
      aria-label={themeLabel}
      title={themeLabel}
      className={cn(
        'relative cursor-pointer rounded-lg border border-hairline bg-bg2 p-2 text-t2 transition-colors hover:border-goldline hover:text-gold',
        className,
      )}
    >
      <Sun
        className="theme-icon-swap h-4 w-4"
        data-swap={theme === 'dark' ? 'in' : 'out'}
        aria-hidden
      />
      <Moon
        className="theme-icon-swap absolute inset-0 m-auto h-4 w-4"
        data-swap={theme === 'light' ? 'in' : 'out'}
        aria-hidden
      />
    </button>
  );

  return (
    <>
      <header className="sticky top-0 z-50 h-16 border-b border-hairline bg-bg0/80 backdrop-blur-[12px]">
        <div className="mx-auto flex h-full max-w-[1440px] items-center gap-4 px-4 md:px-6">
          {/* Left: logo + wordmark + status */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <img src="/logo.svg" alt="EmasKuy" className="h-7 w-7" />
            <span className="font-display text-lg font-bold tracking-[-0.02em] text-t1">
              EmasKuy
            </span>
            <span
              className={cn(
                'label-micro hidden items-center gap-1.5 rounded-full border border-hairline bg-bg2 px-2 py-0.5 sm:inline-flex',
              )}
            >
              <span
                className={cn('h-2 w-2 rounded-full', statusVariant === 'live' && 'status-pulse')}
                style={{
                  backgroundColor:
                    statusVariant === 'live'
                      ? 'var(--up)'
                      : statusVariant === 'cached'
                        ? 'var(--gold)'
                        : 'var(--down)',
                }}
              />
              {statusVariant === 'live'
                ? t('common.live')
                : statusVariant === 'cached'
                  ? t('common.cached')
                  : t('common.offline')}
            </span>
          </Link>

          {/* Center: links */}
          <nav className="mx-auto hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className="relative px-3 py-2 font-display text-sm font-medium text-t2 transition-colors duration-150 hover:text-t1"
              >
                {({ isActive }) => (
                  <>
                    <span className={cn(isActive && 'text-gold')}>{t(l.key)}</span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                        className="absolute inset-x-3 -bottom-[13px] h-0.5 bg-gold"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right: unit toggle + lang pill + price chip + hamburger */}
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <LivePriceChip />
            <SegToggle
              ariaLabel="Price unit"
              size="sm"
              className="hidden sm:inline-flex"
              value={unit}
              onChange={setUnit}
              options={[
                { value: 'usd-oz', label: 'USD/oz' },
                { value: 'idr-gr', label: 'IDR/gr' },
              ]}
            />
            <SegToggle
              ariaLabel="Language"
              size="sm"
              value={lang}
              onChange={setLang}
              options={[
                { value: 'id', label: 'ID' },
                { value: 'en', label: 'EN' },
              ]}
            />
            {themeButton()}
          </div>
        </div>
      </header>

      {/* Bottom navigation bar — mobile saja (gaya trading app) */}
      <nav
        aria-label="Navigasi utama"
        className="fixed bottom-0 z-50 w-full border-t border-hairline bg-bg1/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-[12px] lg:hidden"
      >
        <div className="grid grid-cols-5">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative flex flex-col items-center gap-1 pb-2 pt-2.5 transition-colors',
                  isActive ? 'text-gold' : 'text-t3 hover:text-t1 active:text-t1',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {/* Indikator garis gold di atas ikon saat aktif */}
                  {isActive && (
                    <motion.span
                      layoutId="bottomnav-indicator"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                      className="absolute inset-x-6 top-0 h-0.5 rounded-b-full bg-gold"
                    />
                  )}
                  <l.icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 1.8} aria-hidden />
                  <span className="font-display text-[10px] font-medium leading-none">
                    {t(l.key)}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
