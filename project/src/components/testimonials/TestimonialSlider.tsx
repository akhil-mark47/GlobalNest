import React from 'react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  university: string;
  content: string;
  image: string;
}

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

export const TestimonialSlider = ({ testimonials }: TestimonialSliderProps) => {
  return (
    <div className="relative">
      <div className="flex overflow-x-auto pb-8 space-x-6 snap-x snap-mandatory scrollbar-hide">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="flex-none w-80 snap-center bg-white rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div className="ml-4">
                <div className="text-lg font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-500">
                  {testimonial.role} at {testimonial.university}
                </div>
              </div>
            </div>
            <p className="text-gray-600 italic">{testimonial.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};