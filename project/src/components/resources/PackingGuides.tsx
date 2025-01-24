import React from 'react';
import { packingGuides } from '../../data/resourcesData';
import { CheckSquare } from 'lucide-react';

export const PackingGuides = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Packing Lists & Travel Essentials</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {packingGuides.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">{category.title}</h3>
            <ul className="space-y-3">
              {category.items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};