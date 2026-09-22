/**
 * HowWeCalculate — Section 3 (about.md): 3-step methodology.
 * Cards stagger 100ms slide-up on scroll; the 1px gold-dim connector line
 * stroke-draws left→right via ScrollTrigger scrub; mono formula chip with
 * hover tooltip explaining the troy ounce. GSAP-isolated component.
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, Scale, MonitorSmartphone } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { icon: Download, titleKey: 'about.calc.step1.title', descKey: 'about.calc.step1.desc' },
  { icon: Scale, titleKey: 'about.calc.step2.title', descKey: 'about.calc.step2.desc' },
  { icon: MonitorSmartphone, titleKey: 'about.calc.step3.title', descKey: 'about.calc.step3.desc' },
] as const;

export function HowWeCalculate() {
  const { t } = useI18n();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const cards = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.about-step'));
      const lineEl = root.querySelector<HTMLElement>('.about-connector');

      const ctx = gsap.context(() => {
        gsap.from(cards, {
          y: 24,
          opacity: 0,
          duration: 0.45,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: root, start: 'top 85%', once: true },
        });
        if (lineEl) {
          gsap.fromTo(
            lineEl,
            { scaleX: 0 },
            {
              scaleX: 1,
              transformOrigin: 'left center',
              duration: 1,
              ease: 'none',
              scrollTrigger: { trigger: root, start: 'top 80%', end: 'top 40%', scrub: 0.5 },
            },
          );
        }
      }, root);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="py-16">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6">
        <span className="label-micro text-gold">{t('about.calc.label')}</span>
        <h2 className="mt-3 font-display text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] text-t1 md:text-4xl">
          {t('about.calc.title')}
        </h2>

        <div className="relative mt-10">
          {/* Connector line (draws left→right on scroll, desktop only) */}
          <div
            aria-hidden
            className="about-connector absolute left-0 right-0 top-5 hidden h-px lg:block"
            style={{
              background:
                'linear-gradient(90deg, var(--gold-dim) 0%, var(--gold) 50%, var(--gold-dim) 100%)',
            }}
          />

          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.titleKey} className="about-step relative">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-goldline bg-bg2 font-mono text-sm font-semibold text-gold">
                      {i + 1}
                    </span>
                    <Icon className="h-4 w-4 text-golddim" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.02em] text-t1">
                    {t(step.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-[1.65] text-t2">{t(step.descKey)}</p>

                  {i === 1 && (
                    <div className="group relative mt-4 inline-block">
                      <code className="block cursor-default rounded-lg border border-hairline bg-bg3 px-3 py-2 font-mono text-[13px] tabular text-gold transition-colors duration-150 group-hover:border-gold">
                        IDR/gr = XAU_USD ÷ 31,1034768 × USDIDR
                      </code>
                      <span className="pointer-events-none absolute left-0 top-full z-10 mt-2 w-64 rounded-lg border border-goldline bg-bg3 px-3 py-2 text-xs leading-relaxed text-t2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        {t('about.calc.formulaTooltip')}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
