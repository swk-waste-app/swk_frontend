import { useEffect, useState } from 'react';
import { apiGetProducts } from '../../services/product';
import ApiGet from './CustomerApiGet';
import { FaSearch, FaRecycle, FaTimes } from 'react-icons/fa';

const CATEGORIES = ['All', 'Bottles', 'Papers', 'Organic Fertilizer', 'Fashion & Textiles', 
    'Electronics', 'Metals', 'Plastics', 'Glass', 'Wood', 'Other'];

const CustomerPage = () => {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [showUpcycledOnly, setShowUpcycledOnly] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 12;

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let result = [...products];
        if (search) {
            result = result.filter(p =>
                p.title?.toLowerCase().includes(search.toLowerCase()) ||
                p.description?.toLowerCase().includes(search.toLowerCase()) ||
                p.upcyclingStory?.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (category !== 'All') result = result.filter(p => p.category === category);
        if (showUpcycledOnly) result = result.filter(p => p.isUpcycled);
        if (priceRange.min) result = result.filter(p => p.price >= parseFloat(priceRange.min));
        if (priceRange.max) result = result.filter(p => p.price <= parseFloat(priceRange.max));
        if (sortBy === 'price_low') result.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price_high') result.sort((a, b) => b.price - a.price);
        else if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFiltered(result);
        setPage(1);
    }, [products, search, category, showUpcycledOnly, sortBy, priceRange]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await apiGetProducts();
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error.message);
            setError('Failed to load products. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const clearFilters = () => {
        setSearch('');
        setCategory('All');
        setShowUpcycledOnly(false);
        setSortBy('newest');
        setPriceRange({ min: '', max: '' });
    };

    const hasActiveFilters = search || category !== 'All' || showUpcycledOnly || priceRange.min || priceRange.max;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-4 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">♻️ Recycled & Upcycled Products</h1>
                        <p className="text-gray-500 text-sm mt-1">{filtered.length} products available</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products, materials, upcycling stories..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 bg-white shadow-sm"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">
                            <FaTimes />
                        </button>
                    )}
                </div>

                {/* Filters Row */}
                <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Upcycled Toggle */}
                        <button
                            onClick={() => setShowUpcycledOnly(!showUpcycledOnly)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                showUpcycledOnly
                                    ? 'bg-green-600 text-white'
                                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                            }`}>
                            <FaRecycle />
                            Upcycled Only
                        </button>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option value="newest">Newest First</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                        </select>

                        {/* Price Range */}
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="Min GH₵"
                                value={priceRange.min}
                                onChange={e => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                className="w-24 px-3 py-2 border border-gray-200 rounded-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <span className="text-gray-400 text-sm">—</span>
                            <input
                                type="number"
                                placeholder="Max GH₵"
                                value={priceRange.max}
                                onChange={e => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                className="w-24 px-3 py-2 border border-gray-200 rounded-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <button onClick={clearFilters}
                                className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm hover:bg-red-100 transition-colors">
                                <FaTimes size={10} /> Clear Filters
                            </button>
                        )}
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 flex-wrap">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                    category === cat
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                {filtered.length > 0 ? (
                    <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((product) => (
                            <ApiGet
                                key={product.id}
                                id={product.id}
                                description={product.description}
                                image={product.image}
                                inventory={product.inventory}
                                price={product.price}
                                title={product.title}
                                isUpcycled={product.isUpcycled}
                                wasteType={product.wasteType}
                                location={product.location}
                                condition={product.condition}
                                vendorName={product.user?.name}
                                vendorId={product.user?.id}
                            />
                        ))}
                    </div>
                    {/* Pagination */}
                    {filtered.length > PAGE_SIZE && (
                        <div className="flex items-center justify-center gap-2 pt-2 pb-6">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                ← Prev
                            </button>
                            {Array.from({ length: Math.ceil(filtered.length / PAGE_SIZE) }, (_, i) => i + 1).map(n => (
                                <button
                                    key={n}
                                    onClick={() => setPage(n)}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                                        n === page
                                            ? 'bg-green-600 text-white'
                                            : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                    }`}>
                                    {n}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(p => Math.min(Math.ceil(filtered.length / PAGE_SIZE), p + 1))}
                                disabled={page === Math.ceil(filtered.length / PAGE_SIZE)}
                                className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                Next →
                            </button>
                        </div>
                    )}
                    </>
                ) : (
                    <div className="text-center py-16 text-gray-400">
                        <FaRecycle className="text-5xl mx-auto mb-3 opacity-20" />
                        <p className="font-medium text-gray-500">No products found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filters</p>
                        {hasActiveFilters && (
                            <button onClick={clearFilters}
                                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition-colors">
                                Clear All Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerPage;