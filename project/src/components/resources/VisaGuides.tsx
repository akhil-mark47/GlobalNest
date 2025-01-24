import React from 'react';
import { visaGuides } from '../../data/resourcesData';
import { FileText } from 'lucide-react';

export const VisaGuides = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Visa Application Guides</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visaGuides.map((guide) => (
          <div key={guide.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold">{guide.country}</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              {guide.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  {req}
                </li>
              ))}
            </ul>
            <div className="mt-4 text-sm text-gray-500">
              Processing time: {guide.processingTime}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};