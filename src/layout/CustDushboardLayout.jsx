import { Suspense, useCallback, useEffect, useState } from 'react';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LuMenu } from 'react-icons/lu';
import { toast } from 'sonner';
import { apiGetProfile } from '../services/product';
import BrandLockup from '../components/BrandLockup';
import NotificationBell from '../components/NotificationBell';
import { Skeleton } from '../components/Skeleton';
import ThemeToggle from '../components/ThemeToggle';
import SideBar from '../pages/customerDashboard/SideBar';

const ADMIN_ONLY_PATHS = ['/adminoverview', '/adminview', '/addEducation'];
const VENDOR_ONLY_PATHS = ['/vendoroverview', '/vendorProduct', '/addProduct', '/editProduct'];

const overviewPathFor = (role) =>
  role === 'admin' ? '/customerDashboard/adminoverview'
  : role === 'vendor' ? '/customerDashboard/vendoroverview'
  : '/customerDashboard/overview';

// The offline API cache holds the signed-in person's data. Drop it with the
// token so the next person on a shared device is never served it.
const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  if ('caches' in window) caches.delete('swk-api').catch(() => {});
};

// Shown in the content area while a page's code is still downloading.
const PageLoading = () => (
  <div className="page" role="status" aria-label="Loading">
    <Skeleton className="h-7 w-48" />
    <Skeleton className="mt-3 h-4 w-72 max-w-full" />
    <Skeleton className="mt-8 h-64 w-full rounded-xl" />
  </div>
);

// The signed-in app shell: sidebar, top bar and the routed page. It also
// guards the routes inside it (signed in, and the right role for the path).
const CustDushboardLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [profile, setProfile] = useState();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Stops a signed-in person of one role from reaching another role's
  // screens by typing the URL.
  const isBlocked =
    (role !== 'admin' && ADMIN_ONLY_PATHS.some((p) => pathname.includes(p))) ||
    (role !== 'vendor' && VENDOR_ONLY_PATHS.some((p) => pathname.includes(p)));

  // Runs on every navigation, so an expired session is noticed on the next
  // click instead of leaving the person on a screen that cannot load.
  useEffect(() => {
    if (!token || isBlocked) return undefined;
    let current = true;
    apiGetProfile()
      .then(({ data }) => { if (current) setProfile(data); })
      .catch((error) => {
        if (!current) return;
        if (error.response?.status === 401) {
          clearSession();
          navigate('/signin');
        } else {
          setProfile((known) => known ?? null);
        }
      });
    return () => { current = false; };
  }, [token, isBlocked, pathname, navigate]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  if (!token) return <Navigate to="/signin" replace />;
  if (isBlocked) return <Navigate to={overviewPathFor(role)} replace />;

  const signOut = () => {
    clearSession();
    toast.success('Signed out');
    navigate('/signin');
  };

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-2.5 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-gray-900 focus:shadow-pop dark:focus:bg-gray-800 dark:focus:text-gray-50"
      >
        Skip to content
      </a>

      <SideBar role={role} profile={profile} open={menuOpen} onClose={closeMenu} onSignOut={signOut} />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="app-sidebar"
            className="btn btn-ghost -ml-2 h-9 w-9 shrink-0 p-0 lg:hidden"
          >
            <LuMenu className="h-5 w-5" aria-hidden="true" />
          </button>
          <Link to={overviewPathFor(role)} className="min-w-0 rounded-lg text-gray-900 dark:text-gray-50 lg:hidden">
            <BrandLockup />
          </Link>
          <div className="ml-auto flex shrink-0 items-center gap-1">
            <ThemeToggle />
            <NotificationBell />
          </div>
        </header>

        <main id="main" tabIndex={-1} key={pathname} className="outline-none">
          <Suspense fallback={<PageLoading />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default CustDushboardLayout;
