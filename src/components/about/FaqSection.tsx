/**
 * FaqSection — Section 4 (about.md): shadcn accordion, 5 items, gold
 * chevron rotating 180°; items stagger 60ms fade-up on scroll into view.
 */
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQS = [1, 2, 3, 4, 5] as const;

export function FaqSection() {
  const { t } = useI18n();

  return (
    <section className="border-t border-hairline py-16">
      <div className="mx-auto max-w-[800px] px-4 md:px-6">
        <div className="text-center">
          <span className="label-micro text-gold">{t('about.faq.label')}</span>
          <h2 className="mt-3 font-display text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] text-t1 md:text-4xl">
            {t('about.faq.title')}
          </h2>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          className="mt-10"
        >
          <Accordion type="single" collapsible className="rounded-[10px] border border-hairline bg-bg1 px-4 md:px-6">
            {FAQS.map((i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { y: 16, opacity: 0 },
                  show: { y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                <AccordionItem value={`faq-${i}`} className="border-hairline">
                  <AccordionTrigger className="font-display text-base font-medium text-t1 hover:text-gold hover:no-underline [&[data-state=open]>svg]:text-gold [&>svg]:transition-transform [&>svg]:duration-300">
                    {t(`about.faq.${i}.q`)}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-[1.65] text-t2">
                    {t(`about.faq.${i}.a`)}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
