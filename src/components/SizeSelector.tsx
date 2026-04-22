'use client';

import { useState } from 'react';
import { ChevronDown, Ruler } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SIZES = [
  { code: 'XXS', label: "US women's letter" },
  { code: 'XS', label: "US women's letter" },
  { code: 'S', label: "US women's letter" },
  { code: 'M', label: "US women's letter" },
  { code: 'L', label: "US women's letter" },
  { code: 'XL', label: "US women's letter" },
  { code: '0X', label: "US women's letter" },
  { code: '1X', label: "US women's letter" },
  { code: '2X', label: "US women's letter" },
  { code: '3X', label: "US women's letter" },
  { code: '4X', label: "US women's letter" },
  { code: '5X', label: "US women's letter" },
  { code: 'One size', label: "US women's letter" },
  { code: 'One size (plus)', label: "US women's letter" }
];

export default function SizeSelector() {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-10 relative z-20">
      <div className="flex items-center justify-between mb-4 px-2">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2">
          <Ruler className="w-3 h-3 text-purple-500" />
          Size Selection
        </label>
        {selectedSize && (
          <button 
            onClick={() => setSelectedSize(null)}
            className="text-[9px] font-black uppercase tracking-widest text-purple-600 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center justify-between bg-white border-2 p-6 rounded-[2rem] transition-all duration-500 group shadow-sm text-left",
            isOpen ? "border-purple-600 shadow-xl" : "border-gray-100 hover:border-purple-200"
          )}
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 mb-1">
              Select Size
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
            isOpen && "rotate-180 text-purple-600"
          )} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 z-[100]">
            <div className="max-h-[300px] overflow-y-auto p-3 flex flex-col gap-1">
              {SIZES.map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    setSelectedSize(item.code);
                    setIsOpen(false);
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
                  {selectedSize === item.code && (
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Visual Indicator for form state */}
      <input type="hidden" name="selectedSize" value={selectedSize || ''} />
    </div>
  );
}
