import React from 'react';
import { Carousel } from '../ui/Carousel';
import { newsItems } from '../../data/newsData';
import { Newspaper } from 'lucide-react';

export const NewsCarousel = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest News</h2>
      <Carousel>
        {newsItems.map((item) => (
          <div key={item.id} className="flex-none w-full md:w-1/2 lg:w-1/3 px-4">
            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
              <div className="flex items-center mb-4">
                <Newspaper className="h-6 w-6 text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold">{item.title}</h3>
              </div>
              <p className="text-gray-600">{item.description}</p>
              <div className="mt-4 text-sm text-gray-500">{item.date}</div>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
};