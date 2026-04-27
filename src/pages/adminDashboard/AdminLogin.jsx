import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiLogin } from '../../services/Auth';
import logo from '../../assets/images/SWK_LOGO__5_.png';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import { FaEye, FaEyeSlash, FaUserShield } from 'react-icons/fa';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        setError('');
        setLoading(true);
        try {
            const response = await apiLogin({
                email: form.get('email'),
                password: form.get('password'),
            });
            const { accessToken, role } = response.data;
            if (role !== 'admin') {
                setError('Access denied. This portal is for admins only.');
                return;
            }
            localStorage.setItem('token', accessToken);
            localStorage.setItem('role', role);
            navigate('/customerDashboard/adminoverview');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md">

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-green-800 to-green-600 p-8 flex flex-col items-center">
                        <img src={logo} alt="Logo" className="h-16 w-auto object-contain mb-4" />
                        <div className="flex items-center gap-2 text-white">
                            <FaUserShield size={18} />
                            <span className="font-bold text-lg tracking-wide">Admin Portal</span>
                        </div>
                        <p className="text-green-200 text-xs mt-1">Taka Kipawa — SWK Ghana</p>
                    </div>

                    {/* Form */}
                    <div className="p-8 space-y-4">
                        <p className="text-gray-500 text-sm text-center">Sign in with your admin credentials</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-3">
                                <AiOutlineMail className="text-gray-400 w-5 h-5 mr-2 flex-shrink-0" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Admin email"
                                    required
                                    className="bg-transparent w-full focus:outline-none text-gray-700 text-sm"
                                />
                            </div>

                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-3">
                                <AiOutlineLock className="text-gray-400 w-5 h-5 mr-2 flex-shrink-0" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Password"
                                    required
                                    className="bg-transparent w-full focus:outline-none text-gray-700 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(p => !p)}
                                    className="text-gray-400 ml-2 hover:text-gray-600">
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-xl">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors disabled:opacity-50">
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                    </div>
                </div>

                <p className="text-center text-gray-600 text-xs mt-6">© SWK Ghana Corporate</p>
            </div>
        </div>
    );
};

export default AdminLogin;
