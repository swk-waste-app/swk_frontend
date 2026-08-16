import { Link } from "react-router-dom"
import image1 from "../../assets/images/hero-3.webp"
const WhoWeAre = () => {
  return (
    <div className="relative bg-green-900 text-white h-screen flex flex-col justify-center items-center">
     
      <div className="absolute inset-0 opacity-40">
        <img
          src={image1}
          alt="Background trucks"
          className="w-full h-full object-cover"
        />
      </div>

      
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold uppercase tracking-wider">Who We Are</h2>
        <h1 className="text-4xl font-bold mt-4">
          So Much More Than <span className="italic">&ldquo;Managing Waste&rdquo;</span>
        </h1>
        <p className="text-lg mt-6 max-w-2xl mx-auto">
          With a focus on people, service and sustainability, SWK Waste is committed to
          the right actions today for a better shared tomorrow.
        </p>

        
        <div className="mt-8 text-sm text-gray-200">
          <Link to="/" className="hover:underline hover:text-white">
            Home
          </Link>
          <span className="mx-2">•</span>
          <span className="text-white font-semibold">Who We Are</span>
        </div>
      </div>
    </div>
  );
};

export default WhoWeAre;
