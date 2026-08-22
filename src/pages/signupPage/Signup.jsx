import { useState } from 'react';
import { IoMdContact } from "react-icons/io";
import { FaGoogle, FaEye, FaEyeSlash, FaUser, FaStore } from "react-icons/fa";
import { apiSignup, startGoogleSignIn } from '../../services/Auth';
import { useNavigate, Link } from 'react-router-dom';
import image1 from "../../assets/images/image2.png";
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import logo from '../../assets/images/SWK_LOGO__5_.png';

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const formData = new FormData(event.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmpass = formData.get("confirmpass");
    const contactNumber = formData.get("contactNumber");

    if (!name || !email) {
      setErrorMessage("Please make sure all fields are filled");
      setLoading(false);
      return;
    }
    if (password !== confirmpass) {
      setErrorMessage("Passwords do not match. Try again!");
      setLoading(false);
      return;
    }

    const payload = { name, email, password, contactNumber, role: selectedRole };

    try {
      const response = await apiSignup(payload);
      if (response.data?.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
      }
      setLoading(false);
      navigate("/signin");
    } catch (err) {
      console.log("error: ", err.response?.data || err);
      setLoading(false);
      setErrorMessage(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const handleGoogleSignup = () => {
    startGoogleSignIn(selectedRole);
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">

      {/* Left Image */}
      <div className="hidden md:block w-1/2 h-screen overflow-hidden">
        <img src={image1} alt="Sign Up" className="w-full h-full object-cover" />
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gray-50 p-8 overflow-y-auto">
        <div className="flex flex-col items-center mb-4">
          <img src={logo} alt="Taka Kipawa Logo" className="h-20 w-auto object-contain" />
          <p className="text-gray-600 mt-2">Join us in managing waste responsibly</p>
        </div>

        <div className="w-full max-w-sm">

          {/* Role Selector */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-700 mb-3 text-center">I want to sign up as a:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('user')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedRole === 'user'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}>
                <FaUser size={20} />
                <span className="text-sm font-medium">User</span>
                <span className="text-xs text-center opacity-70">Schedule pickups & buy products</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('vendor')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedRole === 'vendor'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}>
                <FaStore size={20} />
                <span className="text-sm font-medium">Vendor</span>
                <span className="text-xs text-center opacity-70">Sell recycled & upcycled products</span>
              </button>
            </div>
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 mb-4 shadow-sm">
            <FaGoogle className="text-red-500" size={18} />
            <span className="text-gray-700 font-medium">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-sm">or sign up with email</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
              <input
                type="text"
                placeholder="Full Name"
                name="name"
                className="bg-transparent w-full focus:outline-none text-gray-700"
                required />
            </div>

            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
              <AiOutlineMail className="text-gray-400 h-5 w-5 mr-2 flex-shrink-0" />
              <input
                type="email"
                placeholder="Email address"
                name="email"
                className="bg-transparent w-full focus:outline-none text-gray-700"
                required />
            </div>

            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
              <AiOutlineLock className="text-gray-400 h-5 w-5 mr-2 flex-shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password (min 6 characters)"
                name="password"
                className="bg-transparent w-full focus:outline-none text-gray-700"
                required />
              <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer text-gray-400 ml-2">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
              <AiOutlineLock className="text-gray-400 h-5 w-5 mr-2 flex-shrink-0" />
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmpass"
                className="bg-transparent w-full focus:outline-none text-gray-700"
                required />
            </div>

            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
              <IoMdContact className="text-gray-400 h-5 w-5 mr-2 flex-shrink-0" />
              <input
                type="number"
                placeholder="Contact Number"
                name="contactNumber"
                className="bg-transparent w-full focus:outline-none text-gray-700"
                required />
            </div>

            {errorMessage && (
              <div className="text-center text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-semibold rounded-xl transition duration-200 disabled:opacity-50 ${
                selectedRole === 'vendor'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}>
              {loading ? 'Creating account...' : `Sign up as ${selectedRole === 'vendor' ? 'Vendor' : 'User'}`}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?
            <Link to="/signin" className="text-green-600 font-medium hover:underline ml-1">Sign in</Link>
          </p>
        </div>

        <footer className="text-center text-gray-400 mt-8 text-xs">© SWK Corporate</footer>
      </div>
    </div>
  );
}