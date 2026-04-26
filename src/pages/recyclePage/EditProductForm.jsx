import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiEditRecycledProduct, apiGetSingleProduct } from '../../services/product';
import Swal from 'sweetalert2';

const EditProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    inventory: '',
    image: null
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiGetSingleProduct(id);
        const productData = response.data;
        setProduct({
          title: productData.title,
          description: productData.description,
          price: productData.price,
          category: productData.category,
          inventory: productData.inventory,
          image: null
        });
      } catch {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to fetch product details' });
        navigate('/customerDashboard/vendorProduct');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setProduct(prev => ({ ...prev, image: files[0] }));
    } else {
      setProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(product).forEach(key => {
        if (product[key] !== null) formData.append(key, product[key]);
      });
      await apiEditRecycledProduct(id, formData);
      Swal.fire({ icon: 'success', title: 'Product Updated', text: 'Your product has been updated successfully!' });
      navigate("/customerDashboard/vendorProduct");
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Failed to update product' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 overflow-hidden">
      <div className="max-w-md mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Title</label>
            <input type="text" name="title" value={product.title} onChange={handleChange} required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-500 text-gray-700" />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Description</label>
            <textarea name="description" value={product.description} onChange={handleChange} required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-500 text-gray-700" />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">New Image (Optional)</label>
            <input type="file" name="image" onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-500 text-gray-700" />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Price (GH₵)</label>
            <input type="number" name="price" value={product.price} onChange={handleChange} required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-500 text-gray-700" />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Category</label>
            <select name="category" value={product.category} onChange={handleChange} required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-500 text-gray-700">
              <option value="">Select a category</option>
              <option value="Bottles">Bottles</option>
              <option value="Papers">Papers</option>
              <option value="Organic Fertilizer">Organic Fertilizers</option>
              <option value="Fashion & Textiles">Fashion & Textiles</option>
              <option value="Electronics">Electronics</option>
              <option value="Metals">Metals</option>
              <option value="Plastics">Plastics</option>
              <option value="Glass">Glass</option>
              <option value="Wood">Wood</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Inventory</label>
            <input type="number" name="inventory" value={product.inventory} onChange={handleChange} required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-500 text-gray-700" />
          </div>
          <div className="space-y-4">
            <button type="submit" disabled={loading}
              className={`w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 block transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loading ? 'Updating...' : 'Update Product'}
            </button>
            <Link to="/customerDashboard/vendorProduct"
              className="w-full bg-transparent text-green-600 font-bold py-2 px-4 rounded-lg border border-green-600 hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 block text-center transition-colors duration-200">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;