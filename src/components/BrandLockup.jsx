import { BrandLogo } from './ui';
import { brand } from '../config/brand';

// Logo and product name side by side, for the app shell and the auth screens.
// It is not a link and it inherits its text colour, so it can sit on the dark
// brand panel as well as on neutral surfaces. The logo sits on a white tile so
// any operator's artwork stays legible on dark surfaces, and is hidden from
// screen readers because the name is written out next to it.
const BrandLockup = ({ className = '' }) => (
  <span className={`flex min-w-0 items-center gap-2.5 ${className}`}>
    <span className="flex h-9 shrink-0 items-center rounded-lg bg-white p-0.5" aria-hidden="true">
      <BrandLogo className="h-8 w-auto max-w-[6rem]" />
    </span>
    <span className="truncate text-base font-semibold">{brand.name}</span>
  </span>
);

export default BrandLockup;
