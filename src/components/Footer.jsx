import { Link } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaInstagram, FaFacebook, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import logo from '../assets/images/SWK_LOGO__5_.png';

const Footer = () => {
  return (
    <footer className="bg-green-950 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 pr-0 md:pr-8">
            <img src={logo} alt="Taka Kipawa" className="h-14 w-auto object-contain bg-white rounded-lg p-1.5" />
            <p className="text-green-100/80 text-sm leading-relaxed mt-5 max-w-sm">
              Taka Kipawa is committed to revolutionizing waste management through sustainable practices &mdash;
              building a cleaner, greener future for Ghanaian communities through recycling and upcycling.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { icon: FaTwitter, href: 'https://twitter.com/swkwaste', label: 'Twitter' },
                { icon: FaLinkedin, href: 'https://linkedin.com/company/swkwaste', label: 'LinkedIn' },
                { icon: FaInstagram, href: 'https://instagram.com/swkwaste', label: 'Instagram' },
                { icon: FaFacebook, href: 'https://facebook.com/swkwaste', label: 'Facebook' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-green-500 transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-green-300 mb-5">Quick Links</h3>
            <ul className="space-y-3 text-green-100/80 text-sm">
              <li><Link to="/who-we-are" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/#services" className="hover:text-white transition-colors">Our Services</Link></li>
              <li><Link to="/education" className="hover:text-white transition-colors">Education &amp; Awareness</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog &amp; News</Link></li>
              <li><Link to="/signup" className="hover:text-white transition-colors">Get Started</Link></li>
              <li><Link to="/vendorsignup" className="hover:text-white transition-colors">Become a Vendor</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-green-300 mb-5">Get in Touch</h3>
            <ul className="space-y-3 text-green-100/80 text-sm">
              <li className="flex items-start gap-2.5">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-green-400" size={14} />
                Kipawa, Accra &mdash; Ghana
              </li>
              <li>
                <a href="mailto:info@swkghana.org" className="flex items-start gap-2.5 hover:text-white transition-colors">
                  <FaEnvelope className="mt-1 shrink-0 text-green-400" size={14} />
                  info@swkghana.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-green-100/60">
          <p>&copy; {new Date().getFullYear()} Taka Kipawa (SWK Ghana). All rights reserved.</p>
          <p>Sustainability with Koomson &mdash; Reduce &bull; Reuse &bull; Recycle</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
