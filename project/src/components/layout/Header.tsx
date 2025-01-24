import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Globe, LogOut, Menu } from 'lucide-react';
import { MobileNav } from './MobileNav';

export const Header = () => {
  const { user, signOut } = useAuthStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600';
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
          <img
        src="src\utils\Global Nest Inc..png"
        alt="GlobalNest Logo"
        className="h-8 w-8"
      />
            <span className="text-xl font-bold text-gray-900">GlobalNest</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className={isActive('/dashboard')}>
                  Dashboard
                </Link>
                <Link to="/housing" className={isActive('/housing')}>
                  Housing
                </Link>
                <Link to="/jobs" className={isActive('/jobs')}>
                  Jobs
                </Link>
                <Link to="/universities" className={isActive('/universities')}>
                  Universities
                </Link>
                <Link to="/resources" className={isActive('/resources')}>
                  Library
                </Link>
                <Link to="/news-events" className={isActive('/news-events')}>
                  News & Events
                </Link>
                <Link to="/profile" className={isActive('/profile')}>
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={isActive('/login')}>
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile navigation */}
          <MobileNav 
            isOpen={isMobileMenuOpen} 
            onClose={() => setIsMobileMenuOpen(false)} 
          />
        </div>
      </div>
    </header>
  );
};