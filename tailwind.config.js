/** @type {import('tailwindcss').Config} */

// Brand and neutral colours are CSS variables (defined in src/index.css) so a
// deployment can re-skin the whole product without touching components.
const scale = (name) =>
  Object.fromEntries(
    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((step) => [step, `rgb(var(--${name}-${step}) / <alpha-value>)`])
  );

module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: scale('brand'),
        gray: scale('gray'),
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgb(16 24 20 / 0.05), 0 1px 3px rgb(16 24 20 / 0.04)',
        pop: '0 16px 40px -12px rgb(16 24 20 / 0.22)',
      },
    },
  },
  plugins: [],
}
