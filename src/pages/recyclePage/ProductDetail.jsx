import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LuArrowLeft, LuPackage, LuStore } from 'react-icons/lu';
import { Skeleton } from '../../components/Skeleton';
import { Badge, Button, Card, EmptyState, PageHeader } from '../../components/ui';
import { formatDate, formatMoney } from '../../lib/format';
import { apiGetSingleProduct } from '../../services/product';
import { ROUTES, inStock, useLoader } from './listingOptions';
import { LoadError, ProductImage } from './listingParts';

const LARGE = 'w_1000,q_auto,f_auto';
const sectionTitle = 'text-lg font-semibold text-gray-900 dark:text-gray-50';
const bodyText = 'whitespace-pre-line text-sm leading-relaxed text-gray-700 dark:text-gray-300';

const Facts = ({ items, className = 'grid-cols-2' }) => {
  const shown = items.filter(([, value]) => value);
  if (shown.length === 0) return null;
  return (
    <dl className={`grid gap-x-6 gap-y-4 text-sm ${className}`}>
      {shown.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="eyebrow">{label}</dt>
          <dd className="mt-1 break-words text-gray-900 dark:text-gray-100">{value}</dd>
        </div>
      ))}
    </dl>
  );
};

const DetailSkeleton = () => (
  <div aria-hidden="true">
    <Skeleton className="mb-6 h-8 w-2/3 max-w-md" />
    <div className="grid gap-6 lg:grid-cols-2">
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      <div className="grid content-start gap-4">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-5 w-48 rounded-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    </div>
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const load = useCallback(() => apiGetSingleProduct(id).then((res) => res.data), [id]);
  const { status, data: product, reload } = useLoader(load);

  const vendor = product?.user;
  const available = inStock(product);
  const materials = product?.materialsUsed || [];
  const hasMakingOf = product && (product.upcyclingStory || materials.length > 0 || product.wasteSourced || product.processDescription || product.timeToMake);

  return (
    <div className="page">
      <Button as={Link} to={ROUTES.marketplace} variant="ghost" size="sm" icon={LuArrowLeft} className="-ml-3 mb-4">Marketplace</Button>

      {status === 'loading' && <DetailSkeleton />}

      {status === 'error' && <LoadError title="This listing could not be loaded" onRetry={reload} />}

      {status === 'ready' && !product && (
        <Card>
          <EmptyState
            icon={LuPackage}
            title="Listing not found"
            description="It may have been removed by the vendor."
            action={<Button as={Link} to={ROUTES.marketplace} variant="secondary">Browse the marketplace</Button>}
          />
        </Card>
      )}

      {status === 'ready' && product && (
        <div className="grid gap-6">
          <div>
            <PageHeader eyebrow={product.category} title={product.title} />
            <div className="grid gap-6 lg:grid-cols-2">
              <ProductImage
                image={product.image}
                alt={product.title}
                wasteType={product.wasteType}
                transform={LARGE}
                className="aspect-[4/3] w-full rounded-xl border border-gray-200 dark:border-gray-800"
                iconClassName="h-16 w-16"
              />

              <div className="grid content-start gap-5">
                <div>
                  <p className="text-3xl font-semibold tabular-nums tracking-tight text-gray-900 dark:text-gray-50">{formatMoney(product.price)}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {product.isUpcycled && <Badge tone="brand">Upcycled</Badge>}
                    <Badge tone={available ? 'neutral' : 'danger'}>{available ? 'In stock' : 'Out of stock'}</Badge>
                    {available && <span className="text-sm tabular-nums text-gray-600 dark:text-gray-400">{product.inventory} available</span>}
                  </div>
                </div>

                <p className={bodyText}>{product.description || 'The vendor has not added a description.'}</p>

                <Facts
                  className="grid-cols-2 border-y border-gray-200 py-4 dark:border-gray-800"
                  items={[
                    ['Condition', product.condition],
                    ['Material', product.wasteType],
                    ['Location', product.location],
                    ['Listed', formatDate(product.createdAt)],
                  ]}
                />

                {vendor && (
                  <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                        <LuStore className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Sold by</p>
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{vendor.name}</p>
                        {vendor.location && <p className="truncate text-xs text-gray-500 dark:text-gray-400">{vendor.location}</p>}
                      </div>
                    </div>
                    <Button as={Link} to={ROUTES.store(vendor.id)} variant="secondary" size="sm">View store</Button>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {(product.beforeImage || product.afterImage) && (
            <Card as="section" className="p-5">
              <h2 className={sectionTitle}>Before and after</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {[['Before', product.beforeImage], ['After', product.afterImage]].map(([label, image]) => image && (
                  <figure key={label}>
                    <ProductImage image={image} alt={`${label} upcycling`} className="aspect-[4/3] w-full rounded-lg" />
                    <figcaption className="eyebrow mt-2">{label}</figcaption>
                  </figure>
                ))}
              </div>
            </Card>
          )}

          {hasMakingOf && (
            <Card as="section" className="grid gap-4 p-5">
              <h2 className={sectionTitle}>How it was made</h2>
              {product.upcyclingStory && <p className={bodyText}>{product.upcyclingStory}</p>}
              {materials.length > 0 && (
                <div>
                  <p className="eyebrow">Materials</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {materials.map((material, i) => <li key={`${material}-${i}`}><Badge>{material}</Badge></li>)}
                  </ul>
                </div>
              )}
              <Facts
                className="sm:grid-cols-3"
                items={[
                  ['Material source', product.wasteSourced],
                  ['Process', product.processDescription],
                  ['Time to make', product.timeToMake],
                ]}
              />
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
