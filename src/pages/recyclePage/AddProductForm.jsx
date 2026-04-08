import { Link, useNavigate } from "react-router-dom";
import { apiAddProducts } from "../../services/product";
import Swal from "sweetalert2";
import { useState } from "react";

const WASTE_TYPES = [
    'General Waste', 'Recyclable Materials', 'Organic/Food Waste',
    'Electronic (E-Waste)', 'Hazardous Waste', 'Fashion & Textiles',
    'Plastics', 'Metals & Scrap', 'Glass', 'Wood & Furniture',
    'Paper & Cardboard', 'Rubber', 'Other',
];

const ProductForm = () => {
    const navigate = useNavigate();
    const [isUpcycled, setIsUpcycled] = useState(false);

    const saveProduct = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.set('isUpcycled', isUpcycled);

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
                confirmButtonColor: '#026937',
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
        <div className="bg-gray-50 min-h-screen p-4">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="rounded-2xl p-6 text-white mb-6"
                    style={{ background: 'linear-gradient(135deg, #026937, #00BFA5)' }}>
                    <h2 className="text-2xl font-bold">Add Product</h2>
                    <p className="text-green-100 text-sm mt-1">List your recycled or upcycled product</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <form onSubmit={saveProduct} className="space-y-5">

                        {/* Is Upcycled Toggle */}
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                            <div>
                                <p className="font-semibold text-gray-800">♻️ Is this an upcycled product?</p>
                                <p className="text-xs text-gray-500 mt-1">Upcycled products are made from waste materials</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsUpcycled(!isUpcycled)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isUpcycled ? 'bg-green-600' : 'bg-gray-300'}`}>
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isUpcycled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Product Title *</label>
                            <input type="text" name="title" required
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                                placeholder="e.g. Upcycled Denim Bag" />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Description</label>
                            <textarea name="description" rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 resize-none"
                                placeholder="Describe your product..." />
                        </div>

                        {/* Image */}
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Product Image *</label>
                            <input type="file" name="image" required accept="image/*"
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700" />
                        </div>

                        {/* Price & Inventory */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Price (GH₵) *</label>
                                <input type="number" name="price" required min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                                    placeholder="e.g. 50" />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Inventory *</label>
                                <input type="number" name="inventory" required min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                                    placeholder="e.g. 10" />
                            </div>
                        </div>

                        {/* Category & Waste Type */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Category *</label>
                                <select name="category" required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700">
                                    <option value="">Select category</option>
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
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Waste Type</label>
                                <select name="wasteType"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700">
                                    <option value="">Select waste type</option>
                                    {WASTE_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Location</label>
                            <input type="text" name="location"
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                                placeholder="e.g. Accra, Ghana" />
                        </div>

                        {/* Upcycling Fields */}
                        {isUpcycled && (
                            <div className="space-y-4 p-4 bg-green-50 rounded-xl border border-green-200">
                                <h3 className="font-semibold text-green-800">🌿 Upcycling Details</h3>
                                <p className="text-xs text-gray-500">Share your upcycling story to attract more buyers!</p>

                                {/* Upcycling Story */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">Upcycling Story</label>
                                    <textarea name="upcyclingStory" rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 resize-none"
                                        placeholder="Tell buyers how you transformed waste into this product..." />
                                </div>

                                {/* Waste Sourced */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">Where was the waste sourced?</label>
                                    <input type="text" name="wasteSourced"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                                        placeholder="e.g. Local market waste, collected from Accra streets" />
                                </div>

                                {/* Process Description */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">Process Description</label>
                                    <textarea name="processDescription" rows={2}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 resize-none"
                                        placeholder="Describe how you made this product..." />
                                </div>

                                {/* Time to Make */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">Time to Make</label>
                                    <input type="text" name="timeToMake"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                                        placeholder="e.g. 2 hours, 3 days" />
                                </div>

                                {/* Before Image */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">Before Image (Raw Waste)</label>
                                    <input type="file" name="beforeImage" accept="image/*"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700" />
                                    <p className="text-xs text-gray-400 mt-1">Photo of the waste before upcycling</p>
                                </div>
                            </div>
                        )}

                        {/* Condition */}
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Condition</label>
                            <select name="condition"
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700">
                                <option value="New">New</option>
                                <option value="Like New">Like New</option>
                                <option value="Good">Good</option>
                                <option value="Fair">Fair</option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                            <Link to="/customerDashboard/vendorProduct"
                                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-center">
                                Cancel
                            </Link>
                            <button type="submit"
                                className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium">
                                Submit Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;