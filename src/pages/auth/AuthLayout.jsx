import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LuAward, LuCircleAlert, LuEye, LuEyeOff, LuShoppingBag, LuTruck } from 'react-icons/lu';
import BrandLockup from '../../components/BrandLockup';
import ThemeToggle from '../../components/ThemeToggle';
import { Button } from '../../components/ui';
import { brand } from '../../config/brand';

const BENEFITS = [
  { icon: LuTruck, text: 'Choose a pickup date and follow the collection status.' },
  { icon: LuAward, text: 'Earn reward points for every completed pickup.' },
  { icon: LuShoppingBag, text: 'Buy and sell upcycled goods in the marketplace.' },
];

const INVALID = 'border-red-500 dark:border-red-500';

// Frame shared by the sign-in, sign-up and account setup screens: a brand
// panel beside the form on desktop, the form alone on smaller screens.
const AuthLayout = ({ title, description, children }) => (
  <div className="min-h-screen lg:grid lg:grid-cols-2">
    <aside className="hidden bg-brand-900 p-12 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between">
      <Link to="/" className="self-start rounded-lg">
        <BrandLockup />
      </Link>
      <div className="max-w-md">
        <p className="font-display text-3xl font-bold leading-tight tracking-tight">{brand.tagline}</p>
        <ul className="mt-10 flex flex-col gap-5">
          {BENEFITS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-brand-100">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-800">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-brand-200">{brand.operator}</p>
    </aside>

    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
        <Link to="/" className="min-w-0 rounded-lg text-gray-900 dark:text-gray-50 lg:hidden">
          <BrandLockup />
        </Link>
        <ThemeToggle className="ml-auto btn-ghost" />
      </div>
      <main className="flex flex-1 items-center justify-center px-4 pb-12 pt-4 sm:px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">{title}</h1>
          {description && <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  </div>
);

export default AuthLayout;

// Password field with a keyboard-reachable show or hide control.
export const PasswordInput = ({ invalid = false, ...rest }) => {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? LuEyeOff : LuEye;
  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        aria-invalid={invalid}
        className={`input pr-11 ${invalid ? INVALID : ''}`}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-gray-500 hover:text-gray-800 focus-visible:-outline-offset-2 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};

// Plain text field that turns red when its Field shows an error.
export const TextInput = ({ invalid = false, ...rest }) => (
  <input aria-invalid={invalid} className={`input ${invalid ? INVALID : ''}`} {...rest} />
);

// A failure that belongs to the whole form, not to one field.
export const FormAlert = ({ children }) => (
  <div
    role="alert"
    className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/30 dark:text-red-300"
  >
    <LuCircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
    <span>{children}</span>
  </div>
);

// Google sign-in is a full-page redirect, so this is a plain button. The text
// after the divider introduces the email form that follows it.
export const GoogleOption = ({ onClick, dividerText }) => (
  <>
    <Button variant="secondary" className="w-full" onClick={onClick}>Continue with Google</Button>
    <div className="my-6 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
      <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      {dividerText}
      <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
    </div>
  </>
);
