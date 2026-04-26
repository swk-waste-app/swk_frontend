import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiGetSingleProduct } from '../../services/product';
import { FaArrowLeft, FaMapMarkerAlt, FaCalendar, FaBox, FaRecycle, FaStore } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiGetSingleProduct(id);
        setProduct(response.data);
      } catch {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'Failed to load product details' });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-3">
        <p className="text-xl text-gray-600">Product not found</p>
        <button onClick={() => navigate(-1)} className="text-green-600 hover:underline text-sm">Go back</button>
      </div>
    );
  }

  const vendor = product.user;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      {/* Back */}
      <div className="p-4">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium">
          <FaArrowLeft /> Back
        </button>
      </div>

      <div className="px-4 max-w-4xl mx-auto space-y-4">

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="md:flex">

            {/* Image */}
            <div className="md:w-2/5">
              <div className="relative h-72 md:h-full min-h-[280px]">
                <img
                  src={`https://res.cloudinary.com/dwgj3lovn/image/upload/${product.image}`}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                />
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isUpcycled && (
                    <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">♻️ Upcycled</span>
                  )}
                  {product.condition && (
                    <span className="bg-white text-gray-700 text-xs px-3 py-1 rounded-full font-medium shadow">{product.condition}</span>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    product.inventory > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inventory > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="md:w-3/5 p-6 space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
                {product.wasteType && (
                  <span className="inline-block mt-2 bg-teal-50 text-teal-700 text-xs px-3 py-1 rounded-full">
                    {product.wasteType}
                  </span>
                )}
              </div>

              <p className="text-4xl font-bold text-green-600">
                GH₵ {Number(product.price || 0).toFixed(2)}
              </p>

              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description || 'No description provided.'}
              </p>

              <div className="space-y-2 py-3 border-y border-gray-100">
                {product.location && (
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <FaMapMarkerAlt className="text-green-500 flex-shrink-0" />
                    <span>{product.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <FaCalendar className="text-green-500 flex-shrink-0" />
                  <span>Listed {new Date(product.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <FaBox className="text-green-500 flex-shrink-0" />
                  <span>{product.inventory} units available</span>
                </div>
              </div>

              {/* Vendor Panel */}
              {vendor && (
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {vendor.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Sold by</p>
                      <p className="font-semibold text-gray-800">{vendor.name}</p>
                      {vendor.location && (
                        <p className="text-xs text-gray-400">📍 {vendor.location}</p>
                      )}
                    </div>
                  </div>
                  <Link
                    to={`/customerDashboard/store/${vendor.id}`}
                    className="flex items-center gap-1.5 text-sm bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
                    <FaStore size={12} /> Visit Store
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcycling Story */}
        {(product.upcyclingStory || product.materialsUsed?.length > 0) && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FaRecycle className="text-green-500" /> Upcycling Story
            </h2>
            {product.upcyclingStory && (
              <p className="text-gray-600 text-sm leading-relaxed">{product.upcyclingStory}</p>
            )}
            {product.materialsUsed?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Materials Used</p>
                <div className="flex flex-wrap gap-2">
                  {product.materialsUsed.map((m, i) => (
                    <span key={i} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">{m}</span>
                  ))}
                </div>
              </div>
            )}
            {product.processDescription && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Process</p>
                <p className="text-gray-600 text-sm">{product.processDescription}</p>
              </div>
            )}
            {product.timeToMake && (
              <p className="mt-3 text-xs text-gray-500">⏱️ Time to make: {product.timeToMake}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
