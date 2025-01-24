import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  children: React.ReactNode[];
}

export const Carousel = ({ children }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const scrollAmount = container.clientWidth;
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const newIndex = Math.round(newScrollLeft / scrollAmount);
    setCurrentIndex(Math.max(0, Math.min(newIndex, children.length - 1)));
  };

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>

      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="h-6 w-6 text-gray-600" />
      </button>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
        disabled={currentIndex === children.length - 1}
      >
        <ChevronRight className="h-6 w-6 text-gray-600" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {children.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
            onClick={() => {
              if (scrollRef.current) {
                const scrollAmount = scrollRef.current.clientWidth;
                scrollRef.current.scrollTo({
                  left: index * scrollAmount,
                  behavior: 'smooth'
                });
                setCurrentIndex(index);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};