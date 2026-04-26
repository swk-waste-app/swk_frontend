import { useState } from 'react';
import { FaCommentDots, FaInfoCircle } from 'react-icons/fa';
import ChatForm from '../../components/ContactUsForm'; 
import image5 from '../../assets/images/image5.png'
import { Link } from 'react-router-dom';
const AboutSection = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Function to toggle chat form visibility
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <section className="flex flex-col lg:flex-row items-center lg:items-start px-6 py-10 lg:py-20 lg:px-16 bg-white dark:bg-gray-900">
      
      <div className="relative w-full lg:w-1/2 flex justify-center items-center">
        <img
          src={image5}
          alt="Waste Management Workers"
          className="rounded-lg shadow-lg w-full lg:w-5/6"
        />
        <div className="absolute top-5 left-5 bg-gray-100 p-4 rounded-lg shadow-md text-center">
          <h2 className="text-4xl font-bold text-green-700">3+</h2>
          <p className="text-gray-600">Years of Experience</p>
        </div>
      </div>

     
      <div className="w-full lg:w-1/2 mt-10 lg:mt-0 lg:pl-10 text-gray-700 dark:text-gray-300">
        <h3 className="uppercase text-sm text-green-600 font-semibold">Who We Are</h3>
        <h1 className="text-3xl lg:text-5xl font-bold text-green-700 dark:text-white mt-2">
          SWK Taka Kipawa, the Future of Eco-Conscious Living!
        </h1>
        <p className="text-lg font-semibold text-gray-500 dark:text-gray-400 mt-4">
          Sustainable Waste Management Solutions for Homes, Businesses & Communities, Enhanced with Innovation.
        </p>
        <p className="mt-6 text-gray-600 dark:text-gray-400">
          The SWK Taka Kipawa App is a proudly Ghanaian-owned platform that combines waste management with an upcycling marketplace. Our mission is to make environmental responsibility accessible and impactful by empowering users to schedule waste pickups, shop eco-friendly products, and participate in sustainability workshops. We are committed to providing an intuitive, eco-conscious solution that supports households and businesses alike in building a greener future. With over{' '}
          <strong className="text-green-700 dark:text-white">1 hundred satisfied customers</strong>, we take immense
          pride in our commitment to excellence.
        </p>   
        <Link to="/who-we-are">  
      <button className="flex items-center mt-8 px-6 py-3 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800">
        <FaInfoCircle className="mr-2" /> More About Us
      </button>
    </Link>

        
        {!isChatOpen && (
          <div
            className="fixed bottom-4 right-4 flex items-center space-x-2 bg-white text-gray-700 p-3 rounded-full shadow-lg cursor-pointer dark:bg-gray-800 dark:text-gray-300"
            onClick={toggleChat}
          >
            <FaCommentDots className="text-2xl" />
            <span className="hidden lg:inline">Chat with us 👋</span>
          </div>
        )}

       
        {isChatOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
           
            <div
              className="absolute inset-0 bg-black opacity-50"
              onClick={toggleChat}
            ></div>
            

           
           <div className="relative ">
             
              <ChatForm /> 
            </div>
            </div> 
        )}
      </div>
    </section>
  );
};

export default AboutSection;