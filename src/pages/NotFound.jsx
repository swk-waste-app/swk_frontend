import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="text-8xl font-bold text-green-600 mb-2">404</div>
            <div className="text-5xl mb-6">♻️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Page not found</h1>
            <p className="text-gray-500 mb-8 max-w-sm">
                Looks like this page was recycled. Let&#39;s get you back on track.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 border border-green-600 text-green-600 rounded-xl font-medium hover:bg-green-50 transition-colors">
                    Go Back
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors">
                    Home
                </button>
            </div>
        </div>
    );
};

export default NotFound;
