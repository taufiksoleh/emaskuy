/**
 * Navbar — sticky 64px, bg0/80 + backdrop-blur, bottom hairline (design.md §9).
 * Left: logo + wordmark + LIVE badge. Center: nav links with gold underline
 * (layoutId). Right: unit toggle + ID|EN pill + live price chip (tick-flash).
 * Mobile: hamburger → full-height drawer from the right.
 */
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/hooks/useTheme';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { convertPrice, formatUnitPrice, formatPct } from '@/lib/gold';
import { cn } from '@/lib/utils';
import { SegToggle } from './ui-atoms/SegToggle';

const LINKS = [
  { to: '/', key: 'nav.dashboard' },
  { to: '/analisis', key: 'nav.analysis' },
  { to: '/kalkulator', key: 'nav.calculator' },
  { to: '/tentang', key: 'nav.about' },
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
  const [open, setOpen] = useState(false);

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
          <nav className="mx-auto hidden items-center gap-1 md:flex">
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
          <div className="ml-auto flex items-center gap-2 md:ml-0">
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
            <button
              className="cursor-pointer rounded-lg border border-hairline bg-bg2 p-2 text-t2 transition-colors hover:text-t1 md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-bg0/80 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 40 }}
              className="fixed inset-y-0 right-0 z-[70] flex w-72 flex-col border-l border-hairline bg-bg1 p-6 md:hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="/logo.svg" alt="EmasKuy" className="h-6 w-6" />
                  <span className="font-display font-bold text-t1">EmasKuy</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="cursor-pointer rounded-lg border border-hairline bg-bg2 p-2 text-t2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-1">
                {LINKS.map((l, i) => (
                  <motion.div
                    key={l.to}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.06 * i, duration: 0.3 }}
                  >
                    <NavLink
                      to={l.to}
                      end={l.to === '/'}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'block rounded-lg px-3 py-3 font-display text-base font-medium',
                          isActive ? 'bg-bg2 text-gold' : 'text-t2 hover:text-t1',
                        )
                      }
                    >
                      {t(l.key)}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3">
                <SegToggle
                  ariaLabel="Price unit"
                  value={unit}
                  onChange={setUnit}
                  options={[
                    { value: 'usd-oz', label: 'USD/oz' },
                    { value: 'idr-gr', label: 'IDR/gr' },
                  ]}
                />
                <button
                  onClick={toggleTheme}
                  aria-label={themeLabel}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-hairline bg-bg2 px-3 py-2.5 font-display text-sm font-medium text-t2 transition-colors hover:border-goldline hover:text-gold"
                >
                  <span>{themeLabel}</span>
                  <span className="relative inline-flex h-4 w-4">
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
                  </span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
