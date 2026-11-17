import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LuPencil, LuTrash2 } from 'react-icons/lu';
import { toast } from 'sonner';
import { Badge, Button } from '../../components/ui';
import { confirmAction } from '../../components/ui/confirm';
import { formatMoney, formatNumber } from '../../lib/format';
import { apiDeleteTicket } from '../../services/product';
import { ROUTES, apiErrorMessage, inStock } from './listingOptions';
import { ProductImage } from './listingParts';

// One row of the vendor's "My listings" table. On narrow screens the price
// and stock columns are hidden and summarised under the title instead.
const VendorApiGet = ({ product, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const available = inStock(product);
  const status = <Badge tone={available ? 'neutral' : 'danger'}>{available ? 'In stock' : 'Out of stock'}</Badge>;

  const remove = async () => {
    const confirmed = await confirmAction({
      title: 'Delete this listing?',
      body: `"${product.title}" will be removed from the marketplace. This cannot be undone.`,
      confirmLabel: 'Delete listing',
      tone: 'danger',
    });
    if (!confirmed) return;

    setDeleting(true);
    try {
      await apiDeleteTicket(product.id);
      toast.success('Listing deleted');
      onDelete(product.id);
    } catch (error) {
      toast.error(apiErrorMessage(error, 'The listing was not deleted. Check your connection and try again.'));
      setDeleting(false);
    }
  };

  return (
    <tr>
      <td>
        <div className="flex items-center gap-3">
          <ProductImage image={product.image} wasteType={product.wasteType} transform="w_120,q_auto,f_auto" className="h-10 w-10 rounded-lg" iconClassName="h-4 w-4" />
          <div className="min-w-0">
            <Link to={ROUTES.product(product.id)} className="line-clamp-2 font-medium text-gray-900 hover:underline dark:text-gray-100">{product.title}</Link>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {product.category || 'Other'}{product.isUpcycled ? ', upcycled' : ''}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs tabular-nums sm:hidden">
              <span className="font-medium text-gray-900 dark:text-gray-100">{formatMoney(product.price)}</span>
              {available ? <span className="text-gray-500 dark:text-gray-400">{formatNumber(product.inventory)} in stock</span> : status}
            </div>
          </div>
        </div>
      </td>
      <td className="hidden whitespace-nowrap text-right tabular-nums sm:table-cell">{formatMoney(product.price)}</td>
      <td className="hidden text-right tabular-nums sm:table-cell">{formatNumber(product.inventory)}</td>
      <td className="hidden text-right tabular-nums lg:table-cell">{formatNumber(product.views)}</td>
      <td className="hidden text-right tabular-nums lg:table-cell">{formatNumber(product.sold)}</td>
      <td className="hidden sm:table-cell">{status}</td>
      <td>
        <div className="flex justify-end gap-1.5">
          <Button as={Link} to={ROUTES.editListing(product.id)} variant="secondary" size="sm" icon={LuPencil} aria-label={`Edit ${product.title}`}>
            <span className="hidden md:inline">Edit</span>
          </Button>
          <Button variant="ghost" size="sm" icon={LuTrash2} loading={deleting} onClick={remove} aria-label={`Delete ${product.title}`}>
            <span className="hidden md:inline">Delete</span>
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default VendorApiGet;
