'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMediaUrl } from '@/lib/media_utils';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  video: string | null;
  link: string | null;
}

interface HeroSliderProps {
  banners: Banner[];
}

export default function HeroSlider({ banners }: HeroSliderProps) {
  const t = useTranslations('HeroSlider');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [banners.length, isPaused]);

  const togglePause = () => setIsPaused(!isPaused);

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (banners.length === 0) return null;

  return (
    <div className="relative h-[80vh] md:h-[95vh] min-h-[500px] md:min-h-[700px] w-full overflow-hidden bg-primary group">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={banners[currentIndex].id}
          custom={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          {/* Background Image with Ken Burns Effect */}
          <motion.div 
            initial={{ scale: 1.1, filter: 'blur(4px)' }}
            animate={{ scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {banners[currentIndex].image ? (
              <div
                className="w-full h-full bg-cover bg-center opacity-80"
                style={{ backgroundImage: `url(${getMediaUrl(banners[currentIndex].image)})` }}
              />
            ) : (
              <div className="w-full h-full bg-stone-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-transparent to-primary" />
          </motion.div>

          {/* Content */}
          <div className="relative h-full container mx-auto px-6 flex flex-col justify-center items-center text-center text-white z-10 pt-20">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-5xl"
            >
               <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-[10px] font-black uppercase tracking-[0.5em] mb-12 shadow-2xl">
                 <Sparkles className="w-3 h-3 text-amber-500" />
                 {t('badge')}
               </span>
               <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-[8rem] font-black mb-8 md:mb-12 leading-[0.8] tracking-tighter uppercase font-heading [filter:drop-shadow(0_10px_30px_rgba(0,0,0,0.8))]">
                 {banners[currentIndex].title.split(' ').map((word, i) => (
                   <span key={i} className={i % 2 === 1 ? 'text-gradient' : ''}>{word} </span>
                 ))}
               </h1>
               {banners[currentIndex].subtitle && (
                 <motion.p 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ duration: 1, delay: 1 }}
                   className="text-xl md:text-2xl mb-16 text-stone-200 font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-lg"
                 >
                   {banners[currentIndex].subtitle}
                 </motion.p>
               )}
               {banners[currentIndex].link && (
                 <motion.div
                   initial={{ scale: 0.9, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   transition={{ duration: 0.8, delay: 1.2 }}
                 >
                    <Link
                      href={banners[currentIndex].link}
                      className="inline-flex items-center gap-4 bg-white text-stone-950 px-10 md:px-14 py-4 md:py-6 rounded-2xl font-black text-lg md:text-xl hover:bg-amber-600 hover:text-white hover:scale-105 active:scale-95 transition-all duration-700 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] group/btn relative overflow-hidden"
                    >
                      <span className="relative z-10">{t('explore')}</span>
                      <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </Link>
                 </motion.div>
               )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Tools */}
      <div className="absolute bottom-16 inset-x-0 container mx-auto px-6 flex items-end justify-between z-30 pointer-events-none">
        <div className="flex gap-4 pointer-events-auto">
          <button
            onClick={prevSlide}
            className="w-16 h-16 flex items-center justify-center bg-white/5 backdrop-blur-2xl border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all group/nav"
          >
            <ChevronLeft size={32} className="group-hover/nav:-translate-x-2 transition-transform" />
          </button>
          <button
            onClick={nextSlide}
            className="w-16 h-16 flex items-center justify-center bg-white/5 backdrop-blur-2xl border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all group/nav"
          >
            <ChevronRight size={32} className="group-hover/nav:translate-x-2 transition-transform" />
          </button>
        </div>

        <div className="flex items-center gap-10 pointer-events-auto">
           <div className="flex items-center gap-4">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className="group relative py-4"
                >
                  <div className={`h-1 transition-all duration-700 rounded-full ${index === currentIndex ? 'bg-amber-500 w-16' : 'bg-white/20 w-8 group-hover:bg-white/40'}`} />
                  <span className={`absolute -top-4 left-0 text-[10px] font-black transition-opacity ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>0{index + 1}</span>
                </button>
              ))}
           </div>
           
           <button
            onClick={togglePause}
            className="w-12 h-12 flex items-center justify-center bg-white/5 backdrop-blur-2xl border border-white/10 text-white rounded-full hover:bg-white/10 transition-all"
          >
            {isPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
          </button>
        </div>
      </div>
      
      {/* Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none z-20" />
    </div>
  );
}

