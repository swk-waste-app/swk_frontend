// Shimmering placeholder blocks shown while real data loads.
export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-800 ${className}`} />
);

export const SkeletonStatCard = () => (
  <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border-l-4 border-gray-200 dark:border-gray-700">
    <Skeleton className="h-3 w-16 mb-3" />
    <Skeleton className="h-8 w-12 mb-2" />
    <Skeleton className="h-3 w-20" />
  </div>
);

export const SkeletonTile = () => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden">
    <Skeleton className="h-44 w-full rounded-none" />
    <div className="p-6 space-y-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);
