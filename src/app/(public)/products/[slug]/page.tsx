import { prisma } from '@/lib/prisma';
import ProductImageGallery from '@/components/ProductImageGallery';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ArrowLeft, ArrowRight, ShieldCheck, Zap, Sparkles, Globe, Heart, Share2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getMediaUrl } from '@/lib/media_utils';
import SizeSelector from '@/components/SizeSelector';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.metaTitle || `${product.title} - Luxury ProductCase`,
    description: product.metaDescription || product.shortDescription || product.longDescription || `Discover the exceptional ${product.title}.`,
    keywords: [
      ...(product.metaKeywords ? product.metaKeywords.split(',').map((k: string) => k.trim()) : []),
      ...(product.tags || [])
    ],
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  const galleryImages = product.galleryImages
    ? product.galleryImages.split(',').map((url: string) => url.trim()).filter(item => item.length > 0)
    : [];

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      NOT: { id: product.id }
    },
    take: 3,
  });

  return (
    <div className="py-24 md:py-40 bg-[#fafafa]">
      <div className="container mx-auto px-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-20 animate-fade-up">
          <Link
            href="/products"
            className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-slate-900 transition-all border border-gray-100 bg-white px-8 py-4 rounded-2xl shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
            Back to Collection
          </Link>
          <div className="flex items-center gap-4">
            <button className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm">
              <Heart className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-purple-600 hover:border-purple-100 transition-all shadow-sm">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Visual Showcase */}
          <div className="lg:col-span-7 animate-fade-right">
             <div className="sticky top-40">
                <ProductImageGallery
                  mainImage={product.mainImage}
                  galleryImages={galleryImages}
                  productTitle={product.title}
                />
             </div>
          </div>

          {/* Product Intel */}
          <div className="lg:col-span-5 flex flex-col pt-4 animate-fade-left">
            <div className="flex flex-col gap-6 mb-12">
               <div className="flex items-center gap-3">
                  <span className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-xl">
                    {product.category?.name || 'Uncategorized'}
                  </span>
                  {product.status === 'in_stock' ? (
                     <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] bg-emerald-50 px-5 py-2.5 rounded-full border border-emerald-100/50">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        In Stock - Ships Within 24 Hours
                     </div>
                  ) : product.status === 'out_of_stock' ? (
                    <div className="flex items-center gap-2 text-rose-600 text-[10px] font-black uppercase tracking-[0.2em] bg-rose-50 px-5 py-2.5 rounded-full border border-rose-100/50">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        Temporarily Unavailable
                     </div>
                  ) : (
                    <div className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] bg-blue-50 px-5 py-2.5 rounded-full border border-blue-100/50">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Exclusive Pre-Order
                     </div>
                  )}
               </div>
               
               <h1 className="text-6xl md:text-8xl font-black text-gray-950 tracking-[ -0.04em] leading-[0.9] font-heading">
                 {product.title}
               </h1>
            </div>



            {product.shortDescription && (
              <div className="relative mb-14">
                <p className="text-gray-500 text-xl font-medium leading-relaxed italic border-l-[6px] border-purple-600/20 pl-8">
                  "{product.shortDescription}"
                </p>
                <div className="absolute top-0 right-0 opacity-10 grayscale pointer-events-none">
                  <Sparkles size={60} />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 mb-16">
               <SizeSelector />
               {product.status !== 'out_of_stock' && product.status !== 'discontinued' ? (
                 <Link
                   href={`/contact?product=${encodeURIComponent(product.title)}`}
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

            {/* Value Propositions */}
            <div className="grid grid-cols-2 gap-4 mb-20">
               {[
                 { label: 'Craftmanship', val: 'Hand-Finished', icon: Sparkles, color: 'text-yellow-500' },
                 { label: 'Security', val: 'Elite Warranty', icon: ShieldCheck, color: 'text-emerald-500' },
                 { label: 'Material', val: 'Space Grade', icon: Zap, color: 'text-blue-500' },
                 { label: 'Logistics', val: 'Global Priority', icon: Globe, color: 'text-purple-500' }
               ].map((feat, i) => (
                 <div key={i} className="bg-white border border-gray-100 p-6 rounded-3xl flex items-center gap-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-xl group-hover:bg-slate-900 group-hover:text-white transition-all">
                      <feat.icon className={cn("w-6 h-6", feat.color, "group-hover:text-white")} />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{feat.label}</span>
                       <span className="text-sm font-black text-slate-950">{feat.val}</span>
                    </div>
                 </div>
               ))}
            </div>

            {product.longDescription && (
              <div className="mb-20">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mb-8 flex items-center gap-3">
                   <div className="w-8 h-[1px] bg-gray-200"></div>
                   Specifications & Details
                </h2>
                <div className="text-gray-600 leading-relaxed font-medium space-y-8 text-lg">
                   {product.longDescription.split('\n\n').map((para, i) => (
                     <p key={i} className="italic text-gray-400 font-medium">
                        {para}
                     </p>
                   ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-40 pt-40 border-t border-gray-200">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                <div className="flex flex-col gap-4">
                   <span className="text-purple-600 font-black text-[10px] uppercase tracking-[0.5em]">Curated Selection</span>
                   <h2 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tighter leading-none font-heading">Related <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Masterpieces</span></h2>
                </div>
                <Link 
                  href="/products" 
                  className="group flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-900 bg-white border border-gray-200 px-10 py-5 rounded-2xl hover:bg-slate-950 hover:text-white transition-all shadow-sm"
                >
                  Explore Collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </Link>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {relatedProducts.map(rel => (
                  <Link key={rel.id} href={`/products/${rel.slug}`} className="group relative block">
                    <div className="bg-white rounded-[3.5rem] p-4 border border-gray-100 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-700">
                      <div className="aspect-square rounded-[3rem] bg-gray-50 flex items-center justify-center p-12 overflow-hidden relative group-hover:bg-white transition-colors">
                        <img 
                          src={getMediaUrl(rel.mainImage)} 
                          alt={rel.title} 
                          className="w-full h-full object-contain group-hover:scale-110 group-hover:rotate-2 transition-transform duration-1000" 
                        />
                        <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/5 transition-colors" />
                      </div>
                      
                      <div className="p-8 pb-10">
                        <h3 className="text-2xl font-black text-slate-950 group-hover:text-purple-600 transition-colors tracking-tighter font-heading mb-6">{rel.title}</h3>
                        <div className="flex justify-end items-center pt-6 border-t border-gray-50">
                           <div className="w-14 h-14 bg-slate-950 text-white rounded-3xl flex items-center justify-center group-hover:bg-purple-600 transition-all shadow-xl">
                              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                           </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
