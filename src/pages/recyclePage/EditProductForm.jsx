import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LuPackage } from 'react-icons/lu';
import { Skeleton } from '../../components/Skeleton';
import { Button, Card, EmptyState, PageHeader } from '../../components/ui';
import { apiEditRecycledProduct, apiGetSingleProduct } from '../../services/product';
import ListingForm from './ListingForm';
import { ROUTES, useLoader } from './listingOptions';
import { LoadError } from './listingParts';

const EditProductForm = () => {
  const { id } = useParams();
  const load = useCallback(() => apiGetSingleProduct(id).then((res) => res.data), [id]);
  const { status, data: product, reload } = useLoader(load);

  return (
    <div className="page">
      <PageHeader title="Edit listing" description={product?.title || 'Update the details, price, stock or photo.'} />

      {status === 'loading' && (
        <div className="grid max-w-3xl gap-6" aria-hidden="true">
          {['h-56', 'h-20', 'h-24'].map((height) => (
            <Card key={height} className="grid gap-4 p-5">
              <Skeleton className="h-5 w-32" />
              <Skeleton className={height} />
            </Card>
          ))}
        </div>
      )}

      {status === 'error' && <LoadError title="This listing could not be loaded" onRetry={reload} />}

      {status === 'ready' && !product && (
        <Card>
          <EmptyState
            icon={LuPackage}
            title="Listing not found"
            description="It may already have been deleted."
            action={<Button as={Link} to={ROUTES.listings} variant="secondary">Back to my listings</Button>}
          />
        </Card>
      )}

      {status === 'ready' && product && (
        <ListingForm
          key={product.id}
          product={product}
          save={(formData) => apiEditRecycledProduct(id, formData)}
          submitLabel="Save changes"
          successMessage="Listing updated"
        />
      )}
    </div>
  );
};

export default EditProductForm;
