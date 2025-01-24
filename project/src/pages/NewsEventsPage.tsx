import React from 'react';
import { NewsCarousel } from '../components/news/NewsCarousel';
import { EventsCarousel } from '../components/news/EventsCarousel';
import { ActivitiesCarousel } from '../components/news/ActivitiesCarousel';

export const NewsEventsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">News & Events</h1>
      <div className="space-y-12">
        <NewsCarousel />
        <EventsCarousel />
        <ActivitiesCarousel />
      </div>
    </div>
  );
};