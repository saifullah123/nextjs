'use client';

import { useState } from 'react';
import { ChevronDown, Ruler, Palette, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SIZES = [
  { code: 'XXS', label: "Extra Extra Small" },
  { code: 'XS', label: "Extra Small" },
  { code: 'S', label: "Small" },
  { code: 'M', label: "Medium" },
  { code: 'L', label: "Large" },
  { code: 'XL', label: "Extra Large" },
  { code: '0X', label: "Plus Size 0X" },
  { code: '1X', label: "Plus Size 1X" },
  { code: '2X', label: "Plus Size 2X" },
  { code: '3X', label: "Plus Size 3X" },
  { code: '4X', label: "Plus Size 4X" },
  { code: '5X', label: "Plus Size 5X" },
  { code: 'One size', label: "Standard Size" },
];

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
}

export default function ProductInquirySection({ productTitle, status }: ProductInquirySectionProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isSizeOpen, setIsSizeOpen] = useState(false);

  const isInStock = status !== 'out_of_stock' && status !== 'discontinued';

  const inquiryUrl = `/contact?product=${encodeURIComponent(productTitle)}${
    selectedSize ? `&size=${encodeURIComponent(selectedSize)}` : ''
  }${selectedColor ? `&color=${encodeURIComponent(selectedColor)}` : ''}`;

  return (
    <div className="flex flex-col gap-8 max-w-xl">
      {/* Size Selection */}
      <div className="relative z-30">
        <div className="flex items-center justify-between mb-4 px-2">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2">
            <Ruler className="w-3 h-3 text-purple-500" />
            Size Selection
          </label>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsSizeOpen(!isSizeOpen)}
            className={cn(
              "w-full flex items-center justify-between bg-white border-2 p-6 rounded-[2rem] transition-all duration-500 group shadow-sm text-left",
              isSizeOpen ? "border-purple-600 shadow-xl" : "border-gray-100 hover:border-purple-200"
            )}
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 mb-1">
                Choose Size
              </span>
              <span className={cn(
                "text-lg font-black transition-colors",
                selectedSize ? "text-slate-950" : "text-gray-400"
              )}>
                {selectedSize || "None Selected"}
              </span>
            </div>
            <ChevronDown className={cn(
              "w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-all",
              isSizeOpen && "rotate-180 text-purple-600"
            )} />
          </button>

          {isSizeOpen && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 z-[100]">
              <div className="max-h-[300px] overflow-y-auto p-3 flex flex-col gap-1">
                {SIZES.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setSelectedSize(item.code);
                      setIsSizeOpen(false);
                    }}
                    className={cn(
                      "px-6 py-5 rounded-2xl text-left text-sm font-black transition-all flex items-center justify-between group/item border border-transparent",
                      selectedSize === item.code 
                        ? "bg-slate-950 text-white shadow-lg" 
                        : "hover:bg-gray-50 hover:border-gray-100 text-slate-800"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-black tracking-tight">{item.code}</span>
                      <span className={cn(
                        "text-[9px] uppercase tracking-widest font-black transition-colors",
                        selectedSize === item.code ? "text-purple-400" : "text-gray-400"
                      )}>
                        {item.label}
                      </span>
                    </div>
                    {selectedSize === item.code && <Check size={16} className="text-purple-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
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
