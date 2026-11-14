import { useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

const storedTheme = () => {
  try { return localStorage.getItem('theme'); } catch { return null; }
};

// The <html> class is set before React loads by the inline script in
// index.html, so first paint is already in the right theme.
const initialDark = () => {
  const stored = storedTheme();
  if (stored) return stored === 'dark';
  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
};

const ThemeToggle = ({ className = '' }) => {
  const [dark, setDark] = useState(initialDark);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch { /* private mode */ }
    window.dispatchEvent(new CustomEvent('swk-theme', { detail: { dark: next } }));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className={`p-2 rounded-full transition-colors duration-200 ${className}`}
    >
      {dark ? <FaSun size={16} /> : <FaMoon size={16} />}
    </button>
  );
};

export default ThemeToggle;
