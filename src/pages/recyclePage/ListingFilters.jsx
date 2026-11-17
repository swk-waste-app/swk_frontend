import { LuSearch, LuX } from 'react-icons/lu';
import { Button, Card } from '../../components/ui';
import { brand } from '../../config/brand';
import { CATEGORIES, SORT_OPTIONS, hasActiveFilters } from './listingOptions';
import { Switch } from './listingParts';

const chip = (active) =>
  `shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${active
    ? 'border-brand-700 bg-brand-700 text-white dark:border-brand-500 dark:bg-brand-500 dark:text-gray-950'
    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'}`;

// Search, sort and filter controls for a list of listings. `onChange` receives
// an updater function, like a state setter. `compact` leaves out the category
// and price filters (used on a single vendor's store).
const ListingFilters = ({ filters, onChange, onClear, compact = false }) => {
  const set = (patch) => onChange((current) => ({ ...current, ...patch }));

  return (
    <Card className="mb-6 grid gap-4 p-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <LuSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" aria-hidden="true" />
          <input
            type="search"
            className="input pl-9"
            placeholder="Search listings"
            aria-label="Search listings"
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
          />
        </div>
        <select className="input sm:w-52" aria-label="Sort listings" value={filters.sort} onChange={(e) => set({ sort: e.target.value })}>
          {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>

      {!compact && (
        <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Category">
          {['', ...CATEGORIES].map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={filters.category === category}
              className={chip(filters.category === category)}
              onClick={() => set({ category })}
            >
              {category || 'All'}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {!compact && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Price ({brand.currency})</span>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              className="input w-20 px-2.5 py-2"
              placeholder="Min"
              aria-label="Minimum price"
              value={filters.minPrice}
              onChange={(e) => set({ minPrice: e.target.value })}
            />
            <span>to</span>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              className="input w-20 px-2.5 py-2"
              placeholder="Max"
              aria-label="Maximum price"
              value={filters.maxPrice}
              onChange={(e) => set({ maxPrice: e.target.value })}
            />
          </div>
        )}
        <Switch label="Upcycled only" checked={filters.upcycledOnly} onChange={(upcycledOnly) => set({ upcycledOnly })} />
        {hasActiveFilters(filters) && (
          <Button variant="ghost" size="sm" icon={LuX} className="ml-auto" onClick={onClear}>Clear filters</Button>
        )}
      </div>
    </Card>
  );
};

export default ListingFilters;
