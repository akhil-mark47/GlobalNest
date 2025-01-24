import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Briefcase, Users } from 'lucide-react';
import { ProfileSidebar } from '../components/dashboard/ProfileSidebar';

export const DashboardPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <ProfileSidebar />
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/housing" className="block">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                  <Home className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold mb-4">Housing</h2>
                <p className="text-gray-600">Find or list housing opportunities near your university.</p>
              </div>
            </Link>

            <Link to="/jobs" className="block">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold mb-4">Jobs</h2>
                <p className="text-gray-600">Browse available jobs and internships in your area.</p>
              </div>
            </Link>

            <Link to="/community" className="block">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold mb-4">Community</h2>
                <p className="text-gray-600">Connect with fellow students and join local events.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};