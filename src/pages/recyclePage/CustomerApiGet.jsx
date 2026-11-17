import { Link } from 'react-router-dom';
import { Skeleton } from '../../components/Skeleton';
import { Badge } from '../../components/ui';
import { formatMoney } from '../../lib/format';
import { ROUTES, inStock } from './listingOptions';
import { ProductImage } from './listingParts';

const GRID = 'grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] sm:gap-4';

// One listing in the marketplace or on a vendor's store. The title link is
// stretched over the whole card; the vendor link sits above it.
const ProductCard = ({ product, showVendor = true }) => {
  const vendor = product.user;
  const available = inStock(product);

  return (
    <article className="card relative flex flex-col overflow-hidden transition-colors hover:border-gray-300 dark:hover:border-gray-700">
      <ProductImage image={product.image} alt={product.title} wasteType={product.wasteType} className="aspect-[4/3] w-full" />
      {product.isUpcycled && <Badge tone="brand" className="absolute left-2 top-2 dark:bg-brand-900">Upcycled</Badge>}
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <Badge tone={available ? 'neutral' : 'danger'} className="w-fit">{available ? 'In stock' : 'Out of stock'}</Badge>
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
          <Link to={ROUTES.product(product.id)} className="after:absolute after:inset-0">{product.title}</Link>
        </h3>
        {showVendor && vendor?.id && vendor.name && (
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
            Sold by <Link to={ROUTES.store(vendor.id)} className="link relative z-10">{vendor.name}</Link>
          </p>
        )}
        <div className="mt-auto flex items-baseline justify-between gap-2 pt-1">
          <p className="text-base font-semibold tabular-nums text-gray-900 dark:text-gray-50">{formatMoney(product.price)}</p>
          {available && <p className="text-xs tabular-nums text-gray-500 dark:text-gray-400">{product.inventory} left</p>}
        </div>
      </div>
    </article>
  );
};

export const ProductGrid = ({ products, showVendor = true }) => (
  <div className={GRID}>
    {products.map((product) => <ProductCard key={product.id} product={product} showVendor={showVendor} />)}
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className={GRID} aria-hidden="true">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="card overflow-hidden">
        <Skeleton className="aspect-[4/3] w-full rounded-none" />
        <div className="grid gap-2.5 p-3 sm:p-4">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
    ))}
  </div>
);

export default ProductCard;
