/**
 * Article reader — /analisis/:slug (analysis.md, "Article Reader").
 * Lenis smooth scroll + GSAP ScrollTrigger: fixed reading-progress bar,
 * hero parallax (0.15 rate), per-block fade-up reveals, H1 word stagger.
 * Sticky side rail (≥1280px): live price mini-card + TOC scroll-spy
 * (IntersectionObserver, click → Lenis scrollTo). Pull-quote, live data
 * callout, share row (X / copy-link toast / WhatsApp), related articles.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { toast } from 'sonner';
import { ArrowLeft, Check, Link2, Twitter, MessageCircle } from 'lucide-react';
import { registerStrings, useI18n } from '@/lib/i18n';
import { getArticle, relatedArticles } from '@/data/articles';
import { formatDate } from '@/lib/gold';
import { ArticleCard } from '@/components/ui-atoms/ArticleCard';
import { MiniLivePrice } from '@/components/analysis/MiniLivePrice';
import { LiveCallout } from '@/components/analysis/LiveCallout';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

registerStrings({
  'art.back': { id: 'Semua Analisis', en: 'All Analysis' },
  'art.toc': { id: 'Daftar Isi', en: 'Contents' },
  'art.related': { id: 'Artikel Terkait', en: 'Related Articles' },
  'art.share': { id: 'Bagikan', en: 'Share' },
  'art.copied': { id: 'Tautan disalin', en: 'Link copied' },
  'art.copy': { id: 'Salin tautan', en: 'Copy link' },
  'art.notFound': { id: 'Artikel tidak ditemukan', en: 'Article not found' },
});

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const article = getArticle(slug ?? searchParams.get('slug') ?? '');
  const { lang, t } = useI18n();
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [activeSec, setActiveSec] = useState(0);
  const [copied, setCopied] = useState(false);

  const related = useMemo(() => (article ? relatedArticles(article, 2) : []), [article]);

  /* Lenis smooth scroll, synced to ScrollTrigger */
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1 });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.scrollTo(0, { immediate: true });
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [article?.slug]);

  /* GSAP: progress bar, hero parallax + intro, block reveals, H1 stagger */
  useEffect(() => {
    if (!article) return;
    const ctx = gsap.context(() => {
      if (progressRef.current) {
        gsap.fromTo(
          progressRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { start: 0, end: 'max', scrub: true },
          },
        );
      }
      if (heroImgRef.current) {
        gsap.fromTo(
          heroImgRef.current,
          { scale: 1.06, yPercent: -7.5 },
          {
            scale: 1,
            yPercent: 7.5,
            ease: 'none',
            scrollTrigger: {
              trigger: heroImgRef.current.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
        gsap.fromTo(heroImgRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2 });
      }
      // H1 word stagger (35ms slide-up on load)
      const words = gsap.utils.toArray<HTMLElement>('[data-word]');
      if (words.length) {
        gsap.fromTo(
          words,
          { y: '1em', opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.035, ease: 'power3.out', delay: 0.05 },
        );
      }
      // Block-level fade-up reveals (16px, trigger 20% viewport, 500ms)
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 80%', once: true },
          },
        );
      });
      // Related cards stagger (100ms on scroll into view)
      const rel = gsap.utils.toArray<HTMLElement>('[data-related]');
      if (rel.length) {
        gsap.fromTo(
          rel,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: rel[0].parentElement, start: 'top 80%', once: true },
          },
        );
      }
    }, rootRef);
    return () => ctx.revert();
  }, [article?.slug, lang]);

  /* TOC scroll-spy */
  useEffect(() => {
    if (!article) return;
    const headings = article.sections
      .map((_, i) => document.getElementById(`sec-${i}`))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!headings.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = headings.indexOf(e.target as HTMLElement);
            if (idx >= 0) setActiveSec(idx);
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px' },
    );
    headings.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, [article, lang]);

  if (!article) {
    return (
      <div className="mx-auto max-w-[720px] px-4 py-24 text-center">
        <p className="font-display text-2xl font-semibold text-t1">{t('art.notFound')}</p>
        <Link to="/analisis" className="mt-4 inline-flex items-center gap-2 text-sm text-gold">
          <ArrowLeft className="h-4 w-4" /> {t('art.back')}
        </Link>
      </div>
    );
  }

  const meta = `${formatDate(article.publishedAt, lang)} · ${article.readMinutes} ${
    lang === 'id' ? 'mnt baca' : 'min read'
  } · ${article.author[lang]}`;

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = article.title[lang];
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    toast.success(t('art.copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  // Body layout: sections with pull-quote after section 0 and callout after section 1
  const bodyBlocks: React.ReactNode[] = [];
  article.sections.forEach((sec, i) => {
    bodyBlocks.push(
      <section key={`s${i}`} id={`sec-${i}`} className="scroll-mt-24">
        <h2
          data-reveal
          className="mt-10 font-display text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] text-t1"
        >
          {sec.heading[lang]}
        </h2>
        {sec.paragraphs.map((p, j) => (
          <p key={j} data-reveal className="mt-5 text-base leading-[1.65] text-t1/90">
            {p[lang]}
          </p>
        ))}
      </section>,
    );
    if (i === 0) {
      bodyBlocks.push(
        <blockquote
          key="pq"
          data-reveal
          className="my-10 border-l-[3px] border-gold pl-6 font-display text-xl italic leading-[1.4] text-goldbright"
        >
          {article.pullQuote[lang]}
        </blockquote>,
      );
    }
    if (i === 1) {
      bodyBlocks.push(
        <div key="co" data-reveal>
          <LiveCallout kind={article.callout} />
        </div>,
      );
    }
  });

  return (
    <div ref={rootRef}>
      {/* Reading progress bar — fixed under the 64px navbar */}
      <div className="fixed inset-x-0 top-16 z-40 h-0.5 bg-transparent">
        <div
          ref={progressRef}
          className="h-full w-full origin-left bg-gold"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 md:px-6">
        <div className="xl:grid xl:grid-cols-[220px_minmax(0,720px)_1fr] xl:gap-10">
          {/* Sticky side rail (desktop ≥1280px) */}
          <aside className="hidden pt-10 xl:block">
            <div className="sticky top-24 flex flex-col gap-4">
              <MiniLivePrice className="w-full justify-between" />
              <div>
                <div className="label-micro">{t('art.toc')}</div>
                <nav className="mt-3 flex flex-col gap-1 border-l border-hairline">
                  {article.sections.map((sec, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        lenisRef.current?.scrollTo(`#sec-${i}`, { duration: 0.8, offset: -88 })
                      }
                      className={cn(
                        'cursor-pointer border-l-2 py-1.5 pl-3 text-left text-[13px] leading-snug transition-colors duration-150',
                        i === activeSec
                          ? 'border-gold text-gold'
                          : '-ml-px border-transparent text-t3 hover:text-t2',
                      )}
                    >
                      {sec.heading[lang]}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Article column */}
          <article className="max-w-[720px]">
            <Link
              to="/analisis"
              className="mt-6 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-t2 transition-colors hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" /> {t('art.back')}
            </Link>

            <div className="mt-4">
              <span className="label-micro rounded-md bg-bg3 px-2 py-1 text-gold">
                {t(`article.cat.${article.category}`)}
              </span>
            </div>
            <h1 className="mt-4 font-display text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-t1">
              {article.title[lang].split(' ').map((w, i) => (
                <span key={i} className="inline-block overflow-hidden align-bottom">
                  <span data-word className="inline-block">
                    {w}
                  </span>
                  {'\u00A0'}
                </span>
              ))}
            </h1>
            <div className="mt-4 font-mono text-[13px] tabular text-t3">{meta}</div>
          </article>
          <div className="hidden xl:block" />
        </div>

        {/* Full-bleed hero with parallax + bottom gradient */}
        <div className="relative mx-auto mt-8 aspect-video max-w-[1100px] overflow-hidden rounded-[10px] border border-hairline">
          <img
            ref={heroImgRef}
            src={article.image}
            alt={article.title[lang]}
            className="h-full w-full object-cover"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
            style={{ background: 'linear-gradient(180deg, transparent, var(--bg-0))' }}
          />
        </div>

        {/* Body + footer */}
        <div className="mx-auto max-w-[720px] pb-4">
          {bodyBlocks}

          {/* Share row + author */}
          <div data-reveal className="mt-12 border-t border-hairline pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="font-display text-sm font-semibold text-t1">
                  {article.author[lang]}
                </div>
                <div className="mt-0.5 font-mono text-[13px] tabular text-t3">
                  {formatDate(article.publishedAt, lang)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="label-micro mr-1">{t('art.share')}</span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X"
                  className="rounded-lg border border-hairline bg-bg2 p-2 text-t2 transition-colors hover:border-goldline hover:text-gold"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <button
                  onClick={copyLink}
                  aria-label={t('art.copy')}
                  className="cursor-pointer rounded-lg border border-hairline bg-bg2 p-2 text-t2 transition-colors hover:border-goldline hover:text-gold"
                >
                  {copied ? <Check className="h-4 w-4 text-up" /> : <Link2 className="h-4 w-4" />}
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="rounded-lg border border-hairline bg-bg2 p-2 text-t2 transition-colors hover:border-goldline hover:text-gold"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Related articles */}
          <div className="mt-10">
            <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-t1">
              {t('art.related')}
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {related.map((a) => (
                <div key={a.slug} data-related>
                  <ArticleCard article={a} variant="featured" className="h-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
