import Navbar from '../components/Navbar'
import HeroSection from '../pages/landingPage/Hero'
import AboutSection from '../pages/landingPage/InfoPage'
import WasteManagementSection from '../pages/landingPage/WasteSection'
import HowItWorks from '../pages/landingPage/HowItWorks'
import TrashCanPlacement from '../pages/customerDashboard/TrashCanPickup'
import CtaBanner from '../pages/landingPage/CtaBanner'
import Footer from '../components/Footer'

const LandingLayout = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <WasteManagementSection />
      <HowItWorks />
      <TrashCanPlacement />
      <CtaBanner />
      <Footer />
    </div>
  )
}

export default LandingLayout
