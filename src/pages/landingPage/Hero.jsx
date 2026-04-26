import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import image1 from "../../assets/images/image12.png";
import image2 from "../../assets/images/image11.png";
import image3 from "../../assets/images/image13.png";
import { Link } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa';

const HeroSection = () => {
  const img = [image1, image2, image3];

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Admin Portal Link */}
      <div className="absolute top-4 right-4 z-20">
        <Link
          to="/AdminLogin"
          className="px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium text-white bg-black bg-opacity-50 
                     hover:bg-opacity-70 rounded-full transition-all duration-300 
                     flex items-center gap-2 backdrop-blur-sm border border-white/20"
        >
          <FaUserShield className="text-green-400" />
          Admin Portal
        </Link>
      </div>

      <Slider {...settings} className="absolute inset-0 h-full w-full">
  {img.map((img, index) => (
    <div key={index} className="!flex h-[100vh] w-full"> {/* Added !flex and explicit height */}
      <img 
        src={img} 
        alt={`Slide ${index + 1}`} 
        className="h-full w-full object-cover" // Removed sm:object-contain to maintain full coverage
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>
    </div>
  ))}
</Slider>

      <div className="absolute inset-0 z-10 flex items-center justify-center text-center text-white px-4 sm:px-6 md:px-8">
        <div className="relative z-20 max-w-2xl mx-auto">
          {/* Title Section */}
          <div className="mb-8 p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-300 via-green-400 to-green-500 text-transparent bg-clip-text">
                Taka Kipawa
              </span>
            </h1>
            <div className="h-1 w-16 sm:w-24 mx-auto bg-gradient-to-r from-green-300 to-green-500 rounded-full mb-4"></div>
          </div>

          <p className="text-lg sm:text-xl md:text-2xl mb-4 font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-500">
            Leading the Way in Sustainable Waste Management
          </p>

          <p className="text-sm sm:text-lg md:text-xl mb-12 font-light tracking-wide text-gray-100">
            Reduce • Reuse • Recycle
          </p>

          <Link
            to="/signin"
            className="inline-block px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-white 
                     bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg 
                     hover:from-green-600 hover:to-green-700 transition-all duration-300 
                     transform hover:scale-105"
            style={{
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)',
            }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
