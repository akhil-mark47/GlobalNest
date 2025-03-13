import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import logoImage from '../../utils/globalnest-logo.png';
export const Footer = () => {
  return (
    <footer className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center space-x-2">
            <img
        src={logoImage}
        alt="GlobalNest Logo"
        className="h-8 w-8"
      />
              <span className="text-xl font-bold text-gray-900">GlobalNest</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Connecting students worldwide for a better study abroad experience.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Resources
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/universities" className="text-base text-gray-500 hover:text-gray-900">
                  Universities
                </Link>
              </li>
              <li>
                <Link to="/housing" className="text-base text-gray-500 hover:text-gray-900">
                  Housing
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-base text-gray-500 hover:text-gray-900">
                  Jobs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/" className="text-base text-gray-500 hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-base text-gray-500 hover:text-gray-900">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            © {new Date().getFullYear()} GlobalNest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};