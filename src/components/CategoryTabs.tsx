'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Box, Sparkles, ShoppingCart } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { getMediaUrl } from '@/lib/media_utils';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  mainImage: string | null;
  isFeatured: boolean;
}

interface CategoryTabsProps {
  categories: {
    id: string;
    name: string;
    slug: string;
    products: Product[];
  }[];
}

export default function CategoryTabs({ categories }: CategoryTabsProps) {
  const [activeTab, setActiveTab] = useState(categories[0]?.id || '');
  const activeCategory = categories.find((c) => c.id === activeTab);
  const t = useTranslations('Common');

  return (
    <div className="space-y-20">
      <div className="flex overflow-x-auto lg:flex-wrap lg:justify-center gap-4 px-4 pb-4 no-scrollbar -mx-4 sm:mx-0 snap-x snap-mandatory scroll-smooth">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.id)}
            className={`flex-none snap-center px-8 md:px-10 py-4 md:py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 relative overflow-hidden group ${
              activeTab === category.id
                ? 'bg-primary text-white shadow-2xl scale-105'
                : 'bg-white text-gray-400 hover:text-primary border border-gray-100 shadow-sm'
            }`}
          >
            <span className="relative z-10">{category.name}</span>
            {activeTab === category.id && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-500 opacity-20"
              />
            )}
            <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-amber-600 transition-transform duration-500 scale-x-0 group-hover:scale-x-100 ${activeTab === category.id ? 'scale-x-100' : ''}`} />
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {activeCategory?.products.slice(0, 4).map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group relative"
            >
              <div className="bg-white rounded-[3.5rem] p-4 border border-gray-100 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-700">
                <div className="aspect-square rounded-[3rem] bg-gray-50 flex items-center justify-center p-12 overflow-hidden relative group-hover:bg-white transition-colors duration-700">
                  {product.mainImage ? (
                    <img
                      src={getMediaUrl(product.mainImage)}
                      alt={product.title}
                      className="w-full h-full object-contain group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-1000 ease-out"
                    />
                  ) : (
                    <Box size={60} className="text-gray-200" strokeWidth={1} />
                  )}
                  
                  {product.isFeatured && (
                    <div className="absolute top-6 left-6 z-10">
                      <div className="bg-slate-950 text-white text-[8px] font-black px-4 py-2 rounded-full shadow-lg uppercase tracking-widest border border-white/10 flex items-center gap-2">
                         <Sparkles size={10} className="text-yellow-400" />
                         Elite
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-6 right-6 z-20 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-gray-100">
                        <ShoppingCart size={18} className="text-slate-950" />
                     </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex flex-col gap-1 mb-6">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-amber-700 font-black">{activeCategory.name}</span>
                    <h3 className="text-lg md:text-xl font-black text-slate-950 group-hover:text-amber-700 transition-colors duration-500 tracking-tighter">
                      {product.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center justify-end border-t border-gray-50 pt-6">
                    <div className="w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center group-hover:bg-amber-600 transition-all duration-700 shadow-xl group-hover:translate-x-1">
                      <ArrowRight size={22} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="text-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-4 bg-slate-950 text-white px-12 py-6 rounded-2xl font-black text-[12px] hover:bg-amber-700 transition-all duration-500 shadow-2xl uppercase tracking-widest group"
        >
          {t('discoverMore')}
          <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

