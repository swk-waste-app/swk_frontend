import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetSingleProduct, apiGetProfile } from '../../services/product';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendar, FaBox, FaRecycle } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, profileResponse] = await Promise.all([
          apiGetSingleProduct(id),
          apiGetProfile()
        ]);
        
        setProduct(productResponse.data);
        setUserProfile(profileResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to load details',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const handleContactVendor = () => {
    Swal.fire({
      title: '<span class="text-xl font-semibold text-gray-800">Contact Information</span>',
      html: `
        <div class="text-left p-4 space-y-4">
          <div class="flex items-center gap-3">
            <FaUser class="text-green-500 text-xl" />
            <div>
              <p class="text-sm text-gray-500">Name</p>
              <p class="font-medium">${userProfile?.name || 'N/A'}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <FaPhone class="text-green-500 text-xl" />
            <div>
              <p class="text-sm text-gray-500">Phone</p>
              <p class="font-medium">${userProfile?.contactNumber || '0240070628'}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <FaEnvelope class="text-green-500 text-xl" />
            <div>
              <p class="text-sm text-gray-500">Email</p>
              <p class="font-medium">${userProfile?.email || 'N/A'}</p>
            </div>
          </div>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: 'rounded-xl shadow-xl',
        content: 'text-left'
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Image Section */}
          <div className="md:w-1/2">
            <div className="relative h-96">
              <img
                src={`https://res.cloudinary.com/dwgj3lovn/image/upload/${product.image}`}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium">
                  {product.wasteType}
                </span>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="md:w-1/2 p-8">
            <div className="space-y-6">
              {/* Title and Description */}
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {product.title}
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Key Details */}
              <div className="space-y-3 py-4 border-y border-gray-100">
                <div className="flex items-center gap-3 text-gray-600">
                  <FaMapMarkerAlt className="text-green-500 text-xl" />
                  <span className="text-base">{product.location}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <FaCalendar className="text-green-500 text-xl" />
                  <span className="text-base">
                    Posted on {new Date(product.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <FaUser className="text-green-500 text-xl" />
                  <span className="text-base">Posted by: {userProfile?.name || 'Anonymous'}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <FaBox className="text-green-500 text-xl" />
                  <span className="text-base">Quantity: {product.inventory}</span>
                </div>
              </div>

              {/* Contact Button */}
              <button
                onClick={handleContactVendor}
                className="w-full bg-green-500 text-white py-4 px-6 rounded-xl 
                         hover:bg-green-600 transition duration-300 
                         flex items-center justify-center gap-2 text-lg font-semibold
                         shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FaPhone className="text-xl" />
                Contact Seller
              </button>
            </div>
          </div>
        </div>

        {/* Additional Details Section */}
        <div className="p-8 bg-gray-50">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
            <FaRecycle className="text-green-500" />
            Recycling Details
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-green-500">•</span> Waste Type
              </h3>
              <p className="text-gray-600">{product.wasteType}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-green-500">•</span> Available Quantity
              </h3>
              <p className="text-gray-600">{product.inventory}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;