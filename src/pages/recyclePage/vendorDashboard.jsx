import React, { useEffect, useState } from 'react';
import { apiGetVendorsProducts, apiGetUserStats, apiGetLeaderboard } from '../../services/product';
import { Link } from 'react-router-dom';
import { FaStore, FaEye, FaBoxOpen, FaMoneyBillWave, FaRecycle, FaArrowRight, FaPlus, FaStar, FaLeaf } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CATEGORY_COLORS = {
    'Fashion & Textiles': '#8B5CF6',
    'Electronics': '#3B82F6',
    'Plastics': '#06B6D4',
    'Metals': '#F59E0B',
    'Glass': '#10B981',
    'Wood': '#92400E',
    'Papers': '#6B7280',
    'Bottles': '#EF4444',
    'Other': '#64748B',
};

const VendorDashboard = () => {
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, statsRes, leaderboardRes] = await Promise.all([
                apiGetVendorsProducts(),
                apiGetUserStats(),
                apiGetLeaderboard()
            ]);
            setProducts(productsRes.data || []);
            setStats(statsRes.data);
            setLeaderboard(leaderboardRes.data || []);
        } catch (error) {
            console.error('Error fetching vendor data:', error);
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

    // Calculate product stats
    const totalProducts = products.length;
    const availableProducts = products.filter(p => p.inventory > 0).length;
    const outOfStock = products.filter(p => p.inventory === 0).length;
    const upcycledProducts = products.filter(p => p.isUpcycled).length;
    const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalSold = products.reduce((sum, p) => sum + (p.sold || 0), 0);
    const totalRevenue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.sold || 0)), 0);
    const avgPrice = totalProducts > 0
        ? (products.reduce((sum, p) => sum + (p.price || 0), 0) / totalProducts).toFixed(2)
        : '0.00';

    // Category breakdown for chart
    const categoryData = Object.entries(
        products.reduce((acc, p) => {
            const cat = p.category || 'Other';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {})
    ).map(([name, count]) => ({ name, count })).slice(0, 6);

    // Top products by views
    const topProducts = [...products].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

    // Vendor rank in leaderboard
    const vendorName = stats?.user?.name;
    const vendorRank = leaderboard.findIndex(u => u.name === vendorName) + 1;

    return (
        <div className="space-y-6 p-4 bg-gray-50 min-h-screen">

            {/* Header Banner */}
            <div className="rounded-2xl p-6 text-white relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #026937, #00BFA5)' }}>
                <div className="absolute top-0 right-0 w-48 h-48 opacity-10 text-9xl flex items-center justify-center">
                    🛍️
                </div>
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-green-200 text-sm uppercase tracking-wider">Vendor Portal</p>
                        <h1 className="text-3xl font-bold mt-1">My Shop Overview</h1>
                        <p className="text-green-200 text-sm mt-1">{vendorName || 'Vendor'}'s Upcycling Store</p>
                    </div>
                    {vendorRank > 0 && (
                        <div className="bg-white bg-opacity-20 rounded-xl px-4 py-3 text-center">
                            <p className="text-green-200 text-xs">Community Rank</p>
                            <p className="text-white font-bold text-2xl">#{vendorRank}</p>
                        </div>
                    )}
                </div>
                <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <FaLeaf className="text-green-300" />
                        <span className="text-sm">{upcycledProducts} upcycled products</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaStar className="text-yellow-300" />
                        <span className="text-sm">{stats?.stats?.totalPoints || 0} points earned</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <Link to="/customerDashboard/addProduct"
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                        <FaPlus className="text-green-600 group-hover:text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Action</p>
                        <p className="text-sm font-semibold text-gray-800">Add Product</p>
                    </div>
                    <FaArrowRight className="text-gray-300 ml-auto group-hover:text-green-600 transition-colors" />
                </Link>
                <Link to="/customerDashboard/vendorProduct"
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                        <FaStore className="text-teal-600 group-hover:text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Manage</p>
                        <p className="text-sm font-semibold text-gray-800">My Products</p>
                    </div>
                    <FaArrowRight className="text-gray-300 ml-auto group-hover:text-teal-600 transition-colors" />
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-600">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wider">Total Products</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-1">{totalProducts}</h3>
                            <p className="text-xs text-green-600 mt-1">{availableProducts} available</p>
                        </div>
                        <FaBoxOpen className="text-green-500 text-2xl opacity-80" />
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wider">Total Views</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-1">{totalViews}</h3>
                            <p className="text-xs text-blue-600 mt-1">Across all products</p>
                        </div>
                        <FaEye className="text-blue-500 text-2xl opacity-80" />
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wider">Items Sold</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-1">{totalSold}</h3>
                            <p className="text-xs text-orange-600 mt-1">All time</p>
                        </div>
                        <FaStore className="text-orange-500 text-2xl opacity-80" />
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wider">Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">GH₵ {totalRevenue.toFixed(2)}</h3>
                            <p className="text-xs text-purple-600 mt-1">Avg price: GH₵ {avgPrice}</p>
                        </div>
                        <FaMoneyBillWave className="text-purple-500 text-2xl opacity-80" />
                    </div>
                </div>
            </div>

            {/* Upcycling Impact */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">🌍 Your Upcycling Impact</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">{upcycledProducts}</p>
                        <p className="text-xs text-gray-600 mt-1">♻️ Upcycled Products</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600">{outOfStock}</p>
                        <p className="text-xs text-gray-600 mt-1">📦 Out of Stock</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-yellow-600">
                            {totalProducts > 0 ? Math.round((upcycledProducts / totalProducts) * 100) : 0}%
                        </p>
                        <p className="text-xs text-gray-600 mt-1">🌱 Upcycled Rate</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-teal-600">{categoryData.length}</p>
                        <p className="text-xs text-gray-600 mt-1">🏷️ Categories</p>
                    </div>
                </div>
            </div>

            {/* Chart + Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Category Breakdown Chart */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Products by Category</h3>
                    {categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={categoryData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#026937" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                            <FaStore className="text-4xl mb-2 opacity-30" />
                            <p>No products yet</p>
                            <Link to="/customerDashboard/addProduct"
                                className="mt-2 text-green-600 text-sm hover:underline">
                                Add your first product →
                            </Link>
                        </div>
                    )}
                </div>

                {/* Top Products by Views */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">👁️ Top Products</h3>
                        <Link to="/customerDashboard/vendorProduct"
                            className="text-green-600 text-sm hover:underline">View all →</Link>
                    </div>
                    {topProducts.length > 0 ? (
                        <div className="space-y-3">
                            {topProducts.map((product, index) => (
                                <div key={product._id || index}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                        index === 0 ? 'bg-yellow-400' :
                                        index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{product.title}</p>
                                        <p className="text-xs text-gray-500">{product.category} • GH₵ {product.price}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-green-600">{product.views || 0} views</p>
                                        <p className="text-xs text-gray-500">{product.sold || 0} sold</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <FaBoxOpen className="text-4xl mx-auto mb-2 opacity-30" />
                            <p>No products yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* All Products Summary */}
            {products.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">📦 Product Inventory</h3>
                        <Link to="/customerDashboard/addProduct"
                            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700 transition-colors">
                            <FaPlus size={10} /> Add New
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {products.slice(0, 5).map((product, index) => (
                            <div key={product._id || index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center overflow-hidden">
                                        {product.image ? (
                                            <img
                                                src={`https://res.cloudinary.com/dwgj3lovn/image/upload/${product.image}`}
                                                alt={product.title}
                                                className="w-full h-full object-cover"
                                                onError={e => { e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <FaRecycle className="text-green-500" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{product.title}</p>
                                        <p className="text-xs text-gray-500">{product.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-right">
                                    <div>
                                        <p className="text-sm font-bold text-green-600">GH₵ {product.price}</p>
                                        <p className="text-xs text-gray-500">{product.inventory} in stock</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        product.inventory > 0
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {product.inventory > 0 ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                    {product.isUpcycled && (
                                        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                                            ♻️ Upcycled
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {products.length > 5 && (
                            <Link to="/customerDashboard/vendorProduct"
                                className="block text-center text-sm text-green-600 hover:underline pt-2">
                                View all {products.length} products →
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorDashboard;