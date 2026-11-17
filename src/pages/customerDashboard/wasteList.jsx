import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LuCalendar, LuChevronRight, LuMapPin, LuRefreshCw, LuSearch, LuTruck, LuWeight, LuWifiOff } from 'react-icons/lu';
import { Button, Card, EmptyState, StatusBadge } from '../../components/ui';
import { Skeleton } from '../../components/Skeleton';
import { formatDateTime } from '../../lib/format';
import { PICKUP_STATUSES, pickupId, pickupPath, weightLabel } from './pickupUtils';

const Meta = ({ icon: Icon, children }) => (
  <span className="inline-flex min-w-0 max-w-full items-center gap-1.5">
    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    <span className="truncate">{children}</span>
  </span>
);

// One pickup as a row that opens its detail page.
export const PickupRow = ({ pickup }) => {
  const weight = weightLabel(pickup);
  return (
    <li>
      <Link
        to={pickupPath(pickup)}
        className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-gray-50 focus-visible:outline-offset-[-2px] dark:hover:bg-gray-800/50"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{pickup.wasteType || 'General Waste'}</p>
          <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            <Meta icon={LuCalendar}>{formatDateTime(pickup.pickupDate)}</Meta>
            <Meta icon={LuMapPin}>{pickup.location}</Meta>
            {weight && <Meta icon={LuWeight}>{weight}</Meta>}
          </p>
        </div>
        <StatusBadge status={pickup.status} />
        <LuChevronRight className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
      </Link>
    </li>
  );
};

export const PickupRowsSkeleton = ({ rows = 4 }) => (
  <ul className="divide-y divide-gray-100 dark:divide-gray-800" aria-hidden="true">
    {Array.from({ length: rows }, (_, i) => (
      <li key={i} className="flex items-center gap-3 px-5 py-3.5">
        <div className="flex-1">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="mt-2 h-3 w-56 max-w-full" />
        </div>
        <Skeleton className="h-5 w-20 rounded-full" />
      </li>
    ))}
  </ul>
);

export const StatCardSkeleton = () => (
  <Card className="p-5" aria-hidden="true">
    <Skeleton className="h-3 w-24" />
    <Skeleton className="mt-3 h-7 w-16" />
  </Card>
);

export const LoadError = ({ title, onRetry }) => (
  <EmptyState
    icon={LuWifiOff}
    title={title}
    description="Check your connection and try again."
    action={<Button variant="secondary" icon={LuRefreshCw} onClick={onRetry}>Try again</Button>}
  />
);

// The household's pickups with search and a status filter.
// `status` is 'loading', 'ready' or 'error'; `emptyAction` is shown when the
// household has no pickups at all.
const PickupList = ({ pickups, status, onRetry, emptyAction }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return pickups
      .filter((pickup) => filter === 'All' || pickup.status === filter)
      .filter((pickup) => !term
        || pickup.wasteType?.toLowerCase().includes(term)
        || pickup.location?.toLowerCase().includes(term))
      .sort((a, b) => new Date(b.pickupDate) - new Date(a.pickupDate));
  }, [pickups, search, filter]);

  const clearFilters = () => {
    setSearch('');
    setFilter('All');
  };

  let body;
  if (status === 'loading') {
    body = <PickupRowsSkeleton rows={5} />;
  } else if (status === 'error') {
    body = <LoadError title="Your pickups could not be loaded" onRetry={onRetry} />;
  } else if (pickups.length === 0) {
    body = (
      <EmptyState
        icon={LuTruck}
        title="No pickups yet"
        description="Schedule your first pickup and you can follow it here."
        action={emptyAction}
      />
    );
  } else if (visible.length === 0) {
    body = (
      <EmptyState
        icon={LuSearch}
        title="No pickups match"
        description="Try a different search or status."
        action={<Button variant="secondary" onClick={clearFilters}>Clear filters</Button>}
      />
    );
  } else {
    body = (
      <>
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {visible.map((pickup) => <PickupRow key={pickupId(pickup)} pickup={pickup} />)}
        </ul>
        <p className="border-t border-gray-100 px-5 py-3 text-xs tabular-nums text-gray-500 dark:border-gray-800 dark:text-gray-400">
          Showing {visible.length} of {pickups.length}
        </p>
      </>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-800 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Your pickups</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative sm:w-64">
            <LuSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" aria-hidden="true" />
            <input
              type="search"
              className="input pl-9"
              placeholder="Search waste type or location"
              aria-label="Search pickups"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input sm:w-40"
            aria-label="Filter by status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All statuses</option>
            {PICKUP_STATUSES.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
      </div>
      {body}
    </Card>
  );
};

export default PickupList;
