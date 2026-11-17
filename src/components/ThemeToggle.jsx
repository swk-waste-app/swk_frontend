import { useState } from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';

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

// Pass `className` to recolour the button for a non-neutral surface; without
// it the button uses the neutral ghost style.
const ThemeToggle = ({ className = '' }) => {
  const [dark, setDark] = useState(initialDark);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch { /* private mode */ }
    window.dispatchEvent(new CustomEvent('swk-theme', { detail: { dark: next } }));
  };

  const Icon = dark ? LuSun : LuMoon;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className={`btn h-9 w-9 p-0 ${className || 'btn-ghost'}`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
};

export default ThemeToggle;
