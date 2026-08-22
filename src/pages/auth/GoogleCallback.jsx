import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Lands here after the backend finishes Google sign-in. Credentials arrive in
// the URL fragment (#token=...&role=...&name=...) so they are never sent to the
// server hosting this page; the ?query form is still accepted for backwards
// compatibility during deploys.
const readCallbackParams = (searchParams) => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    return {
        token: hash.get('token') || searchParams.get('token'),
        role: hash.get('role') || searchParams.get('role'),
        name: hash.get('name') || searchParams.get('name'),
    };
};

const GoogleCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const handled = useRef(false);

    useEffect(() => {
        // React StrictMode re-runs effects in development; only act once.
        if (handled.current) return;
        handled.current = true;

        const { token, role } = readCallbackParams(searchParams);

        if (token && role) {
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.removeItem('pendingRole');

            // navigate(..., { replace: true }) replaces this history entry, so the
            // URL carrying the credentials does not stay in the browser history.
            if (role === 'admin') {
                navigate('/customerDashboard/adminoverview', { replace: true });
            } else if (role === 'vendor') {
                navigate('/customerDashboard/vendoroverview', { replace: true });
            } else {
                navigate('/customerDashboard/overview', { replace: true });
            }
        } else {
            navigate('/signin?error=google_failed&reason=state_missing', { replace: true });
        }
    }, [navigate, searchParams]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Signing you in with Google...</p>
            </div>
        </div>
    );
};

export default GoogleCallback;
