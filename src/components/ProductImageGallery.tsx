'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMediaUrl } from '@/lib/media_utils';

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
  const [selectedImage, setSelectedImage] = useState<string | null>(
    mainImage || (galleryImages.length > 0 ? galleryImages[0] : null)
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="relative group perspective-1000">
        <AnimatePresence mode="wait">
          {selectedImage && (
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.9, rotateY: -5 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateY: 5 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="aspect-square rounded-[4rem] bg-white border border-gray-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] flex items-center justify-center p-16 overflow-hidden relative"
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
        
        {/* Floating Perspective Hint */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-8 py-3 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 group-hover:-translate-y-12 transition-all duration-700 shadow-2xl z-20">
          Studio View
        </div>
      </div>

      {galleryImages.length > 0 && (
        <div className="flex flex-wrap gap-4 justify-center">
          {/* Main image thumbnail */}
          {mainImage && (
             <button
             onClick={() => setSelectedImage(mainImage)}
             className={`w-28 h-28 rounded-3xl bg-white flex items-center justify-center p-4 border-2 transition-all duration-500 relative overflow-hidden group/thumb ${
               selectedImage === mainImage
                 ? 'border-slate-900 shadow-xl scale-110 z-10'
                 : 'border-transparent hover:border-gray-200 opacity-60 hover:opacity-100'
             }`}
           >
             <img
               src={getMediaUrl(mainImage)}
               alt={`${productTitle} Main`}
               className="w-full h-full object-contain group-hover/thumb:scale-110 transition-transform"
             />
             {selectedImage === mainImage && (
               <motion.div layoutId="thumb-ring" className="absolute inset-0 border-4 border-purple-600/20 pointer-events-none" />
             )}
           </button>
          )}
          
          {/* Gallery thumbnails */}
          {galleryImages.map((img: string, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`w-28 h-28 rounded-3xl bg-white flex items-center justify-center p-4 border-2 transition-all duration-500 relative overflow-hidden group/thumb ${
                selectedImage === img
                  ? 'border-slate-900 shadow-xl scale-110 z-10'
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
      )}
    </div>
  );
}
