import { Link } from 'react-router-dom';

const ApiGet = ({ id, title, inventory, image, description, price }) => {
  const productId = id || 'no-id';

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md 
                    hover:shadow-xl transform hover:-translate-y-1 transition-all 
                    duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-lg sm:rounded-t-xl 
                      h-40 sm:h-48 md:h-52 lg:h-56">
        <img 
          src={`https://res.cloudinary.com/dwgj3lovn/image/upload/${image}`} 
          alt={title} 
          className="w-full h-full object-cover transform hover:scale-110 
                     transition-transform duration-500" 
        />
        {/* Stock Badge */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
            inventory > 0 
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {inventory > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3 flex-grow">
        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 
                       dark:text-white line-clamp-1 hover:line-clamp-none">
          {title}
        </h2>

        {/* Price and Inventory */}
      
        <div className="flex items-center justify-between">
          <span className="text-xl sm:text-2xl font-bold text-green-600 
                          dark:text-green-400">
            GH₵ {price ? Number(price).toFixed(2) : '0.00'}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {inventory} units left
          </span>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 
                      line-clamp-2 hover:line-clamp-none transition-all 
                      duration-300 min-h-[2.5rem]">
          {description || 'No description available'}
        </p>

        {/* Action Button */}
        <Link 
          to={`/customerDashboard/product/${id}`}
          className="block w-full mt-2 sm:mt-4 px-3 sm:px-4 py-2 bg-green-600 
                     text-white text-sm sm:text-base rounded-lg hover:bg-green-700 
                     transition-colors duration-300 focus:outline-none 
                     focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 
                     text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ApiGet;
