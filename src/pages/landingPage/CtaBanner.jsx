import { Link } from 'react-router-dom';
import { FaArrowRight, FaStore } from 'react-icons/fa';

const CtaBanner = () => {
  return (
    <section className="px-5 sm:px-8 py-16 lg:py-20 bg-white">
      <div className="relative max-w-7xl mx-auto overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-green-700 to-green-900 px-8 py-14 sm:px-16 sm:py-16 text-center shadow-2xl">
        <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 animate-blob" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-green-400/20 animate-blob" style={{ animationDelay: '3s' }} />

        <div className="relative">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight max-w-2xl mx-auto">
            Ready to Turn Your Waste Into Worth?
          </h2>
          <p className="text-green-100 mt-4 max-w-xl mx-auto text-base sm:text-lg">
            Join the Taka Kipawa community today &mdash; schedule your first pickup or open a storefront on
            our upcycling marketplace.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-green-800 font-bold shadow-lg hover:bg-green-50 transition-all duration-200 hover:scale-105"
            >
              Get Started <FaArrowRight size={13} />
            </Link>
            <Link
              to="/vendorsignup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white/50 text-white font-bold hover:bg-white/10 transition-all duration-200"
            >
              <FaStore size={14} /> Become a Vendor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
