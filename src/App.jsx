import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Overview from './pages/customerDashboard/Overview'
import GoogleCallback from './pages/auth/GoogleCallback'
import VendorDashboard from './pages/recyclePage/vendorDashboard'
import LoginPage from './pages/SigninPage/SignIn'
import SignupPage from './pages/signupPage/Signup'
import LandingLayout from './layout/LandingLayout'
import CustDushboardLayout from './layout/CustDushboardLayout'
import BlogsPage from './pages/blogs/BlogsPage'
import AboutUsPage from './pages/WhoWeAre'
import DirectionPage from './pages/directionPage/Direction'
import CustomerPage from './pages/recyclePage/CustomerPage'
import Login from './pages/recyclePage/VendorSignin'
import Signup from './pages/recyclePage/vendorSignUp'
import WasteSection from './pages/customerDashboard/Waste'
import ProductForm from './pages/recyclePage/AddProductForm'
import VendorView from './pages/recyclePage/VendorFetch'
import ArticlePage from './pages/blogs/ArticlesPage'
import WasteSchedulePage from './pages/customerDashboard/DatePicker'
import WasteEditPage from './pages/customerDashboard/EditDatePicker'
import AdminDashboard from './pages/adminDashboard/AdminDashboard'
import AdminOverview from './pages/adminDashboard/AdminOverview'
import AdminSignup from './pages/adminDashboard/AdminSignUp'
import AdminLogin from './pages/adminDashboard/AdminSignin'
import ProductDetailPage from './pages/recyclePage/ProductDetail'
import ScheduleDetailPage from './pages/customerDashboard/ScheduleDetailPage'
import EditProductForm from './pages/recyclePage/EditProductForm'

const router = createBrowserRouter([
  { path: "/s", element: <DirectionPage/> },
  { path: "/signin", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage/> },
  { path: "/auth/callback", element: <GoogleCallback /> },
  { path: "/", element: <LandingLayout /> },
  { path: "/who-we-are", element: <AboutUsPage /> },
  { path: "/login", element: <Login /> },
  { path: "/vendorsignup", element: <Signup /> },
  { path: "/Adminsignup", element: <AdminSignup /> },
  { path: "/AdminLogin", element: <AdminLogin /> },
  {
    path: "/customerDashboard",
    element: <CustDushboardLayout/>,
    children: [
      { path: "overview", element: <Overview /> },
      { path: "adminoverview", element: <AdminOverview /> },
      { path: "vendoroverview", element: <VendorDashboard /> },
      { path: "blogs", element: <BlogsPage /> },
      { path: "articles", element: <ArticlePage /> },
      { path: "products", element: <CustomerPage /> },
      { path: "pickup", element: <WasteSection /> },
      { path: "vendorProduct", element: <VendorView/> },
      { path: "wpickup", element: <WasteSchedulePage /> },
      { path: "addProduct", element: <ProductForm /> },
      { path: "editProduct/:id", element: <EditProductForm/> },
      { path: "adminview", element: <AdminDashboard /> },
      { path: "product/:id", element: <ProductDetailPage/> },
      { path: "schedule/:id", element: <ScheduleDetailPage/> },
      { path: "editSchedule/:id", element: <WasteEditPage/> },
    ]
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
