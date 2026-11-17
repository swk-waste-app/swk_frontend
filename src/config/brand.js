import { resolveBrand } from '../../brand.defaults.js';
import bundledLogo from '../assets/images/SWK_LOGO__5_.png';

// The identity of the company running this deployment. Read it from here
// instead of writing a company, country or currency into a component.
const resolved = resolveBrand(import.meta.env);

export const brand = {
  ...resolved,
  logo: resolved.logoUrl || bundledLogo,
};
