import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGetVendorsProducts, apiGetProfile } from '../../services/product';
import VendorApiGet from '../recyclePage/VendorApi';
import { FaPlus, FaStore } from 'react-icons/fa';
import Swal from 'sweetalert2';

const VendorView = () => {
  const [Adverts, setAdverts] = useState([]);
  const handleDelete = (deletedId) => setAdverts(prev => prev.filter(a => a.id !== deletedId));
  const [vendorId, setVendorId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [productsRes, profileRes] = await Promise.all([
          apiGetVendorsProducts(),
          apiGetProfile()
        ]);
        setAdverts(Array.isArray(productsRes.data) ? productsRes.data : []);
        setVendorId(profileRes.data?.id);
      } catch {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to fetch products' });
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
          <p className="text-gray-500 text-sm mt-1">{Adverts.length} products listed</p>
        </div>
        <div className="flex items-center gap-3">
          {vendorId && (
            <Link
              to={`/customerDashboard/store/${vendorId}`}
              className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-colors text-sm font-medium">
              <FaStore size={13} /> Preview Store
            </Link>
          )}
          <Link
            to="/customerDashboard/addProduct"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium">
            <FaPlus size={13} /> Add Product
          </Link>
        </div>
      </div>

      {Adverts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Adverts.map((advert) => (
            <VendorApiGet
              key={advert.id}
              id={advert.id}
              title={advert.title}
              description={advert.description}
              category={advert.category}
              image={advert.image}
              price={advert.price}
              isUpcycled={advert.isUpcycled}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <FaStore className="text-5xl mx-auto mb-3 opacity-20" />
          <p className="font-medium text-gray-500">No products yet</p>
          <p className="text-sm mt-1">Add your first product to get started!</p>
          <Link to="/customerDashboard/addProduct"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium">
            <FaPlus size={12} /> Add Product
          </Link>
        </div>
      )}
    </div>
  );
};

export default VendorView;
