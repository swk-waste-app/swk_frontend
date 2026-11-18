// Everything that identifies the company running this deployment lives here.
// To run the product for another operator, set the VITE_BRAND_* variables at
// build time (see WHITE_LABEL.md); nothing else in the source needs to change.
//
// This file is plain JavaScript with no imports so that both the build
// (vite.config.js) and the app (src/config/brand.js) can read it.

export const defaults = {
  // Product name shown to users.
  name: 'Taka Kipawa',
  // Company that operates this deployment.
  operator: 'SWK Ghana',
  tagline: 'Scheduled waste collection, rewards for recycling and a marketplace for upcycled goods.',
  country: 'Ghana',
  // BCP 47 locale and ISO 4217 currency used for all number, date and money formatting.
  locale: 'en-GH',
  currency: 'GHS',
  supportEmail: 'info@swkghana.org',
  siteUrl: 'https://takakipawa.swkghana.org',
  // Primary brand colour as a hex value. Empty keeps the built-in palette.
  primaryColor: '',
  // Absolute URL of a logo image. Empty uses the bundled logo.
  logoUrl: '',
  // Cloudinary cloud that stores product and article images.
  cloudinaryCloud: 'dwgj3lovn',
};

export const resolveBrand = (env = {}) => ({
  name: env.VITE_BRAND_NAME || defaults.name,
  operator: env.VITE_BRAND_OPERATOR || defaults.operator,
  tagline: env.VITE_BRAND_TAGLINE || defaults.tagline,
  country: env.VITE_BRAND_COUNTRY || defaults.country,
  locale: env.VITE_BRAND_LOCALE || defaults.locale,
  currency: env.VITE_BRAND_CURRENCY || defaults.currency,
  supportEmail: env.VITE_BRAND_SUPPORT_EMAIL || defaults.supportEmail,
  siteUrl: env.VITE_BRAND_SITE_URL || defaults.siteUrl,
  primaryColor: env.VITE_BRAND_COLOR || defaults.primaryColor,
  logoUrl: env.VITE_BRAND_LOGO_URL || defaults.logoUrl,
  cloudinaryCloud: env.VITE_CLOUDINARY_CLOUD || defaults.cloudinaryCloud,
});
