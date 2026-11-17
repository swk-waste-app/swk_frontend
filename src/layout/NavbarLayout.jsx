import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useScrollOnNavigate } from './useScrollOnNavigate';

// Shell for the public pages other than the home page.
const NavbarLayout = () => {
  useScrollOnNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default NavbarLayout;
