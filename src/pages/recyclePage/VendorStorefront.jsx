import { useCallback, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LuArrowLeft, LuMapPin, LuPackage, LuSearch, LuShoppingBag, LuStore } from 'react-icons/lu';
import { Skeleton } from '../../components/Skeleton';
import { Button, Card, EmptyState, PageHeader, StatCard } from '../../components/ui';
import { formatNumber } from '../../lib/format';
import { apiGetVendorProducts, apiGetVendorProfile } from '../../services/product';
import { ProductGrid, ProductGridSkeleton } from './CustomerApiGet';
import ListingFilters from './ListingFilters';
import { EMPTY_FILTERS, ROUTES, filterListings, useLoader } from './listingOptions';
import { LoadError } from './listingParts';

const VendorStorefront = () => {
  const { vendorId } = useParams();
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  // Resolves to null when the vendor does not exist.
  const load = useCallback(async () => {
    try {
      const [vendor, products] = await Promise.all([apiGetVendorProfile(vendorId), apiGetVendorProducts(vendorId)]);
      return { vendor: vendor.data, products: Array.isArray(products.data) ? products.data : [] };
    } catch (error) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  }, [vendorId]);
  const { status, data, reload } = useLoader(load);

  const matches = useMemo(() => filterListings(data?.products || [], filters), [data, filters]);

  return (
    <div className="page">
      <Button as={Link} to={ROUTES.marketplace} variant="ghost" size="sm" icon={LuArrowLeft} className="-ml-3 mb-4">Marketplace</Button>

      {status === 'loading' && (
        <div aria-hidden="true">
          <Skeleton className="mb-2 h-8 w-56" />
          <Skeleton className="mb-6 h-4 w-32" />
          <ProductGridSkeleton count={4} />
        </div>
      )}

      {status === 'error' && <LoadError title="This store could not be loaded" onRetry={reload} />}

      {status === 'ready' && !data && (
        <Card>
          <EmptyState
            icon={LuStore}
            title="Vendor not found"
            description="This store may have been closed."
            action={<Button as={Link} to={ROUTES.marketplace} variant="secondary">Browse the marketplace</Button>}
          />
        </Card>
      )}

      {status === 'ready' && data && (
        <>
          <PageHeader
            eyebrow="Vendor"
            title={data.vendor.name}
            description={data.vendor.location && (
              <span className="inline-flex items-center gap-1.5">
                <LuMapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                {data.vendor.location}
              </span>
            )}
          />

          <div className="mb-6 grid grid-cols-2 gap-4 sm:max-w-md">
            <StatCard label="Listings" value={formatNumber(data.vendor.totalProducts)} icon={LuPackage} />
            <StatCard label="Items sold" value={formatNumber(data.vendor.totalSold)} icon={LuShoppingBag} />
          </div>

          {data.products.length === 0 ? (
            <Card>
              <EmptyState icon={LuPackage} title="No listings yet" description="This vendor has not listed any products." />
            </Card>
          ) : (
            <>
              <ListingFilters compact filters={filters} onChange={setFilters} onClear={() => setFilters(EMPTY_FILTERS)} />
              {matches.length > 0 ? (
                <ProductGrid products={matches} showVendor={false} />
              ) : (
                <Card>
                  <EmptyState
                    icon={LuSearch}
                    title="No listings match these filters"
                    description="Try a different search."
                    action={<Button variant="secondary" onClick={() => setFilters(EMPTY_FILTERS)}>Clear filters</Button>}
                  />
                </Card>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default VendorStorefront;
