/**
 * About / Tentang & Metodologi page (about.md).
 * Hero → pinned GSAP data-source storytelling → 3-step methodology →
 * FAQ accordion → disclaimer + contact. Lenis smooth scroll on this page
 * only (design.md §6), synced with ScrollTrigger.
 */
import { useEffect } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '@/lib/about-strings';
import { AboutHero } from '@/components/about/AboutHero';
import { DataSources } from '@/components/about/DataSources';
import { HowWeCalculate } from '@/components/about/HowWeCalculate';
import { FaqSection } from '@/components/about/FaqSection';
import { DisclaimerSection } from '@/components/about/DisclaimerSection';

export default function About() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.1 });
    lenis.on('scroll', ScrollTrigger.update);
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div>
      <AboutHero />
      <DataSources />
      <HowWeCalculate />
      <FaqSection />
      <DisclaimerSection />
    </div>
  );
}
