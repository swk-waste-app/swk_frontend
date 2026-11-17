import { useCallback, useMemo, useState } from 'react';
import { LuSearch, LuShoppingBag } from 'react-icons/lu';
import { Button, Card, EmptyState, PageHeader } from '../../components/ui';
import { apiGetProducts } from '../../services/product';
import { ProductGrid, ProductGridSkeleton } from './CustomerApiGet';
import ListingFilters from './ListingFilters';
import { EMPTY_FILTERS, filterListings, hasActiveFilters, plural, useLoader } from './listingOptions';
import { LoadError } from './listingParts';

const PAGE_SIZE = 12;

const CustomerPage = () => {
  const load = useCallback(() => apiGetProducts().then((res) => (Array.isArray(res.data) ? res.data : [])), []);
  const { status, data, reload } = useLoader(load);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const products = useMemo(() => data || [], [data]);
  const matches = useMemo(() => filterListings(products, filters), [products, filters]);
  const filtering = hasActiveFilters(filters);

  const changeFilters = (next) => {
    setFilters(next);
    setVisible(PAGE_SIZE);
  };
  const clearFilters = () => changeFilters(EMPTY_FILTERS);

  return (
    <div className="page">
      <PageHeader
        title="Marketplace"
        description="Browse products made from recovered materials."
        actions={status === 'ready' && (
          <p className="text-sm tabular-nums text-gray-500 dark:text-gray-400">
            {filtering ? `${matches.length} of ${plural(products.length, 'listing')}` : plural(products.length, 'listing')}
          </p>
        )}
      />

      <ListingFilters filters={filters} onChange={changeFilters} onClear={clearFilters} />

      {status === 'loading' && <ProductGridSkeleton />}

      {status === 'error' && <LoadError title="Listings could not be loaded" onRetry={reload} />}

      {status === 'ready' && matches.length === 0 && (
        <Card>
          {filtering ? (
            <EmptyState
              icon={LuSearch}
              title="No listings match these filters"
              description="Try a different search, category or price range."
              action={<Button variant="secondary" onClick={clearFilters}>Clear filters</Button>}
            />
          ) : (
            <EmptyState icon={LuShoppingBag} title="No listings yet" description="Products appear here as soon as a vendor lists one." />
          )}
        </Card>
      )}

      {status === 'ready' && matches.length > 0 && (
        <>
          <ProductGrid products={matches.slice(0, visible)} />
          {matches.length > visible && (
            <div className="mt-6 flex flex-col items-center gap-3">
              <p className="text-xs tabular-nums text-gray-500 dark:text-gray-400">Showing {visible} of {matches.length}</p>
              <Button variant="secondary" onClick={() => setVisible((n) => n + PAGE_SIZE)}>Show more</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerPage;
