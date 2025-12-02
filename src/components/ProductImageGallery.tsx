'use client';

import { useState } from 'react';

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
    <div className="p-8">
      {selectedImage && (
        <div className="mb-4 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-4 h-96">
          <img
            src={selectedImage}
            alt={productTitle}
            className="w-full h-full object-contain transition-opacity duration-300"
          />
        </div>
      )}

      {galleryImages.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {/* Main image thumbnail */}
          {mainImage && (
             <button
             onClick={() => setSelectedImage(mainImage)}
             className={`rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-2 h-20 border-2 transition-all ${
               selectedImage === mainImage
                 ? 'border-purple-600 ring-2 ring-purple-200'
                 : 'border-transparent hover:border-purple-300'
             }`}
           >
             <img
               src={mainImage}
               alt={`${productTitle} Main`}
               className="w-full h-full object-contain"
             />
           </button>
          )}
          
          {/* Gallery thumbnails */}
          {galleryImages.map((img: string, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-2 h-20 border-2 transition-all ${
                selectedImage === img
                  ? 'border-purple-600 ring-2 ring-purple-200'
                  : 'border-transparent hover:border-purple-300'
              }`}
            >
              <img
                src={img}
                alt={`${productTitle} ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
