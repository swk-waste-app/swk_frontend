import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaGoogle, FaUser, FaStore } from 'react-icons/fa';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import { apiLogin } from '../../services/Auth';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import image1 from '../../assets/images/image1.png';
import logo from '../../assets/images/SWK_LOGO__5_.png';

const BACKEND_URL = 'https://swk-backend.onrender.com';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(searchParams.get('error') === 'google_failed' ? 'Google sign-in failed. Please try again.' : '');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');

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
        if (userRole === 'admin') {
          navigate("/customerDashboard/adminoverview");
        } else if (userRole === 'vendor') {
          navigate("/customerDashboard/vendoroverview");
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

  const handleGoogleLogin = () => {
    localStorage.setItem('pendingRole', selectedRole);
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Image */}
      <div className="hidden md:block w-1/2 h-screen overflow-hidden">
        <img src={image1} alt="Sign In" className="w-full h-full object-cover" />
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gray-50 p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Taka Kipawa Logo" className="h-24 w-auto object-contain" />
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <div className="w-full max-w-sm">

          {/* Role Selector */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3 text-center">I am signing in as a:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('user')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedRole === 'user'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}>
                <FaUser size={24} />
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
                <FaStore size={24} />
                <span className="text-sm font-medium">Vendor</span>
                <span className="text-xs text-center opacity-70">Sell recycled & upcycled products</span>
              </button>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 mb-4 shadow-sm">
            <FaGoogle className="text-red-500" size={18} />
            <span className="text-gray-700 font-medium">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-sm">or sign in with email</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Password"
                name="password"
                className="bg-transparent w-full focus:outline-none text-gray-700"
                required />
              <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer text-gray-400 ml-2">
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            {loading && <div className="text-center text-gray-500 text-sm">Signing in...</div>}
            {successMessage && <div className="text-center text-green-600 text-sm bg-green-50 p-2 rounded-lg">{successMessage}</div>}
            {errorMessage && <div className="text-center text-red-600 text-sm bg-red-50 p-2 rounded-lg">{errorMessage}</div>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-semibold rounded-xl transition duration-200 disabled:opacity-50 ${
                selectedRole === 'vendor'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}>
              {loading ? 'Signing in...' : `Sign in as ${selectedRole === 'vendor' ? 'Vendor' : 'User'}`}
            </button>
          </form>

          {/* Sign Up Links */}
          <div className="mt-6 space-y-2 text-center text-sm">
            {selectedRole === 'user' ? (
              <p className="text-gray-600">
                New user? <Link to="/signup" className="text-green-600 font-medium hover:underline">Create account</Link>
              </p>
            ) : (
              <p className="text-gray-600">
                New vendor? <Link to="/vendorsignup" className="text-purple-600 font-medium hover:underline">Register as vendor</Link>
              </p>
            )}
            <p className="text-gray-600">
              Are you an admin? <Link to="/AdminLogin" className="text-gray-500 hover:underline">Admin login</Link>
            </p>
          </div>
        </div>

        <footer className="text-center text-gray-400 mt-12 text-xs">© SWK Corporate</footer>
      </div>
    </div>
  );
};

export default LoginPage;