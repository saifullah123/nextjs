'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMediaUrl } from '@/lib/media_utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageGalleryProps {
  mainImage: string | null;
  galleryImages: string[];
  productTitle: string;
}

export default function ProductImageGallery({
  mainImage,
  galleryImages,
  productTitle,
}: ProductImageGalleryProps) {
  const allImages = [mainImage, ...galleryImages].filter((img): img is string => !!img);
  const [selectedImage, setSelectedImage] = useState<string | null>(allImages[0] || null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handlePrevious = () => {
    const newIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setCurrentIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % allImages.length;
    setCurrentIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
  };

  const handleThumbnailClick = (img: string, index: number) => {
    setSelectedImage(img);
    setCurrentIndex(index);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Main Image Display with Navigation Arrows */}
      <div className="relative group perspective-1000">
        <AnimatePresence mode="wait">
          {selectedImage && (
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.9, rotateY: -5 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateY: 5 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="aspect-square rounded-[4rem] bg-white border border-gray-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] flex items-center justify-center p-24 overflow-hidden relative"
            >
              <img
                src={getMediaUrl(selectedImage)}
                alt={productTitle}
                className="w-full h-full object-contain transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-slate-900 hover:bg-white transition-all z-20 opacity-0 group-hover:opacity-100 border border-gray-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-slate-900 hover:bg-white transition-all z-20 opacity-0 group-hover:opacity-100 border border-gray-100"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
        
        {/* Floating Perspective Hint */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-8 py-3 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 group-hover:-translate-y-12 transition-all duration-700 shadow-2xl z-20">
          Studio View
        </div>
      </div>

      {/* Thumbnail Slider */}
      {galleryImages.length > 0 && (
        <div className="relative group/slider">
          {/* Scroll Buttons for Thumbnails */}
          <button 
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center z-10 opacity-0 group-hover/slider:opacity-100 transition-opacity border border-gray-100 text-gray-400 hover:text-slate-900"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 px-2 no-scrollbar scroll-smooth"
          >
            {galleryImages.map((img: string, index: number) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(img, index + 1)} // index + 1 because index 0 is mainImage
                className={`flex-shrink-0 w-24 h-24 rounded-2xl bg-white flex items-center justify-center p-3 border-2 transition-all duration-500 relative overflow-hidden group/thumb ${
                  selectedImage === img
                    ? 'border-slate-900 shadow-lg scale-105 z-10'
                    : 'border-transparent hover:border-gray-200 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={getMediaUrl(img)}
                  alt={`${productTitle} ${index + 1}`}
                  className="w-full h-full object-contain group-hover/thumb:scale-110 transition-transform"
                />
                {selectedImage === img && (
                  <motion.div layoutId="thumb-ring" className="absolute inset-0 border-4 border-purple-600/20 pointer-events-none" />
                )}
              </button>
            ))}
          </div>

          <button 
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center z-10 opacity-0 group-hover/slider:opacity-100 transition-opacity border border-gray-100 text-gray-400 hover:text-slate-900"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
