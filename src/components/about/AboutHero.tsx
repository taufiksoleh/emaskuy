/**
 * AboutHero — Section 1 (about.md): h-[70vh] full-bleed hero with
 * /about-hero.png backdrop (slow scale 1.0→1.08, 20s alternate), dark
 * gradient overlay, word-staggered H1 cascade, bouncing scroll hint.
 */
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export function AboutHero() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const words = t('about.hero.title').split(' ');

  return (
    <section className="relative flex h-[70vh] min-h-[420px] items-center justify-center overflow-hidden">
      {/* Backdrop */}
      <motion.img
        src="/about-hero.png"
        alt=""
        aria-hidden
        initial={false}
        animate={reduce ? { scale: 1 } : { scale: [1, 1.08] }}
        transition={
          reduce
            ? undefined
            : { duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
        }
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Overlay gradient --bg-0 40% → 90% bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,11,14,0.4) 0%, rgba(10,11,14,0.65) 55%, rgba(10,11,14,0.9) 100%)',
        }}
      />

      {/* Centered stack */}
      <div className="relative z-10 mx-auto flex max-w-[820px] flex-col items-center px-4 text-center md:px-6">
        <motion.span
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="label-micro text-gold"
        >
          {t('about.hero.label')}
        </motion.span>

        <h1 className="mt-4 font-display text-[clamp(40px,6vw,72px)] font-bold leading-[1.02] tracking-[-0.02em] text-t1">
          {words.map((w, i) => (
            <motion.span
              key={`${w}-${i}`}
              initial={reduce ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.1 + i * 0.04,
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block"
            >
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 + words.length * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-[600px] text-base leading-[1.65] text-t2"
        >
          {t('about.hero.body')}
        </motion.p>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 flex flex-col items-center gap-1.5"
        >
          <motion.span
            animate={reduce ? {} : { y: [0, 8, 0] }}
            transition={reduce ? undefined : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-5 w-5 text-gold" />
          </motion.span>
          <span className="label-micro">{t('about.hero.scroll')}</span>
        </motion.div>
      </div>
    </section>
  );
}
