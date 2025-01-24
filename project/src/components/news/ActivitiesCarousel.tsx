import React from 'react';
import { Carousel } from '../ui/Carousel';
import { activities } from '../../data/newsData';
import { Users } from 'lucide-react';

export const ActivitiesCarousel = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Group Activities</h2>
      <Carousel>
        {activities.map((activity) => (
          <div key={activity.id} className="flex-none w-full md:w-1/2 lg:w-1/3 px-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
              {activity.image && (
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 text-indigo-600 mr-2" />
                  <h3 className="text-lg font-semibold">{activity.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{activity.description}</p>
                <div className="text-sm text-indigo-600 font-medium">{activity.date}</div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
};