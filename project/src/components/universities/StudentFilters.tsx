import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface StudentFiltersProps {
  filters: {
    degree: string;
    batchYear: string;
    status: string;
    course: string;
    search: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onSearchChange: (value: string) => void;
  isMobile: boolean;
}

export const StudentFilters = ({ filters, onFilterChange, onSearchChange, isMobile }: StudentFiltersProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-4'} gap-4`}>
          <select
            value={filters.degree}
            onChange={(e) => onFilterChange('degree', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Degrees</option>
            <option value="bachelors">Bachelor's</option>
            <option value="masters">Master's</option>
            <option value="phd">Ph.D.</option>
          </select>

          <select
            value={filters.batchYear}
            onChange={(e) => onFilterChange('batchYear', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Batch Years</option>
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Status</option>
            <option value="current">Currently Studying</option>
            <option value="passed">Passed Out</option>
          </select>

          <select
            value={filters.course}
            onChange={(e) => onFilterChange('course', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Courses</option>
            <option value="cs">Computer Science</option>
            <option value="business">Business Administration</option>
            <option value="engineering">Engineering</option>
            <option value="arts">Arts</option>
          </select>
        </div>
      </div>
    </div>
  );
};