import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGetVendorProfile, apiGetVendorProducts } from '../../services/product';
import ApiGet from './CustomerApiGet';
import { FaArrowLeft, FaSearch, FaStore, FaTimes, FaRecycle, FaBoxOpen, FaShoppingBag } from 'react-icons/fa';

const VendorStorefront = () => {
    const { vendorId } = useParams();
    const navigate = useNavigate();
    const [vendor, setVendor] = useState(null);
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [vendorRes, productsRes] = await Promise.all([
                    apiGetVendorProfile(vendorId),
                    apiGetVendorProducts(vendorId)
                ]);
                setVendor(vendorRes.data);
                const prods = productsRes.data || [];
                setProducts(prods);
                setFiltered(prods);
            } catch {
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [vendorId, navigate]);

    useEffect(() => {
        if (!search) {
            setFiltered(products);
            return;
        }
        const q = search.toLowerCase();
        setFiltered(products.filter(p =>
            p.title?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
        ));
    }, [search, products]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    const upcycledCount = products.filter(p => p.isUpcycled).length;

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="p-4 space-y-6">

                {/* Back */}
                <button onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium">
                    <FaArrowLeft /> Back to Marketplace
                </button>

                {/* Vendor Header */}
                <div className="rounded-2xl p-6 text-white relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #026937, #00BFA5)' }}>
                    <div className="absolute -right-6 -top-6 w-40 h-40 bg-white opacity-5 rounded-full" />
                    <div className="absolute -right-2 top-8 w-24 h-24 bg-white opacity-5 rounded-full" />

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 border-2 border-white border-opacity-40 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                            {vendor?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                            <p className="text-green-200 text-xs flex items-center gap-1 mb-1">
                                <FaStore size={10} /> Vendor Store
                            </p>
                            <h1 className="text-2xl font-bold leading-tight">
                                {vendor?.name ? `${vendor.name}'s Store` : 'Vendor Store'}
                            </h1>
                            {vendor?.location && (
                                <p className="text-green-200 text-sm mt-1">📍 {vendor.location}</p>
                            )}
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="mt-5 grid grid-cols-3 gap-4 relative z-10">
                        <div className="bg-white bg-opacity-10 rounded-xl p-3 text-center">
                            <FaBoxOpen className="mx-auto mb-1 text-green-200" />
                            <p className="text-xl font-bold">{vendor?.totalProducts || 0}</p>
                            <p className="text-green-200 text-xs">Products</p>
                        </div>
                        <div className="bg-white bg-opacity-10 rounded-xl p-3 text-center">
                            <FaShoppingBag className="mx-auto mb-1 text-green-200" />
                            <p className="text-xl font-bold">{vendor?.totalSold || 0}</p>
                            <p className="text-green-200 text-xs">Items Sold</p>
                        </div>
                        <div className="bg-white bg-opacity-10 rounded-xl p-3 text-center">
                            <FaRecycle className="mx-auto mb-1 text-green-200" />
                            <p className="text-xl font-bold">{upcycledCount}</p>
                            <p className="text-green-200 text-xs">Upcycled</p>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder={`Search in ${vendor?.name || 'this'} store...`}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-11 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 bg-white shadow-sm"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">
                            <FaTimes />
                        </button>
                    )}
                </div>

                {/* Count */}
                <p className="text-sm text-gray-500">
                    {filtered.length} product{filtered.length !== 1 ? 's' : ''} available
                </p>

                {/* Products Grid */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map(product => (
                            <ApiGet
                                key={product.id}
                                id={product.id}
                                title={product.title}
                                description={product.description}
                                image={product.image}
                                inventory={product.inventory}
                                price={product.price}
                                isUpcycled={product.isUpcycled}
                                wasteType={product.wasteType}
                                location={product.location}
                                condition={product.condition}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400">
                        <FaRecycle className="text-5xl mx-auto mb-3 opacity-20" />
                        <p className="font-medium text-gray-500">
                            {search ? 'No products match your search' : 'No products listed yet'}
                        </p>
                        {search && (
                            <button onClick={() => setSearch('')}
                                className="mt-3 text-green-600 text-sm hover:underline">
                                Clear search
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorStorefront;
