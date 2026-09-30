/**
 * ScrollToTop — start each newly visited page at the top. Back/forward
 * (POP) navigation is left alone so the browser can restore position.
 */
import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router';

export function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (navType !== 'POP') window.scrollTo(0, 0);
  }, [pathname, navType]);

  return null;
}
