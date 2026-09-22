/**
 * DisclaimerSection — Section 5 (about.md): disclaimer Panel with gold
 * alert-triangle icon (one-time gentle shake on scroll into view), contact
 * row (mailto ghost button + GitHub link), final copyright line.
 */
import { motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, Github, Mail } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { Panel } from '@/components/ui-atoms/Panel';

export function DisclaimerSection() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section className="mb-8 border-t border-hairline py-16">
      <div className="mx-auto max-w-[800px] px-4 md:px-6">
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Panel>
            <div className="flex items-start gap-4">
              <motion.span
                initial={reduce ? false : { rotate: 0 }}
                whileInView={
                  reduce
                    ? undefined
                    : { rotate: [0, -4, 4, -4, 4, -2, 0] }
                }
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-goldline bg-bg3"
              >
                <AlertTriangle className="h-5 w-5 text-gold" />
              </motion.span>
              <div>
                <span className="label-micro text-gold">{t('about.disclaimer.label')}</span>
                <h3 className="mt-1.5 font-display text-xl font-semibold tracking-[-0.02em] text-t1">
                  {t('about.disclaimer.title')}
                </h3>
                <p className="mt-3 text-sm leading-[1.65] text-t2">{t('about.disclaimer.body')}</p>
              </div>
            </div>
          </Panel>
        </motion.div>

        {/* Contact row */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="label-micro">{t('about.contact.label')}</span>
          <a
            href="mailto:halo@goldlens.id"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-hairline px-3.5 py-2 text-sm font-medium text-t1 transition-colors duration-150 hover:border-goldline hover:text-gold"
          >
            <Mail className="h-4 w-4" />
            halo@goldlens.id
          </a>
          <a
            href="https://github.com/goldlens"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-hairline p-2 text-t1 transition-colors duration-150 hover:border-goldline hover:text-gold"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>

        <p className="mt-8 text-center font-mono text-[13px] tabular text-t3">
          {t('about.copyright')}
        </p>
      </div>
    </section>
  );
}
