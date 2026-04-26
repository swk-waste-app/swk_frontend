import image8 from '../../assets/images/image8.png'
import image7 from '../../assets/images/image16.png'
import image6 from '../../assets/images/image6.png'
const WasteManagementSection = () => {
  return (
    <div className="bg-gray-100 py-32">
      <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-center px-4 md:px-6 gap-6">
  <div className="text-center md:text-left mb-6 md:mb-10 w-full md:w-[40%]">
    <p className="text-green-600 font-semibold uppercase text-sm">What We Offer</p>
    <h2 className="text-3xl md:text-4xl font-bold text-green-800 mt-2">
      Sustainable Waste Management Solutions
    </h2>
  </div>
  <div className="w-full md:w-[40%]">
    <p className="text-gray-700 mt-4 max-w-xl">
      The SWK Taka Kipawa App is a proudly Ghanaian-owned platform that combines waste management with an upcycling marketplace. Our mission is to make environmental responsibility accessible and impactful by empowering users to schedule waste pickups, shop eco-friendly products, and participate in sustainability workshops. We are committed to providing an intuitive, eco-conscious solution that supports households and businesses alike in building a greener future.
    </p>
    <a href="#services" className="text-green-800 font-semibold mt-4 inline-block underline">
      All Services
    </a>
  </div>
</div>

        <div className="grid md:grid-cols-3 gap-6 mt-[5%] h-[70%] px-10">
        {/* <Link to="/customerDashboard/pickup" > */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 h-[100%] transition-transform transform hover:-translate-y-2 hover:shadow-2xl duration-300 w-full">
            <img src={image6} alt="Waste Collection" className="w-full h-40 object-cover" />
            <h3 className="text-xl font-bold text-green-800 mt-4">Waste Collection</h3>
            <p className="text-gray-700 mt-2">
              Using meticulous collection strategies, we efficiently gather wastes, transport them to designated facilities for sorting and transfer and recycling.
            </p>
          </div>
          {/* </Link> */}

         {/* <Link to="/customerDashboard/products" > */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 h-[100%] transition-transform transform hover:-translate-y-2 hover:shadow-2xl duration-300 w-full">
            <img src={image7} alt="Composting & Recycling" className="w-full h-40 object-cover" />
            <h3 className="text-xl font-bold text-green-800 mt-4">Composting & Recycling</h3>
            <p className="text-gray-700 mt-2">
              Our Integrated Waste Processing and Recycling Plant receives, sorts, processes, and recycles solid waste and produces organic compost for agronomic purposes in Ghana and West Africa.
            </p>
          </div>
          {/* </Link> */}

          {/* <Link to="/customerDashboard/blogs" className="block"> */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 h-[100%] transition-transform transform hover:-translate-y-2 hover:shadow-2xl duration-300 w-full">
        <img
          src={image8}
          alt="Landfill Management"
          className="w-full h-40 object-cover"
        />
        <h3 className="text-xl font-bold text-green-800 mt-4">Blogs</h3>
        <p className="text-gray-700 mt-2">
          We possess the appropriate technologies to effectively manage and decommission waste landfills.
        </p>
      </div>
    {/* </Link> */}
        </div>
      </div>
    </div>
  );
};

export default WasteManagementSection;
