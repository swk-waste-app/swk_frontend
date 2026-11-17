import { brand } from '../config/brand';
import { BrandLogo } from './ui';

// Logo and product name side by side. It is not a link and takes its text
// colour from the parent, so wrap it: <Link to="/"><BrandMark /></Link>.
// The logo sits on a white tile so a logo drawn for light backgrounds stays
// legible on dark and brand-coloured surfaces.
const BrandMark = ({ className = '' }) => (
  <span className={`inline-flex min-w-0 items-center gap-2.5 ${className}`}>
    <span className="shrink-0 rounded-lg bg-white" aria-hidden="true">
      <BrandLogo className="h-10 w-auto" />
    </span>
    <span className="truncate font-display text-base font-bold tracking-tight">{brand.name}</span>
  </span>
);

export default BrandMark;
