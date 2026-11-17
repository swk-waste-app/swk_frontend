// Placeholder blocks shaped like the content they stand in for while it loads.
export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-800 ${className}`} aria-hidden="true" />
);

// Same footprint as the ui StatCard.
export const SkeletonStatCard = () => (
  <div className="card p-5">
    <Skeleton className="h-3 w-20" />
    <Skeleton className="mt-3 h-7 w-16" />
    <Skeleton className="mt-2 h-3 w-24" />
  </div>
);

// A card with an image on top: articles, listings.
export const SkeletonTile = () => (
  <div className="card overflow-hidden">
    <Skeleton className="h-44 w-full rounded-none" />
    <div className="flex flex-col gap-3 p-5">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);
