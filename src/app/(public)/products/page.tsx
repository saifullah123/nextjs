import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import ProductFilter from '@/components/ProductFilter';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { ArrowRight, Sparkles, Box, Info } from 'lucide-react';
import { getMediaUrl } from '@/lib/media_utils';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}): Promise<Metadata> {
  const { category, search } = await searchParams;

  if (category) {
    const categoryData = await prisma.category.findUnique({
      where: { slug: category },
    });
    if (categoryData) {
      return {
        title: `${categoryData.name} - Luxury ProductCase`,
        description: categoryData.description || `Browse our exclusive ${categoryData.name} collection.`,
      };
    }
  }

  if (search) {
    return {
      title: `Search: "${search}" - Luxury ProductCase`,
    };
  }

  return {
    title: 'Archive of Excellence - Luxury ProductCase',
    description: 'Explore our meticulously engineered collection of high-end protective masterpieces.',
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { search, category } = await searchParams;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        AND: [
          {
            isActive: true,
          },
          {
            category: {
              isActive: true,
              ...(category ? { slug: category } : {}),
            },
          },
          search
            ? {
                OR: [
                  { title: { contains: search } },
                  { shortDescription: { contains: search } },
                ],
              }
            : {},
        ],
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div className="py-24 md:py-40 bg-[#fafafa]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-24 animate-fade-up">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-[1px] bg-slate-200"></div>
              <span className="text-slate-900 font-black text-[10px] uppercase tracking-[0.6em]">The Official Archive</span>
              <div className="w-12 h-[1px] bg-slate-200"></div>
           </div>
           <h1 className="text-6xl md:text-8xl font-black text-slate-950 tracking-[-0.04em] leading-none mb-10 font-heading">
             Masterpieces of <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Pure Engineering</span>
           </h1>
           <p className="text-gray-400 text-xl md:text-2xl max-w-3xl font-medium leading-[1.6]">
             Where uncompromising protection meets the pinnacle of modern aesthetic design. Explore our curated selection of high-end enclosures.
           </p>
        </div>

        <Suspense fallback={<div className="h-24 animate-pulse bg-white border border-gray-100 rounded-[3rem] mb-20" />}>
          <ProductFilter categories={categories.map(c => ({ id: c.id, name: c.name, slug: c.slug }))} />
        </Suspense>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-16">
            {products.map((product, index) => (
              <Link 
                key={product.id} 
                href={`/products/${product.slug}`} 
                className="group relative block animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="bg-white rounded-[4rem] p-5 border border-gray-100 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-700">
                  <div className="aspect-square rounded-[3.5rem] bg-gray-50 flex items-center justify-center p-14 overflow-hidden relative group-hover:bg-white transition-colors">
                    {product.mainImage ? (
                      <img
                        src={getMediaUrl(product.mainImage)}
                        alt={product.title}
                        className="w-full h-full object-contain group-hover:scale-110 group-hover:rotate-2 transition-transform duration-1000 ease-out"
                      />
                    ) : (
                      <Box size={80} className="text-gray-200" strokeWidth={1} />
                    )}
                    
                    <div className="absolute top-8 left-8 flex flex-col gap-2 z-10">
                      {product.isFeatured && (
                        <div className="bg-slate-950 text-white text-[9px] font-black px-5 py-2.5 rounded-2xl shadow-xl uppercase tracking-[0.2em] border border-white/10 flex items-center gap-2">
                           <Sparkles size={12} className="text-yellow-400" />
                           Elite Choice
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-8 right-8 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                       <div className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl border border-white">
                          <Info size={24} className="text-slate-950" />
                       </div>
                    </div>
                  </div>
                  
                  <div className="p-10">
                    <div className="flex flex-col gap-2 mb-8">
                       <div className="flex items-center gap-3">
                          <span className="text-[10px] uppercase tracking-[0.3em] text-purple-600 font-black">{product.category.name}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                          <span className="text-[9px] uppercase font-black text-gray-400 tracking-widest">{product.status.replace('_', ' ')}</span>
                       </div>
                       <h3 className="text-3xl font-black text-slate-950 group-hover:text-purple-600 transition-colors duration-500 tracking-tighter font-heading">
                         {product.title}
                       </h3>
                    </div>
                    
                     <div className="flex items-center justify-end pt-8 border-t border-gray-50">
                       <div className="w-16 h-16 bg-slate-950 text-white rounded-[2rem] flex items-center justify-center group-hover:bg-purple-600 transition-all duration-700 shadow-2xl group-hover:translate-x-2">
                          <ArrowRight size={28} />
                       </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 py-40 rounded-[5rem] text-center max-w-5xl mx-auto shadow-2xl animate-fade-up">
            <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
               <Box size={40} className="text-gray-300" strokeWidth={1} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-950 mb-6 tracking-tighter font-heading">Exclusive Search Yielded No Results</h2>
            <p className="text-gray-400 text-xl font-medium max-w-md mx-auto mb-12">Consider refining your selection criteria or exploring a different masterpiece collection.</p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-4 bg-slate-950 text-white px-10 py-5 rounded-2xl font-black text-sm hover:bg-purple-600 transition-all shadow-xl uppercase tracking-widest"
            >
              Reset All Filters
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
