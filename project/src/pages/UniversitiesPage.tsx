// Update the UniversitiesPage to include the View Students button
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const universities = [
  {
    id: 1,
    name: 'Stanford University',
    location: 'California, USA',
    acceptanceRate: 4.3,
    annualFees: 55000,
    description: 'A world-renowned private research university.',
  },
  {
    id: 2,
    name: 'Harvard University',
    location: 'Massachusetts, USA',
    acceptanceRate: 5.2,
    annualFees: 57000,
    description:
      'The oldest institution of higher learning in the United States.',
  },
  {
    id: 3,
    name: 'Massachusetts Institute of Technology (MIT)',
    location: 'Massachusetts, USA',
    acceptanceRate: 7.3,
    annualFees: 59000,
    description: 'A globally renowned technological university.',
  },
  {
    id: 4,
    name: 'University of Oxford',
    location: 'Oxford, UK',
    acceptanceRate: 17.5,
    annualFees: 27000,
    description: 'The oldest university in the English-speaking world.',
  },
  {
    id: 5,
    name: 'University of Cambridge',
    location: 'Cambridge, UK',
    acceptanceRate: 21.0,
    annualFees: 28000,
    description: 'A prestigious university known for its academic excellence.',
  },
  {
    id: 6,
    name: 'California Institute of Technology (Caltech)',
    location: 'California, USA',
    acceptanceRate: 6.4,
    annualFees: 56000,
    description: 'A world-class science and engineering institution.',
  },
  {
    id: 7,
    name: 'University of California, Berkeley',
    location: 'California, USA',
    acceptanceRate: 16.1,
    annualFees: 45000,
    description:
      'A public research university with a strong academic reputation.',
  },
  {
    id: 8,
    name: 'University of Chicago',
    location: 'Illinois, USA',
    acceptanceRate: 7.9,
    annualFees: 61000,
    description:
      'A leading research university known for its rigorous academics.',
  },
  {
    id: 9,
    name: 'Princeton University',
    location: 'New Jersey, USA',
    acceptanceRate: 5.8,
    annualFees: 58000,
    description:
      'An Ivy League institution with a strong focus on undergraduate education.',
  },
  {
    id: 10,
    name: 'Yale University',
    location: 'Connecticut, USA',
    acceptanceRate: 6.7,
    annualFees: 60000,
    description: 'An Ivy League university with a rich history and tradition.',
  },
];

export const UniversitiesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUniversities = universities.filter(
    (uni) =>
      uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Universities</h1>

      <div className="mb-8 relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search universities..."
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredUniversities.map((uni) => (
          <div
            key={uni.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{uni.name}</h3>
              <p className="text-gray-600 mb-4">{uni.location}</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Acceptance Rate:</span>
                  <span className="font-medium">{uni.acceptanceRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Annual Fees:</span>
                  <span className="font-medium">
                    ${uni.annualFees.toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">{uni.description}</p>
              <div className="mt-6">
                <Link
                  to={`/universities/${uni.id}/students`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  View Students
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
