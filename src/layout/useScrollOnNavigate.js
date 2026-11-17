import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// On every navigation, scroll to the element named in the URL hash (for
// example /#how-it-works) or, when there is none, to the top of the new page.
export const useScrollOnNavigate = () => {
  const location = useLocation();

  useEffect(() => {
    const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
    if (!target) {
      window.scrollTo(0, 0);
      return;
    }
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [location]);
};
