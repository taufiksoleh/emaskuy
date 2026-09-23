/**
 * Footer — bg1, top hairline, 3 columns + bottom row (design.md §9).
 */
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useGoldPrice } from '@/hooks/useGoldPrice';

export function Footer() {
  const { t } = useI18n();
  const { status } = useGoldPrice();

  return (
    <motion.footer
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mt-8 border-t border-hairline bg-bg1 pb-24 lg:pb-0"
    >
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="EmasKuy" className="h-6 w-6" />
            <span className="font-display text-base font-bold text-t1">EmasKuy</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-[1.5] text-t2">{t('footer.tagline')}</p>
          <p className="mt-3 font-mono text-[13px] tabular text-t3">{t('footer.sources')}</p>
        </div>
        <div>
          <div className="label-micro">{t('footer.navigate')}</div>
          <nav className="mt-3 flex flex-col gap-2">
            <Link to="/" className="text-sm text-t2 transition-colors hover:text-gold">
              {t('nav.dashboard')}
            </Link>
            <Link to="/analisis" className="text-sm text-t2 transition-colors hover:text-gold">
              {t('nav.analysis')}
            </Link>
            <Link to="/kalkulator" className="text-sm text-t2 transition-colors hover:text-gold">
              {t('nav.calculator')}
            </Link>
            <Link to="/tentang" className="text-sm text-t2 transition-colors hover:text-gold">
              {t('nav.about')}
            </Link>
          </nav>
        </div>
        <div>
          <div className="label-micro">{t('footer.legal')}</div>
          <p className="mt-3 text-sm leading-[1.6] text-t3">{t('footer.disclaimer')}</p>
        </div>
      </div>
      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 md:px-6">
          <span className="font-mono text-xs tabular text-t3">© 2026 EmasKuy</span>
          <span className="flex items-center gap-1.5 font-mono text-xs tabular text-t3">
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  status === 'live'
                    ? 'var(--up)'
                    : status === 'cached'
                      ? 'var(--gold)'
                      : 'var(--down)',
              }}
            />
            API {status === 'live' ? t('common.live') : status === 'cached' ? t('common.cached') : t('common.offline')}
          </span>
        </div>
      </div>
    </motion.footer>
  );
}
