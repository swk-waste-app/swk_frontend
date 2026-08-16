import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/images/SWK_LOGO__5_.png';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Who We Are', to: '/who-we-are' },
  { label: 'Services', to: '/#services' },
  { label: 'Education', to: '/education' },
  { label: 'Blog', to: '/blog' },
];

const Navbar = ({ forceSolid = false }) => {
  const [scrolledPast, setScrolledPast] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = forceSolid || scrolledPast;

  useEffect(() => {
    if (forceSolid) return;
    const onScroll = () => setScrolledPast(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [forceSolid]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors duration-200 ${
      scrolled
        ? isActive ? 'text-green-700' : 'text-gray-700 hover:text-green-700'
        : isActive ? 'text-white' : 'text-white/90 hover:text-white'
    }`;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Taka Kipawa" className="h-11 sm:h-12 w-auto object-contain" />
        </Link>

        <div className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.label} to={link.to} className={linkClass} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/signin"
            className={`text-sm font-semibold px-5 py-2.5 rounded-full border transition-all duration-200 ${
              scrolled
                ? 'border-green-700 text-green-700 hover:bg-green-50'
                : 'border-white/70 text-white hover:bg-white/10'
            }`}
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="text-sm font-semibold px-5 py-2.5 rounded-full text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md shadow-green-600/30 transition-all duration-200"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((v) => !v)}
          className={`lg:hidden p-2 rounded-lg ${scrolled ? 'text-green-800' : 'text-white'}`}
        >
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="lg:hidden absolute top-full inset-x-0 bg-white shadow-xl border-t border-gray-100 animate-fade-in">
          <div className="flex flex-col px-6 py-6 gap-5">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 font-semibold text-base hover:text-green-700"
              >
                {link.label}
              </NavLink>
            ))}
            <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
              <Link
                to="/signin"
                onClick={() => setMenuOpen(false)}
                className="text-center text-sm font-semibold px-5 py-3 rounded-full border border-green-700 text-green-700"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="text-center text-sm font-semibold px-5 py-3 rounded-full text-white bg-gradient-to-r from-green-500 to-green-600"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
