import { PageHeader } from '../../components/ui';
import { apiAddProducts } from '../../services/product';
import ListingForm from './ListingForm';

const ProductForm = () => (
  <div className="page">
    <PageHeader title="Add listing" description="Describe the item, set a price and add a photo." />
    <ListingForm save={apiAddProducts} submitLabel="Add listing" successMessage="Listing added" />
  </div>
);

export default ProductForm;
