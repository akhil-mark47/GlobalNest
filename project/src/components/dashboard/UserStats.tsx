import React from 'react';
import { Home, Briefcase, Users } from 'lucide-react';

interface UserStatsProps {
  housingCount: number;
  jobsCount: number;
  connectionsCount: number;
}

export const UserStats = ({ housingCount, jobsCount, connectionsCount }: UserStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <Home className="h-8 w-8 text-indigo-600" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Housing Posts</p>
            <p className="text-2xl font-semibold">{housingCount}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <Briefcase className="h-8 w-8 text-indigo-600" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Job Posts</p>
            <p className="text-2xl font-semibold">{jobsCount}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-indigo-600" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Connections</p>
            <p className="text-2xl font-semibold">{connectionsCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};