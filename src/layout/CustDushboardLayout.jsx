import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGetProfile } from '../services/product';
import SideBar from '../pages/customerDashboard/SideBar';

const CustDushboardLayout = () => {
  const [isloading, setIsLoading] = useState(false);
  const role = localStorage.getItem("role");
  const [profile, setProfile] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
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
  }, [role, navigate]);

  return (
    <>
      {isloading ? (
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