import HeroSection from '../pages/landingPage/Hero'
import AboutSection from '../pages/landingPage/InfoPage'
import WasteManagementSection from '../pages/landingPage/WasteSection'
import TrashCanPlacement from '../pages/customerDashboard/TrashCanPickup'
import Footer from '../components/Footer'
const LandingLayout = () => {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <WasteManagementSection />
      <TrashCanPlacement />
      <Footer />
    </div>
  )
}

export default LandingLayout
