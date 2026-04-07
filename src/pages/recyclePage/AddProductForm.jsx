import { Link, useNavigate } from "react-router-dom";
import { apiAddProducts } from "../../services/product";
import Swal from "sweetalert2";

const ProductForm = () => {
  const navigate = useNavigate();

  const saveProduct = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    try {
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      const response = await apiAddProducts(formData);
      console.log('Product saved:', response.data);
      Swal.fire({
        icon: 'success',
        title: 'Product Added',
        text: 'Your product has been added successfully!',
      });
      navigate("/customerDashboard/vendorProduct");
    } catch (error) {
      console.error('Error saving Product:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to save product: ${error.message || 'An unexpected error occurred.'}`,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 overflow-hidden">
      <div className="max-w-md mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Add Product
        </h2>
        <form onSubmit={saveProduct}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-500 text-gray-700"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-500 text-gray-700"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="image">
              Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-500 text-gray-700"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="price">
              Price (GH₵)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-500 text-gray-700"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-500 text-gray-700"
            >
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

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="inventory">
              Inventory
            </label>
            <input
              type="number"
              id="inventory"
              name="inventory"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-500 text-gray-700"
            />
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 block"
            >
              Submit Product
            </button>
            <Link
              to="/customerDashboard/vendorProduct"
              className="w-full bg-transparent text-green-600 font-bold py-2 px-4 rounded-lg border border-green-600 hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 block text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;