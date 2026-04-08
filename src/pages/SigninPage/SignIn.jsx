import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from 'react-icons/fa';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import { apiLogin } from '../../services/Auth';
import { useNavigate, Link } from 'react-router-dom';
import image1 from '../../assets/images/image1.png';
import logo from '../../assets/images/SWK_LOGO__5_.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);
    try {
      const response = await apiLogin({ email, password });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.accessToken);
        const userRole = response.data.role;
        localStorage.setItem("role", userRole);
        setSuccessMessage('Login successful! Redirecting...');
        // Redirect based on role
        if (userRole === 'admin') {
          navigate("/customerDashboard/adminview");
        } else if (userRole === 'vendor') {
          navigate("/customerDashboard/vendorProduct");
        } else {
          navigate("/customerDashboard/overview");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen relative flex-col md:flex-row">
      <div className="w-full md:w-1/2 h-full overflow-hidden relative">
        <img src={image1} alt="Sign In" className="relative w-full h-full object-cover rounded-r-lg" />
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gray-50 p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="SWKWASTE Logo" className="h-28 w-auto object-contain" />
          <p className="text-lg mb-6">Login to the Portal</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 rounded-lg w-full max-w-sm">
          <div className="mb-4">
            <div className="flex items-center bg-gray-100 rounded-md p-2">
              <AiOutlineMail className="text-gray-500 h-5 w-5 mr-2" />
              <input type="email" placeholder="Email" name="email"
                className="bg-gray-100 w-full focus:outline-none px-2 text-gray-700" required />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center bg-gray-100 rounded-md p-2">
              <AiOutlineLock className="text-gray-500 h-5 w-5 mr-2" />
              <input type={showPassword ? "text" : "password"} placeholder="Password" name="password"
                className="bg-gray-100 w-full focus:outline-none px-2 text-gray-700" required />
              <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer text-gray-500 ml-2">
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>
          {loading && <div className="text-center text-gray-500 mb-4">Loading...</div>}
          {successMessage && <div className="text-center text-green-600 mb-4">{successMessage}</div>}
          {errorMessage && <div className="text-center text-red-600 mb-4">{errorMessage}</div>}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition duration-200 mt-4 disabled:opacity-50">
            {loading ? 'Logging in...' : 'Log in'}
          </button>
          <div className="text-center text-gray-500 mt-4">OR</div>
          <div className="flex justify-between mt-4">
            <button type="button" className="bg-gray-100 flex-1 rounded-md p-2 flex justify-center items-center mx-2">
              <FaGoogle className="h-5 w-5 text-green-600" />
            </button>
            <button type="button" className="bg-gray-100 flex-1 rounded-md p-2 flex justify-center items-center mx-2">
              <FaFacebookF className="h-5 w-5 text-green-600" />
            </button>
          </div>
          <p className="mt-4 text-center text-sm">
            Not a user yet? <Link to="/signup" className="text-green-500">Sign Up</Link>
          </p>
        </form>
        <footer className="text-center text-gray-400 mt-24 text-xs">© SWK Corporate</footer>
      </div>
    </div>
  );
};

export default LoginPage;