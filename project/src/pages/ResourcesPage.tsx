import React from 'react';
import { VisaGuides } from '../components/resources/VisaGuides';
import { PackingGuides } from '../components/resources/PackingGuides';
import { CountryGuides } from '../components/resources/CountryGuides';

export const ResourcesPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Resources Library</h1>
      <div className="space-y-12">
        <VisaGuides />
        <PackingGuides />
        <CountryGuides />
      </div>
    </div>
  );
};