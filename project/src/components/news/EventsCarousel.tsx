import React from 'react';
import { Carousel } from '../ui/Carousel';
import { events } from '../../data/newsData';
import { Calendar } from 'lucide-react';

export const EventsCarousel = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Cultural Events & Webinars</h2>
      <Carousel>
        {events.map((event) => (
          <div key={event.id} className="flex-none w-full md:w-1/2 lg:w-1/3 px-4">
            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold">{event.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="text-sm text-indigo-600 font-medium">{event.date}</div>
              {event.link && (
                <a
                  href={event.link}
                  className="mt-4 inline-block text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Learn more →
                </a>
              )}
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
};