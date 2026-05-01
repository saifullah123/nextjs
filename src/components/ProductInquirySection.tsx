'use client';

import { useState } from 'react';
import { ChevronDown, Ruler, Palette, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SIZE_LABELS: Record<string, string> = {
  'XXS': "Extra Extra Small",
  'XS': "Extra Small",
  'S': "Small",
  'M': "Medium",
  'L': "Large",
  'XL': "Extra Large",
  'XXL': "Double Extra Large",
  '1X': "Plus Size 1X",
  '2X': "Plus Size 2X",
  '3X': "Plus Size 3X",
  '4X': "Plus Size 4X",
  '5X': "Plus Size 5X",
};

const COLORS = [
  { name: 'Pure Black', hex: '#000000' },
  { name: 'Heritage Brown', hex: '#4b3621' },
  { name: 'Royal Navy', hex: '#002366' },
  { name: 'Deep Burgundy', hex: '#800020' },
  { name: 'Hunter Green', hex: '#355e3b' },
  { name: 'Cognac', hex: '#9b4f0f' },
  { name: 'Slate Gray', hex: '#708090' },
];

interface ProductInquirySectionProps {
  productTitle: string;
  status: string;
  sizes?: string[];
}

export default function ProductInquirySection({ productTitle, status, sizes = [] }: ProductInquirySectionProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const isInStock = status !== 'out_of_stock' && status !== 'discontinued';

  const inquiryUrl = `/contact?product=${encodeURIComponent(productTitle)}${
    selectedSize ? `&size=${encodeURIComponent(selectedSize)}` : ''
  }${selectedColor ? `&color=${encodeURIComponent(selectedColor)}` : ''}`;

  return (
    <div className="flex flex-col gap-8 max-w-xl">
      {/* Size Selection */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4 px-2">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2">
            <Ruler className="w-3 h-3 text-purple-500" />
            Select Size
          </label>
        </div>

        <div className="flex flex-wrap gap-3 p-1">
          {sizes.length > 0 ? (
            sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "min-w-[56px] h-14 flex items-center justify-center px-4 rounded-xl border-2 font-black transition-all duration-300",
                  selectedSize === size 
                    ? "border-slate-950 bg-slate-950 text-white shadow-lg scale-105" 
                    : "border-gray-100 bg-white text-slate-800 hover:border-purple-200 hover:text-purple-600"
                )}
              >
                <span className="text-sm tracking-tight">{size}</span>
              </button>
            ))
          ) : (
            <p className="text-xs text-gray-400 pl-2">One Size / Standard</p>
          )}
        </div>
        
        {selectedSize && (
          <p className="mt-3 text-[10px] font-black text-slate-950 uppercase tracking-widest pl-2">
            Selected: <span className="text-purple-600">{SIZE_LABELS[selectedSize] || selectedSize}</span>
          </p>
        )}
      </div>

      {/* Color Selection */}
      <div className="relative z-20">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2 mb-4 px-2">
          <Palette className="w-3 h-3 text-pink-500" />
          Color Palette
        </label>
        
        <div className="flex flex-wrap gap-3 p-2">
          {COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color.name)}
              className={cn(
                "relative w-12 h-12 rounded-2xl transition-all duration-500 border-4",
                selectedColor === color.name 
                  ? "border-slate-950 scale-110 shadow-xl" 
                  : "border-white shadow-sm hover:scale-105"
              )}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {selectedColor === color.name && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                </div>
              )}
            </button>
          ))}
        </div>
        {selectedColor && (
          <p className="mt-3 text-[10px] font-black text-slate-950 uppercase tracking-widest pl-2">
            Selected: <span className="text-purple-600">{selectedColor}</span>
          </p>
        )}
      </div>

      {/* Inquiry Button */}
      <div className="pt-4">
        {isInStock ? (
          <Link
            href={inquiryUrl}
            className="group flex items-center justify-between bg-slate-950 text-white p-8 rounded-[2.5rem] font-black text-xl hover:bg-purple-600 transition-all duration-700 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]"
          >
            <span className="flex items-center gap-4">
              Inquire Price via Email
            </span>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-purple-600 transition-all">
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ) : (
          <button disabled className="w-full bg-gray-100 text-gray-400 p-8 rounded-[2.5rem] font-black text-xl cursor-not-allowed uppercase tracking-widest border-2 border-dashed border-gray-200">
            Currently Depleted
          </button>
        )}
      </div>

      {/* Selection Summary Hint */}
      {(selectedSize || selectedColor) && (
        <p className="text-[10px] text-gray-400 font-medium italic text-center px-8">
          Selection details will be included in your inquiry automatically.
        </p>
      )}
    </div>
  );
}
