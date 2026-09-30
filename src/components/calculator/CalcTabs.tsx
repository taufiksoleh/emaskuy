/**
 * CalcTabs — navigation between the gold calculators under /kalkulator
 * (/en/calculator).
 * Sticky under the navbar; scrolls sideways on small screens.
 */
import { NavLink } from 'react-router';
import { motion } from 'framer-motion';
import { Gem, HandCoins, Target, TrendingUp } from 'lucide-react';
import { registerStrings, useI18n } from '@/lib/i18n';
import { pathFor } from '@/lib/routes';
import { cn } from '@/lib/utils';

registerStrings({
  'calc.tabs': { id: 'Jenis kalkulator', en: 'Calculators' },
});

const TABS = [
  { page: 'calculator', key: 'calc.tab.investment', icon: TrendingUp },
  { page: 'calcZakat', key: 'calc.tab.zakat', icon: HandCoins },
  { page: 'calcJewelry', key: 'calc.tab.jewelry', icon: Gem },
  { page: 'calcTarget', key: 'calc.tab.target', icon: Target },
] as const;

export function CalcTabs() {
  const { lang, t } = useI18n();
  return (
    <nav
      aria-label={t('calc.tabs')}
      className="sticky top-16 z-30 -mx-4 overflow-x-auto border-b border-hairline bg-bg0/90 px-4 backdrop-blur-[12px] [scrollbar-width:none] md:-mx-6 md:px-6 [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex min-w-max gap-1">
        {TABS.map(({ page, key, icon: Icon }) => (
          <NavLink
            key={page}
            to={pathFor(page, lang)}
            end
            className={({ isActive }) =>
              cn(
                'relative flex items-center gap-2 px-3 py-3 font-display text-sm font-medium transition-colors',
                isActive ? 'text-gold' : 'text-t2 hover:text-t1',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="h-4 w-4" aria-hidden />
                {t(key)}
                {isActive && (
                  <motion.span
                    layoutId="calc-tab-underline"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    className="absolute inset-x-2 -bottom-px h-0.5 bg-gold"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
