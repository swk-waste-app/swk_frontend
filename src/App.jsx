import { lazy, Suspense, useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import OfflineBanner from './components/OfflineBanner'
import { ConfirmHost, Spinner } from './components/ui'

const LandingLayout = lazy(() => import('./layout/LandingLayout'))
const NavbarLayout = lazy(() => import('./layout/NavbarLayout'))
const CustDushboardLayout = lazy(() => import('./layout/CustDushboardLayout'))

// Public pages
const AboutUsPage = lazy(() => import('./pages/WhoWeAre'))
const BlogsPage = lazy(() => import('./pages/blogs/BlogsPage'))
const EducationHub = lazy(() => import('./pages/education/EducationHub'))
const EducationDetail = lazy(() => import('./pages/education/EducationDetail'))
const DirectionPage = lazy(() => import('./pages/directionPage/Direction'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Sign-in, sign-up and account setup
const SignIn = lazy(() => import('./pages/SigninPage/SignIn'))
const Signup = lazy(() => import('./pages/signupPage/Signup'))
const GoogleCallback = lazy(() => import('./pages/auth/GoogleCallback'))
const AdminSetup = lazy(() => import('./pages/adminDashboard/AdminSetup'))

// Signed-in pages
const Overview = lazy(() => import('./pages/customerDashboard/Overview'))
const WasteSection = lazy(() => import('./pages/customerDashboard/Waste'))
const WasteSchedulePage = lazy(() => import('./pages/customerDashboard/DatePicker'))
const WasteEditPage = lazy(() => import('./pages/customerDashboard/EditDatePicker'))
const ScheduleDetailPage = lazy(() => import('./pages/customerDashboard/ScheduleDetailPage'))
const WasteScanner = lazy(() => import('./pages/ai/WasteScanner'))
const ArticlePage = lazy(() => import('./pages/blogs/ArticlesPage'))
const CustomerPage = lazy(() => import('./pages/recyclePage/CustomerPage'))
const ProductDetailPage = lazy(() => import('./pages/recyclePage/ProductDetail'))
const VendorStorefront = lazy(() => import('./pages/recyclePage/VendorStorefront'))
const VendorDashboard = lazy(() => import('./pages/recyclePage/vendorDashboard'))
const VendorView = lazy(() => import('./pages/recyclePage/VendorFetch'))
const ProductForm = lazy(() => import('./pages/recyclePage/AddProductForm'))
const EditProductForm = lazy(() => import('./pages/recyclePage/EditProductForm'))
const AdminOverview = lazy(() => import('./pages/adminDashboard/AdminOverview'))
const AdminDashboard = lazy(() => import('./pages/adminDashboard/AdminDashboard'))
const AddEducationForm = lazy(() => import('./pages/education/AddEducationForm'))

const router = createBrowserRouter([
  { path: '/', element: <LandingLayout /> },
  {
    path: '/',
    element: <NavbarLayout />,
    children: [
      { path: 'who-we-are', element: <AboutUsPage /> },
      { path: 'blog', element: <BlogsPage /> },
      { path: 'education', element: <EducationHub /> },
      { path: 'education/:id', element: <EducationDetail /> },
    ],
  },
  { path: '/s', element: <DirectionPage /> },

  // One sign-in screen for every role; /login and /admin are older addresses for it.
  { path: '/signin', element: <SignIn /> },
  { path: '/login', element: <SignIn /> },
  { path: '/admin', element: <SignIn /> },
  // One sign-up screen; /vendorsignup opens it with the vendor account type selected.
  { path: '/signup', element: <Signup /> },
  { path: '/vendorsignup', element: <Signup key="vendor" defaultType="vendor" /> },
  { path: '/auth/callback', element: <GoogleCallback /> },
  { path: '/swk-admin-setup', element: <AdminSetup /> },

  {
    path: '/customerDashboard',
    element: <CustDushboardLayout />,
    children: [
      { path: 'overview', element: <Overview /> },
      { path: 'pickup', element: <WasteSection /> },
      { path: 'wpickup', element: <WasteSchedulePage /> },
      { path: 'schedule/:id', element: <ScheduleDetailPage /> },
      { path: 'editSchedule/:id', element: <WasteEditPage /> },
      { path: 'scan', element: <WasteScanner /> },
      { path: 'blogs', element: <BlogsPage /> },
      { path: 'articles', element: <ArticlePage /> },
      { path: 'products', element: <CustomerPage /> },
      { path: 'product/:id', element: <ProductDetailPage /> },
      { path: 'store/:vendorId', element: <VendorStorefront /> },
      { path: 'vendoroverview', element: <VendorDashboard /> },
      { path: 'vendorProduct', element: <VendorView /> },
      { path: 'addProduct', element: <ProductForm /> },
      { path: 'editProduct/:id', element: <EditProductForm /> },
      { path: 'adminoverview', element: <AdminOverview /> },
      { path: 'adminview', element: <AdminDashboard /> },
      { path: 'addEducation', element: <AddEducationForm /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])

const PageLoading = () => (
  <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Loading">
    <Spinner className="h-6 w-6 text-gray-400 dark:text-gray-500" />
  </div>
)

// Keeps the toast theme in sync with the dark-mode toggle (which dispatches
// a 'swk-theme' event whenever the user flips it).
const ThemedToaster = () => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    const onTheme = (e) => setDark(Boolean(e.detail?.dark))
    window.addEventListener('swk-theme', onTheme)
    return () => window.removeEventListener('swk-theme', onTheme)
  }, [])
  return <Toaster position="top-right" richColors closeButton theme={dark ? 'dark' : 'light'} />
}

function App() {
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <RouterProvider router={router} />
      </Suspense>
      <ThemedToaster />
      <ConfirmHost />
      <OfflineBanner />
    </>
  )
}

export default App
