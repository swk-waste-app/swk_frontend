import { brand } from '../config/brand';

// All money, number and date formatting goes through here so a deployment in
// another country only changes its locale and currency in the brand config.

const money = new Intl.NumberFormat(brand.locale, { style: 'currency', currency: brand.currency, maximumFractionDigits: 2 });
const moneyWhole = new Intl.NumberFormat(brand.locale, { style: 'currency', currency: brand.currency, maximumFractionDigits: 0 });
const dateShort = new Intl.DateTimeFormat(brand.locale, { day: 'numeric', month: 'short', year: 'numeric' });
const dateTime = new Intl.DateTimeFormat(brand.locale, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const dayMonth = new Intl.DateTimeFormat(brand.locale, { weekday: 'short', day: 'numeric', month: 'short' });

const toDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatMoney = (amount, { whole = false } = {}) =>
  (whole ? moneyWhole : money).format(Number(amount) || 0);

export const formatNumber = (value, maximumFractionDigits = 0) =>
  new Intl.NumberFormat(brand.locale, { maximumFractionDigits }).format(Number(value) || 0);

export const formatWeight = (kg) => `${formatNumber(kg, 1)} kg`;

export const formatDate = (value) => { const d = toDate(value); return d ? dateShort.format(d) : ''; };
export const formatDateTime = (value) => { const d = toDate(value); return d ? dateTime.format(d) : ''; };
export const formatDay = (value) => { const d = toDate(value); return d ? dayMonth.format(d) : ''; };

export const timeAgo = (value) => {
  const d = toDate(value);
  if (!d) return '';
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(d);
};

// URL of an image stored in the deployment's Cloudinary cloud.
export const mediaUrl = (publicId, transform = 'w_600,q_auto,f_auto') =>
  publicId ? `https://res.cloudinary.com/${brand.cloudinaryCloud}/image/upload/${transform}/${publicId}` : '';
