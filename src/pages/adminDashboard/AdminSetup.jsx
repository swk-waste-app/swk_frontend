import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCreateAdmin } from '../../services/Auth';
import logo from '../../assets/images/SWK_LOGO__5_.png';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import { FaEye, FaEyeSlash, FaUserShield } from 'react-icons/fa';

const AdminSetup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const name = form.get('name').trim();
        const email = form.get('email').trim();
        const password = form.get('password');
        const secret = form.get('secret').trim();

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await apiCreateAdmin({ name, email, password }, secret);
            setSuccess('Admin account created! Redirecting to login...');
            setTimeout(() => navigate('/signin'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create admin. Check your secret key.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

                <div className="flex flex-col items-center mb-8">
                    <img src={logo} alt="Logo" className="h-16 w-auto object-contain mb-3" />
                    <div className="flex items-center gap-2 text-gray-700">
                        <FaUserShield className="text-green-600" size={20} />
                        <h1 className="text-xl font-bold">Admin Account Setup</h1>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">This page is not publicly linked</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-3">
                        <FaUserShield className="text-gray-400 w-5 h-5 mr-2 flex-shrink-0" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full name"
                            required
                            className="bg-transparent w-full focus:outline-none text-gray-700 text-sm"
                        />
                    </div>

                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-3">
                        <AiOutlineMail className="text-gray-400 w-5 h-5 mr-2 flex-shrink-0" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            required
                            className="bg-transparent w-full focus:outline-none text-gray-700 text-sm"
                        />
                    </div>

                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-3">
                        <AiOutlineLock className="text-gray-400 w-5 h-5 mr-2 flex-shrink-0" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password (min 6 chars)"
                            required
                            minLength={6}
                            className="bg-transparent w-full focus:outline-none text-gray-700 text-sm"
                        />
                        <button type="button" onClick={() => setShowPassword(p => !p)} className="text-gray-400 ml-2">
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>

                    <div className="flex items-center bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                        <AiOutlineLock className="text-yellow-500 w-5 h-5 mr-2 flex-shrink-0" />
                        <input
                            type="password"
                            name="secret"
                            placeholder="Admin secret key"
                            required
                            className="bg-transparent w-full focus:outline-none text-gray-700 text-sm"
                        />
                    </div>
                    <p className="text-xs text-gray-400 -mt-2 pl-1">Enter the secret key set in your backend environment</p>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 text-green-600 text-sm p-3 rounded-xl border border-green-100">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors disabled:opacity-50">
                        {loading ? 'Creating...' : 'Create Admin Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminSetup;
