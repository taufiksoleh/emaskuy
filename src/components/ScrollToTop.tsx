/**
 * ScrollToTop — start each newly visited page at the top. Back/forward
 * (POP) navigation is left alone so the browser can restore position, and
 * switching between calculator tabs keeps the tabs in view.
 */
import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router';

const section = (path: string) => path.split('/')[1] ?? '';

export function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  const prevPath = useRef(pathname);

  useEffect(() => {
    const sameHub = section(prevPath.current) === 'kalkulator' && section(pathname) === 'kalkulator';
    prevPath.current = pathname;
    if (navType !== 'POP' && !sameHub) window.scrollTo(0, 0);
  }, [pathname, navType]);

  return null;
}
