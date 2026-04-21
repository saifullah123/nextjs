'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { getMediaUrl } from '@/lib/media_utils';

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
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  return (
    <div className="relative max-w-5xl mx-auto px-6">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 opacity-[0.03] pointer-events-none">
        <Quote size={200} className="text-slate-900" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel p-6 sm:p-10 md:p-20 rounded-[3rem] md:rounded-[4rem] text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border-white/40"
        >
          {current.avatar && (
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="relative inline-block mb-10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-400 rounded-full blur-xl opacity-30 animate-pulse" />
              <img
                src={getMediaUrl(current.avatar)}
                alt={current.name}
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-2xl relative z-10"
              />
            </motion.div>
          )}
          
          <div className="flex items-center justify-center gap-2 mb-10">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={24}
                className={i < Number(current.rating || 0) ? 'fill-amber-500 text-amber-500' : 'text-stone-200'}
              />
            ))}
          </div>

          <p className="text-slate-900 text-lg sm:text-2xl md:text-3xl font-black italic mb-12 leading-relaxed tracking-tight font-heading">
            "{current.content}"
          </p>

          <h4 className="text-2xl font-black text-slate-950 uppercase tracking-tighter">{current.name}</h4>
          {current.role && <p className="text-stone-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">{current.role}</p>}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-4 mt-12">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="group py-2 px-1"
          >
            <div className={`h-1.5 transition-all duration-500 rounded-full ${
              index === currentIndex
                ? 'bg-amber-600 w-12'
                : 'bg-stone-200 w-4 group-hover:bg-stone-300'
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
}
