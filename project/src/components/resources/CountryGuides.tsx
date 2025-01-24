import React from 'react';
import { countryGuides } from '../../data/resourcesData';
import { Globe, Building2, Heart } from 'lucide-react';

export const CountryGuides = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Country-Specific Guides</h2>
      <div className="grid gap-6 lg:grid-cols-2">
        {countryGuides.map((country) => (
          <div key={country.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Globe className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-xl font-semibold">{country.name}</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium flex items-center mb-2">
                  <Building2 className="h-5 w-5 text-indigo-600 mr-2" />
                  Banking
                </h4>
                <p className="text-gray-600">{country.banking}</p>
              </div>
              <div>
                <h4 className="font-medium flex items-center mb-2">
                  <Heart className="h-5 w-5 text-indigo-600 mr-2" />
                  Healthcare
                </h4>
                <p className="text-gray-600">{country.healthcare}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};