import { Link } from 'react-router-dom';

const ApiGet = ({ id, title, inventory, image, description, price, isUpcycled, wasteType, location, condition }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-xl h-48">
        <img
          src={`https://res.cloudinary.com/dwgj3lovn/image/upload/${image}`}
          alt={title}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isUpcycled && (
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              ♻️ Upcycled
            </span>
          )}
          {condition && (
            <span className="bg-white text-gray-700 text-xs px-2 py-1 rounded-full font-medium shadow-sm">
              {condition}
            </span>
          )}
        </div>
        {/* Stock Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            inventory > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {inventory > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 flex-grow flex flex-col">
        {/* Title */}
        <h2 className="text-base font-semibold text-gray-800 line-clamp-1">{title}</h2>

        {/* Waste Type Tag */}
        {wasteType && (
          <span className="inline-block bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded-full w-fit">
            {wasteType}
          </span>
        )}

        {/* Price and Inventory */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-green-600">
            GH₵ {price ? Number(price).toFixed(2) : '0.00'}
          </span>
          <span className="text-xs text-gray-500">{inventory} units left</span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 line-clamp-2 flex-grow">
          {description || 'No description available'}
        </p>

        {/* Location */}
        {location && (
          <p className="text-xs text-gray-400 flex items-center gap-1">
            📍 {location}
          </p>
        )}

        {/* Action Button */}
        <Link
          to={`/customerDashboard/product/${id}`}
          className="block w-full mt-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors text-center font-medium">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ApiGet;