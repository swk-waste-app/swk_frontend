import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../pages/landingPage/Hero';
import HowItWorks from '../pages/landingPage/HowItWorks';
import Features from '../pages/landingPage/Features';
import VendorSection from '../pages/landingPage/VendorSection';
import CtaBanner from '../pages/landingPage/CtaBanner';
import { useScrollOnNavigate } from './useScrollOnNavigate';

const LandingLayout = () => {
  useScrollOnNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />
        <VendorSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
};

export default LandingLayout;
