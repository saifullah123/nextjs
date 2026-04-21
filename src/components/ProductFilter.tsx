'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useState } from 'react';
import { Search, Filter, ChevronDown, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function ProductFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isCatOpen, setIsCatOpen] = useState(false);

  const currentSearch = searchParams.get('search') || '';
  const currentCategorySlug = searchParams.get('category') || '';
  
  const currentCategory = categories.find(c => c.slug === currentCategorySlug);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    startTransition(() => {
      router.replace(`/products?${params.toString()}`, { scroll: false });
    });
  };

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    setIsCatOpen(false);
    startTransition(() => {
      router.replace(`/products?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="flex flex-col gap-10 mb-20 animate-fade-up">
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        {/* Search Field */}
        <div className="relative flex-1 w-full group">
          <label htmlFor="search" className="absolute -top-3 left-6 bg-white px-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 z-10">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              placeholder="Vibrant case, minimal design..."
              defaultValue={currentSearch}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-6 bg-white border border-gray-100 rounded-[2rem] focus:ring-4 focus:ring-purple-600/5 focus:border-purple-600 outline-none transition-all duration-500 font-black text-sm placeholder:text-gray-300 shadow-sm"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
            {isPending && (
              <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-600 animate-spin" />
            )}
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="relative w-full lg:w-80 group">
          <label className="absolute -top-3 left-6 bg-white px-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 z-10">
            Category
          </label>
          <button
            onClick={() => setIsCatOpen(!isCatOpen)}
            className="w-full flex items-center justify-between px-8 py-6 bg-white border border-gray-100 rounded-[2rem] hover:border-slate-900 transition-all duration-500 font-black text-sm shadow-sm"
          >
            <span className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-gray-400" />
              {currentCategory ? currentCategory.name : 'All Collections'}
            </span>
            <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform duration-500", isCatOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isCatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 w-full mt-4 bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl z-50 overflow-hidden p-3"
              >
                <button
                  onClick={() => handleCategoryChange('')}
                  className={cn(
                    "w-full text-left px-6 py-4 rounded-2xl text-sm font-black transition-all",
                    !currentCategorySlug ? "bg-slate-900 text-white" : "hover:bg-gray-50 text-gray-500"
                  )}
                >
                  All Collections
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={cn(
                      "w-full text-left px-6 py-4 rounded-2xl text-sm font-black transition-all mt-1",
                      currentCategorySlug === cat.slug ? "bg-slate-900 text-white" : "hover:bg-gray-50 text-gray-500"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tags for active filters */}
      {(currentSearch || currentCategorySlug) && (
        <div className="flex flex-wrap gap-4 items-center">
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mr-2 border-r border-gray-100 pr-4">Active Filters:</span>
           {currentSearch && (
             <button 
              onClick={() => handleSearch('')}
              className="flex items-center gap-2 bg-purple-50 text-purple-600 px-5 py-2.5 rounded-full text-xs font-black border border-purple-100 group transition-all"
             >
                Search: "{currentSearch}"
                <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
             </button>
           )}
           {currentCategorySlug && (
             <button 
              onClick={() => handleCategoryChange('')}
              className="flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2.5 rounded-full text-xs font-black border border-blue-100 group transition-all"
             >
                Category: {currentCategory?.name}
                <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
             </button>
           )}
           <button 
            onClick={() => { handleSearch(''); handleCategoryChange(''); }}
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-rose-600 transition-colors"
           >
             Clear All
           </button>
        </div>
      )}
    </div>
  );
}
