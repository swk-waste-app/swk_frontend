import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NavbarLayout = () => {
  return (
    <div>
      <Navbar forceSolid />
      <div className="pt-[68px]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default NavbarLayout;
