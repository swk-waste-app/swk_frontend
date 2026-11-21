import { Link } from 'react-router-dom';
import { brand } from '../config/brand';
import BrandMark from './BrandMark';

const LINK_GROUPS = [
  {
    title: 'Service',
    links: [
      { label: 'How it works', to: '/#how-it-works' },
      { label: 'For vendors', to: '/#vendors' },
      { label: 'Education', to: '/education' },
      { label: 'News', to: '/blog' },
      { label: 'About', to: '/who-we-are' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign in', to: '/signin' },
      { label: 'Create an account', to: '/signup' },
      { label: 'Open a vendor account', to: '/signup?type=vendor' },
    ],
  },
];

const linkClass = 'text-gray-600 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-gray-100';

const Footer = () => (
  <footer className="border-t border-gray-200 text-sm dark:border-gray-800">
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.25fr]">
        <div>
          <Link to="/" className="inline-flex max-w-full rounded-lg text-gray-900 dark:text-gray-50">
            <BrandMark />
          </Link>
          <p className="mt-4 max-w-xs text-gray-600 dark:text-gray-400">{brand.tagline}</p>
        </div>

        {LINK_GROUPS.map(({ title, links }) => (
          <nav key={title} aria-label={title}>
            <p className="eyebrow">{title}</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {links.map(({ label, to }) => (
                <li key={to}><Link to={to} className={linkClass}>{label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <p className="eyebrow">Contact</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-gray-600 dark:text-gray-400">
            <li>Operated by {brand.operator}, {brand.country}</li>
            <li className="select-all break-all text-gray-900 dark:text-gray-100">{brand.supportEmail}</li>
            <li><Link to="/who-we-are#contact" className={linkClass}>Send a message</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-2 border-t border-gray-200 pt-6 text-gray-500 dark:border-gray-800 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} {brand.operator}. All rights reserved.</p>
        {brand.builtByName && (
          <p>
            Built by{' '}
            <a
              href={brand.builtByUrl}
              target="_blank"
              rel="noopener"
              className="font-medium text-gray-700 hover:text-gray-900 hover:underline dark:text-gray-300 dark:hover:text-gray-100"
            >
              {brand.builtByName}
            </a>
            {' '}({new URL(brand.builtByUrl).hostname.replace(/^www\./, '')})
          </p>
        )}
      </div>
    </div>
  </footer>
);

export default Footer;
