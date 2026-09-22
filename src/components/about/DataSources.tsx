/**
 * DataSources — Section 2 (about.md): pinned storytelling panel.
 * GSAP ScrollTrigger pins the viewport-height section for 150vh; scroll
 * progress scrubs transitions between three source cards (gold-api.com,
 * Frankfurter, NBP) with gold progress dots. Code lines reveal with a
 * typing-like stagger when each card becomes active.
 *
 * Isolated GSAP component (no Framer Motion inside). Disabled (static
 * stacked cards) under prefers-reduced-motion or viewports < lg.
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Coins, Landmark, LineChart } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { formatTimeUtc } from '@/lib/gold';
import { Badge } from '@/components/ui-atoms/Badge';
import { Panel } from '@/components/ui-atoms/Panel';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

type Seg = { text: string; kind: 'key' | 'str' | 'num' | 'punct' };
type CodeLine = Seg[];

function line(...segs: Seg[]): CodeLine {
  return segs;
}
const k = (text: string): Seg => ({ text, kind: 'key' });
const s = (text: string): Seg => ({ text, kind: 'str' });
const n = (text: string): Seg => ({ text, kind: 'num' });
const p = (text: string): Seg => ({ text, kind: 'punct' });

const SEG_CLASS: Record<Seg['kind'], string> = {
  key: 'text-gold',
  str: 'text-info',
  num: 'text-t1',
  punct: 'text-t3',
};

interface Source {
  icon: typeof Coins;
  name: string;
  descKey: string;
  endpoint: string;
  code: CodeLine[];
}

const SOURCES: Source[] = [
  {
    icon: Coins,
    name: 'gold-api.com',
    descKey: 'about.sources.1.desc',
    endpoint: 'api.gold-api.com/price/XAU',
    code: [
      line(p('{')),
      line(p('  '), k('"name"'), p(': '), s('"Gold"'), p(',')),
      line(p('  '), k('"symbol"'), p(': '), s('"XAU"'), p(',')),
      line(p('  '), k('"price"'), p(': '), n('4351.2'), p(',')),
      line(p('  '), k('"updatedAt"'), p(': '), s('"…"'), p('')),
      line(p('}')),
    ],
  },
  {
    icon: Landmark,
    name: 'Frankfurter (ECB)',
    descKey: 'about.sources.2.desc',
    endpoint: 'api.frankfurter.dev/v1/latest?base=USD&symbols=IDR',
    code: [
      line(p('{')),
      line(p('  '), k('"base"'), p(': '), s('"USD"'), p(',')),
      line(p('  '), k('"date"'), p(': '), s('"2026-09-21"'), p(',')),
      line(p('  '), k('"rates"'), p(': '), p('{ '), k('"IDR"'), p(': '), n('16384.5'), p(' }')),
      line(p('}')),
    ],
  },
  {
    icon: LineChart,
    name: 'NBP — Narodowy Bank Polski',
    descKey: 'about.sources.3.desc',
    endpoint: 'api.nbp.pl/api/cenyzlota/last/30/?format=json',
    code: [
      line(p('[')),
      line(p('  '), p('{ '), k('"data"'), p(': '), s('"2026-09-18"'), p(','), k('"cena"'), p(': '), n('525.35'), p(' },')),
      line(p('  '), p('{ '), k('"data"'), p(': '), s('"2026-09-21"'), p(','), k('"cena"'), p(': '), n('527.91'), p(' }')),
      line(p('  '), p('…')),
      line(p(']')),
    ],
  },
];

function SourceCard({ source, index }: { source: Source; index: number }) {
  const { t } = useI18n();
  const { gold } = useGoldPrice();
  const Icon = source.icon;
  return (
    <div className={cn('about-source-card', index > 0 && 'lg:absolute lg:inset-0')}>
      <Panel className="h-full" glow={index === 0}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-goldline bg-bg3">
            <Icon className="h-5 w-5 text-gold" />
          </span>
          <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-t1">
            {source.name}
          </h3>
          <Badge variant="cached">{t('about.sources.badge')}</Badge>
        </div>
        <p className="mt-4 text-sm leading-[1.65] text-t2">{t(source.descKey)}</p>

        <div className="mt-5 overflow-hidden rounded-lg border border-hairline bg-bg0">
          <div className="flex items-center justify-between border-b border-hairline px-3 py-2">
            <span className="font-mono text-[11px] text-t3">GET {source.endpoint}</span>
            {index === 0 && gold && gold.updatedAt > 0 && (
              <span className="font-mono text-[11px] tabular text-golddim">
                {t('about.sources.lastFetched')}: {formatTimeUtc(gold.updatedAt)}
              </span>
            )}
          </div>
          <pre className="overflow-x-auto px-3 py-2.5 font-mono text-xs leading-[1.7]">
            {source.code.map((ln, li) => (
              <div key={li} className="about-code-line whitespace-pre">
                {ln.map((seg, si) => (
                  <span key={si} className={SEG_CLASS[seg.kind]}>
                    {seg.text}
                  </span>
                ))}
              </div>
            ))}
          </pre>
        </div>
      </Panel>
    </div>
  );
}

export function DataSources() {
  const { t } = useI18n();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add(
      { pinIt: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)' },
      ({ conditions }) => {
        if (!conditions?.pinIt) return;
        const cards = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.about-source-card'));
        const dots = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.about-dot'));
        // Initial state: only first card visible; its code lines reveal.
        cards.forEach((c, i) => {
          gsap.set(c, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 40 });
        });
        if (dots[0]) gsap.set(dots[0], { backgroundColor: 'var(--gold)' });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=150%',
            pin: true,
            scrub: 0.6,
          },
        });

        for (let i = 1; i < cards.length; i++) {
          const at = (i - 1) * 0.5 + 0.35;
          // Current card slides up 60px + fades out; next slides in from 40px.
          tl.to(cards[i - 1], { opacity: 0, y: -60, duration: 0.3, ease: 'none' }, at)
            .fromTo(cards[i], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3, ease: 'none' }, at + 0.12)
            // Dots fill gold sequentially.
            .to(dots[i], { backgroundColor: 'var(--gold)', duration: 0.08 }, at);
          // Typing-like stagger of code lines when the card becomes active.
          tl.fromTo(
            cards[i].querySelectorAll('.about-code-line'),
            { opacity: 0.15 },
            { opacity: 1, duration: 0.06, stagger: 0.06, ease: 'none' },
            at + 0.18,
          );
        }

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      },
    );
    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden border-y border-hairline bg-bg0 py-16 lg:h-screen lg:py-0">
      <div className="mx-auto flex h-full max-w-[1440px] flex-col gap-10 px-4 md:px-6 lg:flex-row lg:items-center lg:gap-14">
        {/* Left 40%: heading + progress dots */}
        <div className="lg:w-[40%] lg:shrink-0">
          <span className="label-micro text-gold">{t('about.sources.label')}</span>
          <h2 className="mt-3 font-display text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] text-t1 md:text-4xl">
            {t('about.sources.title')}
          </h2>
          <div className="mt-8 hidden items-center gap-3 lg:flex" aria-hidden>
            {SOURCES.map((_, i) => (
              <span
                key={i}
                className="about-dot h-2 w-2 rounded-full"
                style={{ backgroundColor: i === 0 ? 'var(--gold)' : 'var(--bg-3)' }}
              />
            ))}
          </div>
        </div>

        {/* Right 60%: stacked / swapping cards */}
        <div className="flex flex-col gap-6 lg:relative lg:h-[560px] lg:w-[60%] lg:gap-0">
          {SOURCES.map((src, i) => (
            <SourceCard key={src.name} source={src} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
