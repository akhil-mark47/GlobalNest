import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  type: 'housing' | 'jobs';
}

export const SearchFilters = ({ 
  searchTerm, 
  onSearchChange, 
  filters, 
  onFilterChange,
  type 
}: SearchFiltersProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${type === 'housing' ? 'housing' : 'jobs'}...`}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {type === 'housing' && (
            <>
              <div className="w-48">
                <select
                  value={filters.priceRange || ''}
                  onChange={(e) => onFilterChange('priceRange', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Price Range</option>
                  <option value="0-500">$0 - $500</option>
                  <option value="501-1000">$501 - $1000</option>
                  <option value="1001-2000">$1001 - $2000</option>
                  <option value="2001+">$2001+</option>
                </select>
              </div>

              <div className="w-48">
                <input
                  type="date"
                  value={filters.availableFrom || ''}
                  onChange={(e) => onFilterChange('availableFrom', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Available From"
                />
              </div>
            </>
          )}

          {type === 'jobs' && (
            <>
              <div className="w-48">
                <select
                  value={filters.jobType || ''}
                  onChange={(e) => onFilterChange('jobType', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Job Type</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              <div className="w-48">
                <select
                  value={filters.salaryRange || ''}
                  onChange={(e) => onFilterChange('salaryRange', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Salary Range</option>
                  <option value="0-30000">$0 - $30,000</option>
                  <option value="30001-50000">$30,001 - $50,000</option>
                  <option value="50001-80000">$50,001 - $80,000</option>
                  <option value="80001+">$80,001+</option>
                </select>
              </div>
            </>
          )}

          <button
            onClick={() => {
              onFilterChange('priceRange', '');
              onFilterChange('availableFrom', '');
              onFilterChange('jobType', '');
              onFilterChange('salaryRange', '');
              onSearchChange('');
            }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};