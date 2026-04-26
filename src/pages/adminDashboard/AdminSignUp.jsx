
import { useState } from 'react'
import { IoMdContact } from "react-icons/io";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { apiSignup } from '../../services/Auth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import image1 from "../../assets/images/image2.png"
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import logo from '../../assets/images/SWK_LOGO__5_.png';


export default function AdminSignup() {
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(true);

  
  const handleSubmit = async (event) => {
    event.preventDefault(); // prevent the page from reloading
  
    setLoading(true);
    // prepare data to be sent to backend
    const formData = new FormData(event.target); // takes the data from the form
    const contactNumber = formData.get("contactNumber");
    const name = formData.get("name");
    const email = formData.get("email");
    const confirmpass = formData.get("confirmpass");
    const password = formData.get("password");
  
    console.log(name);
  
    // Create the payload for signup
    const payload = { name, email, password, contactNumber, role:"admin"};
  
    // Check if passwords match
    if (!name || !email) {
      alert("Please make sure all fields are filled");
      setLoading(false);
    } else if (password !== confirmpass) {
      alert("Passwords do not match. Try Again!");
      setLoading(false);
    } else {
      try {
        // Attempt to signup the user
        const response = await apiSignup(payload);
        console.log(response.data);
  
        // Assuming the response contains an access token, save it to localStorage
        if (response.data?.accessToken) {
          localStorage.setItem("token", response.data.accessToken);
          // localStorage.setItem('userRoles', payload.role);
        }
  
        setLoading(false);
        navigate("/AdminLogin");
      } catch (err) {
        console.log("error: ", err.response?.data || err);
        setLoading(false);
        alert("An error occurred. Please try again.");
        return;
      }
    }
  };
  return (
    <div className="flex min-h-screen relative flex-col md:flex-row">
    
    <div className="w-full md:w-1/2 h-full overflow-hidden relative">
      <img src={image1} alt="Sign Up" className="relative w-full h-full object-cover rounded-r-lg" />
    </div>

 
    <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gray-50 p-8">
    <div className="flex flex-col items-center mb-6">
    <img 
      src={logo} 
      alt="SWKWASTE Logo" 
      className="h-28 w-auto object-contain "
      // style={{
      //   filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.3))'  // Optional: adds subtle green shadow
      // }}
    />
      <p className="text-lg mb-6">Join us in managing waste responsibly</p>
</div>

      <form onSubmit={handleSubmit} className="p-8 rounded-lg w-full max-w-sm">
        <div className="mb-4">
          <div className="flex items-center bg-gray-100 rounded-md p-2">
            
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              className="bg-gray-100 w-full focus:outline-none px-2 text-gray-700"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center bg-gray-100 rounded-md p-2">
            <AiOutlineMail className="text-gray-500 h-5 w-5 mr-2" />
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="bg-gray-100 w-full focus:outline-none px-2 text-gray-700"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center bg-gray-100 rounded-md p-2">
            <AiOutlineLock className="text-gray-500 h-5 w-5 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              className="bg-gray-100 w-full focus:outline-none px-2 text-gray-700"
              required
            />
            <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer text-gray-500 ml-2">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <small className="block mt-1 text-xs text-gray-500">
            Password must be at least 6 characters
          </small>
        </div>

        <div className="mb-4">
          <div className="flex items-center bg-gray-100 rounded-md p-2">
            <AiOutlineLock className="text-gray-500 h-5 w-5 mr-2" />
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmpass"
              className="bg-gray-100 w-full focus:outline-none px-2 text-gray-700"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center bg-gray-100 rounded-md p-2">
            <IoMdContact className="text-gray-500 h-5 w-5 mr-2" />
            <input
              type="number"
              placeholder="Contact Number"
              name="contactNumber"
              className="bg-gray-100 w-full focus:outline-none px-2 text-gray-700"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition duration-200 mt-4 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <div className="text-center text-gray-500 mt-4">OR</div>

       

        <p className="mt-4 text-center text-sm">
          Already have an account? 
          <Link to="/signin" className="text-green-500 hover:underline ml-1">  Sign In</Link>
        </p>
      </form>

      <footer className="text-center text-gray-400 mt-24 text-xs">
        © SWK Corporate
      </footer>
    </div>
  </div>
  )
}
