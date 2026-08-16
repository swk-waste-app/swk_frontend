import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiGetProfile } from '../services/product';
import SideBar from '../pages/customerDashboard/SideBar';

const ADMIN_ONLY_PATHS = ['/adminoverview', '/adminview', '/addEducation'];
const VENDOR_ONLY_PATHS = ['/vendoroverview', '/vendorProduct', '/addProduct', '/editProduct'];

const overviewPathFor = (role) =>
  role === 'admin' ? '/customerDashboard/adminoverview'
  : role === 'vendor' ? '/customerDashboard/vendoroverview'
  : '/customerDashboard/overview';

const CustDushboardLayout = () => {
  const [isloading, setIsLoading] = useState(false);
  const role = localStorage.getItem("role");
  const [profile, setProfile] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    // Prevent a logged-in user of one role from reaching another role's
    // dashboard screens just by typing the URL.
    const isAdminPath = ADMIN_ONLY_PATHS.some(p => location.pathname.includes(p));
    const isVendorPath = VENDOR_ONLY_PATHS.some(p => location.pathname.includes(p));
    if ((isAdminPath && role !== 'admin') || (isVendorPath && role !== 'vendor')) {
      navigate(overviewPathFor(role), { replace: true });
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await apiGetProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/signin");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [role, navigate, location.pathname]);

  const isAdminPath = ADMIN_ONLY_PATHS.some(p => location.pathname.includes(p));
  const isVendorPath = VENDOR_ONLY_PATHS.some(p => location.pathname.includes(p));
  const isBlocked = (isAdminPath && role !== 'admin') || (isVendorPath && role !== 'vendor');

  return (
    <>
      {isloading || isBlocked ? (
        <p>Loading...</p>
      ) : (
        <div className='bg-gray-50 min-h-screen'>
          <SideBar profile={profile} role={role} />
        </div>
      )}
    </>
  );
};

export default CustDushboardLayout;