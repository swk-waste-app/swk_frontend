import './App.css'
import { lazy, Suspense, useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import OfflineBanner from './components/OfflineBanner'

const Overview         = lazy(() => import('./pages/customerDashboard/Overview'))
const GoogleCallback   = lazy(() => import('./pages/auth/GoogleCallback'))
const VendorDashboard  = lazy(() => import('./pages/recyclePage/vendorDashboard'))
const LoginPage        = lazy(() => import('./pages/SigninPage/SignIn'))
const SignupPage        = lazy(() => import('./pages/signupPage/Signup'))
const LandingLayout    = lazy(() => import('./layout/LandingLayout'))
const CustDushboardLayout = lazy(() => import('./layout/CustDushboardLayout'))
const BlogsPage        = lazy(() => import('./pages/blogs/BlogsPage'))
const NavbarLayout     = lazy(() => import('./layout/NavbarLayout'))
const EducationHub     = lazy(() => import('./pages/education/EducationHub'))
const EducationDetail  = lazy(() => import('./pages/education/EducationDetail'))
const AddEducationForm = lazy(() => import('./pages/education/AddEducationForm'))
const AboutUsPage      = lazy(() => import('./pages/WhoWeAre'))
const DirectionPage    = lazy(() => import('./pages/directionPage/Direction'))
const CustomerPage     = lazy(() => import('./pages/recyclePage/CustomerPage'))
const Login            = lazy(() => import('./pages/recyclePage/VendorSignin'))
const Signup           = lazy(() => import('./pages/recyclePage/vendorSignUp'))
const WasteSection     = lazy(() => import('./pages/customerDashboard/Waste'))
const ProductForm      = lazy(() => import('./pages/recyclePage/AddProductForm'))
const VendorView       = lazy(() => import('./pages/recyclePage/VendorFetch'))
const ArticlePage      = lazy(() => import('./pages/blogs/ArticlesPage'))
const WasteSchedulePage = lazy(() => import('./pages/customerDashboard/DatePicker'))
const WasteEditPage    = lazy(() => import('./pages/customerDashboard/EditDatePicker'))
const AdminDashboard   = lazy(() => import('./pages/adminDashboard/AdminDashboard'))
const AdminOverview    = lazy(() => import('./pages/adminDashboard/AdminOverview'))
const ProductDetailPage = lazy(() => import('./pages/recyclePage/ProductDetail'))
const ScheduleDetailPage = lazy(() => import('./pages/customerDashboard/ScheduleDetailPage'))
const EditProductForm  = lazy(() => import('./pages/recyclePage/EditProductForm'))
const VendorStorefront = lazy(() => import('./pages/recyclePage/VendorStorefront'))
const AdminSetup       = lazy(() => import('./pages/adminDashboard/AdminSetup'))
const AdminLoginPage   = lazy(() => import('./pages/adminDashboard/AdminLogin'))
const NotFound         = lazy(() => import('./pages/NotFound'))
const WasteScanner     = lazy(() => import('./pages/ai/WasteScanner'))

const Spinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
  </div>
)

const router = createBrowserRouter([
  { path: "/s", element: <DirectionPage/> },
  { path: "/signin", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage/> },
  { path: "/auth/callback", element: <GoogleCallback /> },
  { path: "/", element: <LandingLayout /> },
  {
    path: "/",
    element: <NavbarLayout />,
    children: [
      { path: "who-we-are", element: <AboutUsPage /> },
      { path: "blog", element: <BlogsPage /> },
      { path: "education", element: <EducationHub /> },
      { path: "education/:id", element: <EducationDetail /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/vendorsignup", element: <Signup /> },
  { path: "/swk-admin-setup", element: <AdminSetup /> },
  { path: "/admin", element: <AdminLoginPage /> },
  {
    path: "/customerDashboard",
    element: <CustDushboardLayout/>,
    children: [
      { path: "overview", element: <Overview /> },
      { path: "scan", element: <WasteScanner /> },
      { path: "adminoverview", element: <AdminOverview /> },
      { path: "vendoroverview", element: <VendorDashboard /> },
      { path: "blogs", element: <BlogsPage /> },
      { path: "articles", element: <ArticlePage /> },
      { path: "products", element: <CustomerPage /> },
      { path: "pickup", element: <WasteSection /> },
      { path: "vendorProduct", element: <VendorView/> },
      { path: "wpickup", element: <WasteSchedulePage /> },
      { path: "addProduct", element: <ProductForm /> },
      { path: "addEducation", element: <AddEducationForm /> },
      { path: "editProduct/:id", element: <EditProductForm/> },
      { path: "adminview", element: <AdminDashboard /> },
      { path: "product/:id", element: <ProductDetailPage/> },
      { path: "schedule/:id", element: <ScheduleDetailPage/> },
      { path: "editSchedule/:id", element: <WasteEditPage/> },
      { path: "store/:vendorId", element: <VendorStorefront /> },
    ]
  },
  { path: "*", element: <NotFound /> },
])

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
    <Suspense fallback={<Spinner />}>
      <RouterProvider router={router} />
      <ThemedToaster />
      <OfflineBanner />
    </Suspense>
  )
}

export default App
