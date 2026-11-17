import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Spinner } from '../../components/ui';

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
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center" role="status">
            <Spinner className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Signing you in with Google</p>
        </div>
    );
};

export default GoogleCallback;
