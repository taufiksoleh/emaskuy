/**
 * Section 5 — Calculator CTA band with drifting gold glow + word reveal.
 */
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Calculator, BookOpen } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function CtaBand() {
  const { t } = useI18n();
  const headline = t('home.cta.headline').split(' ');

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-12 md:px-6">
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease }}
        className="glow-drift relative overflow-hidden rounded-[10px] border border-goldline bg-bg1"
        style={{
          backgroundImage:
            'radial-gradient(400px 220px at 0% 0%, rgba(245,185,62,0.10), transparent 70%), radial-gradient(400px 220px at 100% 100%, rgba(245,185,62,0.10), transparent 70%)',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="grid grid-cols-1 items-center gap-6 p-6 md:p-10 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <h2 className="font-display text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] text-t1 md:text-4xl">
              {headline.map((w, i) => (
                <motion.span
                  key={i}
                  className="inline-block overflow-hidden align-bottom"
                  initial={{ y: 12, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.35, ease, delay: i * 0.04 }}
                >
                  <span className="inline-block">{w}&nbsp;</span>
                </motion.span>
              ))}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-[1.5] text-t2">{t('home.cta.body')}</p>
          </div>
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, ease, delay: 0.12 }}
            className="flex flex-col gap-3 xl:col-span-4"
          >
            <Link
              to="/kalkulator"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-display text-sm font-semibold transition-all duration-150 hover:-translate-y-px hover:brightness-108 active:scale-[0.97]"
              style={{
                background: 'linear-gradient(135deg, #FFD975 0%, #F5B93E 45%, #C98A1B 100%)',
                color: '#1A1305',
              }}
            >
              <Calculator className="h-4 w-4" />
              {t('home.cta.openCalc')}
            </Link>
            <Link
              to="/tentang"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-hairline px-5 py-3 font-display text-sm font-medium text-t1 transition-colors duration-150 hover:border-goldline hover:text-gold active:scale-[0.97]"
            >
              <BookOpen className="h-4 w-4" />
              {t('home.cta.methodology')}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
