'use client';

import { useState, useEffect } from 'react';

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  avatar: string | null;
  rating: number;
  content: string;
}

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  return (
    <div className="relative bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto">
      <div className="text-center">
        {current.avatar && (
          <img
            src={current.avatar}
            alt={current.name}
            className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-purple-200"
          />
        )}
        
        <div className="flex items-center justify-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-2xl transition-colors duration-300 ${
                i < Number(current.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ⭐
            </span>
          ))}
        </div>

        <p className="text-gray-700 text-lg italic mb-6 leading-relaxed">
          "{current.content}"
        </p>

        <h4 className="text-xl font-bold text-gray-800">{current.name}</h4>
        {current.role && <p className="text-gray-600">{current.role}</p>}
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 w-8'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
