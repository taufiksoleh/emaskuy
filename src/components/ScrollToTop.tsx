/**
 * ScrollToTop — start each newly visited page at the top. Back/forward
 * (POP) navigation is left alone so the browser can restore position, and
 * switching between calculator tabs keeps the tabs in view.
 */
import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router';
import { pathFor } from '@/lib/routes';

const inCalculators = (path: string) =>
  (['id', 'en'] as const).some((lang) => {
    const base = pathFor('calculator', lang);
    return path === base || path.startsWith(`${base}/`);
  });

export function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  const prevPath = useRef(pathname);

  useEffect(() => {
    const sameHub = inCalculators(prevPath.current) && inCalculators(pathname);
    prevPath.current = pathname;
    if (navType !== 'POP' && !sameHub) window.scrollTo(0, 0);
  }, [pathname, navType]);

  return null;
}
