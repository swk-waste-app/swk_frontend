import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LuMenu, LuX } from 'react-icons/lu';
import { Button } from './ui';
import BrandMark from './BrandMark';
import ThemeToggle from './ThemeToggle';

const NAV_LINKS = [
  { label: 'How it works', to: '/#how-it-works' },
  { label: 'Education', to: '/education' },
  { label: 'News', to: '/blog' },
  { label: 'About', to: '/who-we-are' },
];

const ACTIVE = 'text-brand-700 dark:text-brand-400';
const IDLE = 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white';

// Links to a section of the home page are never shown as the current page.
const NavItem = ({ link, className }) =>
  link.to.includes('#') ? (
    <Link to={link.to} className={`${className} ${IDLE}`}>{link.label}</Link>
  ) : (
    <NavLink to={link.to} className={({ isActive }) => `${className} ${isActive ? ACTIVE : IDLE}`}>
      {link.label}
    </NavLink>
  );

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setMenuOpen(false); }, [location]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="min-w-0 rounded-lg text-gray-900 dark:text-gray-50">
          <BrandMark />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavItem key={link.to} link={link} className="rounded-md px-3 py-2 text-sm font-medium transition-colors" />
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 lg:gap-2">
          <ThemeToggle />
          <Button as={Link} to="/signin" variant="ghost" className="hidden lg:inline-flex">Sign in</Button>
          <Button as={Link} to="/signup" className="hidden lg:inline-flex">Get started</Button>
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="btn btn-ghost px-2.5 lg:hidden"
          >
            {menuOpen ? <LuX className="h-5 w-5" aria-hidden="true" /> : <LuMenu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="site-menu" className="border-t border-gray-200 px-4 py-4 animate-fade-in dark:border-gray-800 sm:px-6 lg:hidden">
          <nav aria-label="Main" className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <NavItem key={link.to} link={link} className="rounded-md px-2 py-2.5 text-base font-medium" />
            ))}
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-200 pt-4 dark:border-gray-800">
            <Button as={Link} to="/signin" variant="secondary">Sign in</Button>
            <Button as={Link} to="/signup">Get started</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
