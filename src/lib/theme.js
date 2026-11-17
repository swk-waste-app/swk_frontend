import { brand } from '../config/brand';

// When a deployment sets a primary colour, derive the full 50-950 brand scale
// from it and write it over the default palette defined in index.css.

const parseHex = (hex) => {
  const match = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
  if (!match) return null;
  const n = parseInt(match[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const mix = (from, to, amount) => from.map((c, i) => Math.round(c + (to[i] - c) * amount));

// How far each step sits from the chosen colour (placed at 600):
// positive values mix toward white, negative toward black.
const STEPS = { 50: 0.94, 100: 0.86, 200: 0.72, 300: 0.52, 400: 0.3, 500: 0.13, 600: 0, 700: -0.18, 800: -0.33, 900: -0.46, 950: -0.66 };

export const applyBrandTheme = () => {
  const base = parseHex(brand.primaryColor);
  if (!base) return;
  const root = document.documentElement.style;
  for (const [step, amount] of Object.entries(STEPS)) {
    const rgb = amount >= 0 ? mix(base, [255, 255, 255], amount) : mix(base, [0, 0, 0], -amount);
    root.setProperty(`--brand-${step}`, rgb.join(' '));
  }
};
