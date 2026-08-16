import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaRecycle, FaTruck, FaUsers } from 'react-icons/fa';
import heroImg1 from '../../assets/images/hero-1.webp';
import heroImg2 from '../../assets/images/hero-2.webp';
import heroImg3 from '../../assets/images/hero-3.webp';

const STATS = [
  { icon: FaUsers, value: '100+', label: 'Happy Customers' },
  { icon: FaTruck, value: '3+ yrs', label: 'On-the-Ground Experience' },
  { icon: FaRecycle, value: '100%', label: 'Eco-Conscious Process' },
];

const HeroSection = () => {
  const images = [heroImg1, heroImg2, heroImg3];

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    fade: true,
    pauseOnHover: false,
    arrows: false,
  };

  return (
    <div className="relative h-[100svh] min-h-[640px] overflow-hidden bg-green-950">
      <Slider {...settings} className="absolute inset-0 h-full w-full [&_.slick-list]:h-full [&_.slick-track]:h-full">
        {images.map((img, index) => (
          <div key={index} className="!flex h-[100svh] min-h-[640px] w-full">
            <img
              src={img}
              alt=""
              loading={index === 0 ? 'eager' : 'lazy'}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </Slider>

      {/* Gradient overlay for legibility + brand tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-green-950/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-transparent to-transparent opacity-60" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6 md:px-8 pt-16">
        <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-green-200 backdrop-blur-sm">
            Proudly Ghanaian &middot; Kipawa &amp; Beyond
          </span>

          <h1 className="mt-6 text-4xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] text-white">
            Cleaner Streets.{' '}
            <span className="bg-gradient-to-r from-green-300 via-emerald-400 to-green-500 text-transparent bg-clip-text">
              Greener Ghana.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-gray-100/90 max-w-2xl mx-auto font-light">
            Taka Kipawa makes waste management effortless &mdash; schedule pickups, shop
            upcycled goods, and join a community turning trash into treasure.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white
                       bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg shadow-green-600/40
                       hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
            >
              Get Started &mdash; It&rsquo;s Free
            </Link>
            <a
              href="#services"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white
                       rounded-full border-2 border-white/40 hover:border-white hover:bg-white/10 transition-all duration-300"
            >
              Explore Services
            </a>
          </div>
        </div>

        {/* Floating stats strip */}
        <div className="hidden sm:grid absolute bottom-8 left-1/2 -translate-x-1/2 grid-cols-3 gap-3 md:gap-6 w-[min(92%,760px)] rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md px-4 py-5 shadow-2xl">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center text-center gap-1.5">
              <Icon className="text-green-300" size={20} />
              <span className="text-xl md:text-2xl font-extrabold text-white">{value}</span>
              <span className="text-[11px] md:text-xs text-gray-200 uppercase tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to learn more"
        className="hidden md:flex absolute bottom-2 left-1/2 -translate-x-1/2 z-10 h-9 w-9 items-center justify-center rounded-full text-white/70 hover:text-white animate-bounce"
      >
        <FaChevronDown />
      </a>
    </div>
  );
};

export default HeroSection;
