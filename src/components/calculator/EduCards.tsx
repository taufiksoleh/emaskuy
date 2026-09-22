/**
 * EduCards — Section 3: three DCA education cards (design calculator.md §3).
 */
import { motion } from 'framer-motion';
import { Scale, Shield, TrendingUp } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { Panel } from '../ui-atoms/Panel';

export function EduCards() {
  const { t } = useI18n();
  const cards = [
    { icon: TrendingUp, title: t('calc.edu1.title'), body: t('calc.edu1.body'), img: '/article-dca-strategy.png' },
    { icon: Scale, title: t('calc.edu2.title'), body: t('calc.edu2.body'), img: null },
    { icon: Shield, title: t('calc.edu3.title'), body: t('calc.edu3.body'), img: null },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((c, i) => (
        <motion.div
          key={c.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ delay: i * 0.09, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -4 }}
          className="h-full"
        >
          <Panel interactive className="relative h-full overflow-hidden">
            {c.img && (
              <img
                src={c.img}
                alt=""
                className="pointer-events-none absolute right-3 top-3 h-[54px] w-24 rounded-md object-cover opacity-60"
                loading="lazy"
              />
            )}
            <c.icon className="h-7 w-7 text-gold" strokeWidth={1.75} />
            <h3 className="mt-3 font-display text-xl font-semibold leading-[1.3] tracking-[-0.02em] text-t1">
              {c.title}
            </h3>
            <p className="mt-2 text-sm leading-[1.5] text-t2">{c.body}</p>
          </Panel>
        </motion.div>
      ))}
    </div>
  );
}
