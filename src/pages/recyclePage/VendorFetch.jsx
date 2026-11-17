import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { LuPlus, LuStore } from 'react-icons/lu';
import { Skeleton } from '../../components/Skeleton';
import { Button, Card, EmptyState, PageHeader } from '../../components/ui';
import { apiGetProfile, apiGetVendorsProducts } from '../../services/product';
import VendorApiGet from './VendorApi';
import { ROUTES, plural, useLoader } from './listingOptions';
import { LoadError } from './listingParts';

const VendorView = () => {
  // The profile is only needed for the "View store" link, so the page still
  // works when that call fails.
  const load = useCallback(async () => {
    const [products, profile] = await Promise.all([apiGetVendorsProducts(), apiGetProfile().catch(() => null)]);
    return { products: Array.isArray(products.data) ? products.data : [], vendorId: profile?.data?.id };
  }, []);
  const { status, data, reload, setData } = useLoader(load);

  const products = data?.products || [];
  const removeListing = (id) => setData((current) => ({ ...current, products: current.products.filter((p) => p.id !== id) }));

  return (
    <div className="page">
      <PageHeader
        title="My listings"
        description={status === 'ready' ? `${plural(products.length, 'listing')} on the marketplace.` : 'The products you sell on the marketplace.'}
        actions={(
          <>
            {data?.vendorId && <Button as={Link} to={ROUTES.store(data.vendorId)} variant="secondary" icon={LuStore}>View store</Button>}
            <Button as={Link} to={ROUTES.addListing} icon={LuPlus}>Add listing</Button>
          </>
        )}
      />

      {status === 'loading' && (
        <Card className="grid gap-4 p-5" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
              <div className="grid flex-1 gap-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-7 w-20" />
            </div>
          ))}
        </Card>
      )}

      {status === 'error' && <LoadError title="Your listings could not be loaded" onRetry={reload} />}

      {status === 'ready' && products.length === 0 && (
        <Card>
          <EmptyState
            icon={LuStore}
            title="No listings yet"
            description="Add your first listing to start selling on the marketplace."
            action={<Button as={Link} to={ROUTES.addListing} icon={LuPlus}>Add listing</Button>}
          />
        </Card>
      )}

      {status === 'ready' && products.length > 0 && (
        <Card className="overflow-hidden">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Listing</th>
                  <th className="hidden text-right sm:table-cell">Price</th>
                  <th className="hidden text-right sm:table-cell">Stock</th>
                  <th className="hidden text-right lg:table-cell">Views</th>
                  <th className="hidden text-right lg:table-cell">Sold</th>
                  <th className="hidden sm:table-cell">Status</th>
                  <th><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => <VendorApiGet key={product.id} product={product} onDelete={removeListing} />)}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VendorView;
