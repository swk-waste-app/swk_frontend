import React, { useEffect, useState } from 'react';
import { apiGetVendorsProducts } from '../../services/product';
import VendorApiGet from "../recyclePage/VendorApi";
import Swal from 'sweetalert2';

const VendorView = () => {
  const [Adverts, setAdverts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiGetVendorsProducts();
      if (response.data && Array.isArray(response.data)) {
        setAdverts(response.data);
      } else {
        setAdverts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to fetch products' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
          <p className="text-gray-500 text-sm mt-1">{Adverts.length} products listed</p>
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
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="font-medium text-gray-500">No products available</p>
          <p className="text-sm mt-1">Add your first product to get started!</p>
        </div>
      )}
    </div>
  );
};

export default VendorView;