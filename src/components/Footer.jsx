import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">About SWKWaste</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              SWKWaste is committed to revolutionizing waste management through sustainable practices. 
              We believe in creating a cleaner, greener future for our communities through innovative 
              recycling solutions and environmental stewardship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/who-we-are" className="hover:text-green-400 transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/signin" className="hover:text-green-400 transition-colors duration-300">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/customerDashboard/blogs" className="hover:text-green-400 transition-colors duration-300">
                  Blog & News
                </Link>
              </li>
              <li>
                <Link to="/signin" className="hover:text-green-400 transition-colors duration-300">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/swkwaste"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-400 transition-colors duration-300"
              >
                <FaTwitter className="text-2xl" />
              </a>
              <a
                href="https://linkedin.com/company/swkwaste"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-400 transition-colors duration-300"
              >
                <FaLinkedin className="text-2xl" />
              </a>
              <a
                href="https://instagram.com/swkwaste"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-400 transition-colors duration-300"
              >
                <FaInstagram className="text-2xl" />
              </a>
              <a
                href="https://facebook.com/swkwaste"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-400 transition-colors duration-300"
              >
                <FaFacebook className="text-2xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-green-700 text-center text-sm text-gray-300">
          <p>© {new Date().getFullYear()} SWKWaste. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;