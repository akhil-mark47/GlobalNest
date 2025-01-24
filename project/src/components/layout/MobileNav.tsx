import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const { user, signOut } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex justify-end p-4">
        <button onClick={onClose} className="text-gray-600">
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="px-4 py-2">
        {user ? (
          <div className="space-y-4">
            <Link
              to="/dashboard"
              onClick={onClose}
              className="block py-2 text-gray-700 hover:text-indigo-600"
            >
              Dashboard
            </Link>
            <Link
              to="/housing"
              onClick={onClose}
              className="block py-2 text-gray-700 hover:text-indigo-600"
            >
              Housing
            </Link>
            <Link
              to="/jobs"
              onClick={onClose}
              className="block py-2 text-gray-700 hover:text-indigo-600"
            >
              Jobs
            </Link>
            <Link
              to="/universities"
              onClick={onClose}
              className="block py-2 text-gray-700 hover:text-indigo-600"
            >
              Universities
            </Link>
            <Link
              to="/resources"
              onClick={onClose}
              className="block py-2 text-gray-700 hover:text-indigo-600"
            >
              Library
            </Link>
            <Link
              to="/news-events"
              onClick={onClose}
              className="block py-2 text-gray-700 hover:text-indigo-600"
            >
              News & Events
            </Link>
            <Link
              to="/profile"
              onClick={onClose}
              className="block py-2 text-gray-700 hover:text-indigo-600"
            >
              Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full text-left py-2 text-gray-700 hover:text-indigo-600"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Link
              to="/login"
              onClick={onClose}
              className="block py-2 text-gray-700 hover:text-indigo-600"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={onClose}
              className="block py-2 text-gray-700 hover:text-indigo-600 font-medium"
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};