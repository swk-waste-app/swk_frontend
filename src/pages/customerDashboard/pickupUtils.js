import { brand } from '../../config/brand';
import { formatWeight } from '../../lib/format';

// Values and helpers shared by the household pickup screens.

export const PICKUPS_PATH = '/customerDashboard/pickup';
export const SCHEDULE_PATH = '/customerDashboard/wpickup';

// The waste types the server accepts, in the order they are offered.
export const WASTE_TYPES = [
  'General Waste',
  'Recyclable Materials',
  'Organic/Food Waste',
  'Electronic (E-Waste)',
  'Hazardous Waste',
  'Fashion & Textiles',
  'Plastics',
  'Metals & Scrap',
  'Glass',
  'Wood & Furniture',
  'Paper & Cardboard',
  'Rubber',
  'Other',
];

export const PICKUP_STATUSES = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];

// The server awards this many points for each kg collected.
export const POINTS_PER_KG = 10;
export const pointsFor = (kg) => Math.round((Number(kg) || 0) * POINTS_PER_KG);

// The level ladder. The server assigns levels with the same thresholds.
export const LEVELS = [
  { name: 'Beginner', min: 0 },
  { name: 'Recycler', min: 100 },
  { name: 'Eco Warrior', min: 300 },
  { name: 'Green Champion', min: 600 },
  { name: 'Earth Guardian', min: 1000 },
];

// Where a points total sits on the ladder and how far it is to the next level.
export const levelProgress = (points) => {
  const total = Number(points) || 0;
  const index = LEVELS.reduce((found, level, i) => (total >= level.min ? i : found), 0);
  const current = LEVELS[index];
  const next = LEVELS[index + 1] || null;
  if (!next) return { current, next, percent: 100, remaining: 0 };
  return {
    current,
    next,
    percent: Math.round(((total - current.min) / (next.min - current.min)) * 100),
    remaining: next.min - total,
  };
};

const BADGE_NAMES = {
  first_pickup: 'First pickup',
  five_pickups: '5 pickups',
  ten_pickups: '10 pickups',
  eco_seller: 'Eco seller',
  carbon_saver: 'Carbon saver',
};

export const badgeName = (id) => {
  if (BADGE_NAMES[id]) return BADGE_NAMES[id];
  const words = String(id).replace(/_/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
};

export const pickupId = (pickup) => pickup?._id || pickup?.id;
export const pickupPath = (pickup) => `/customerDashboard/schedule/${pickupId(pickup)}`;
export const editPickupPath = (pickup) => `/customerDashboard/editSchedule/${pickupId(pickup)}`;

// The weight to show for a pickup: the collected weight once there is one,
// otherwise the household's estimate. Empty when neither was given.
export const weightLabel = (pickup) => {
  if (pickup?.actualWeight > 0) return formatWeight(pickup.actualWeight);
  if (pickup?.estimatedWeight > 0) return `${formatWeight(pickup.estimatedWeight)} estimated`;
  return '';
};

// The pickup a household should be looking at: one under way, else the
// soonest one still to come, else the most recent one that is still open.
export const nextPickup = (pickups) => {
  const open = pickups
    .filter((pickup) => pickup.status === 'Scheduled' || pickup.status === 'In Progress')
    .sort((a, b) => new Date(a.pickupDate) - new Date(b.pickupDate));
  const now = Date.now();
  return (
    open.find((pickup) => pickup.status === 'In Progress')
    || open.find((pickup) => new Date(pickup.pickupDate).getTime() >= now)
    || open[open.length - 1]
    || null
  );
};

// Pickups booked in each of the last `months` calendar months, oldest first.
export const monthlyCounts = (pickups, months = 6) => {
  const monthName = new Intl.DateTimeFormat(brand.locale, { month: 'short' });
  const now = new Date();
  const buckets = Array.from({ length: months }, (_, i) => {
    const start = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
    return { key: `${start.getFullYear()}-${start.getMonth()}`, month: monthName.format(start), pickups: 0 };
  });
  pickups.forEach((pickup) => {
    const booked = new Date(pickup.createdAt);
    const bucket = buckets.find((b) => b.key === `${booked.getFullYear()}-${booked.getMonth()}`);
    if (bucket) bucket.pickups += 1;
  });
  return buckets;
};

// A Date as the value a datetime-local input expects, in local time.
export const toLocalInput = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// What to tell the user when a request fails. Server messages are written for
// developers, so the screen supplies its own wording as `fallback`.
export const errorMessage = (error, fallback) => {
  if (!error?.response) return 'No connection to the server. Check your internet and try again.';
  if (error.response.status === 401) return 'Your session has expired. Sign in again to continue.';
  if (error.response.status === 403) return 'Your account is not allowed to do that.';
  return fallback;
};
