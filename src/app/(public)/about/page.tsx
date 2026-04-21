import { Metadata } from 'next';
import { ShieldCheck, Sparkles, Heart, Globe, Award, Zap } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const metadata: Metadata = {
  title: 'Our Heritage - Luxury ProductCase',
  description: 'Discover the philosophy behind the world’s most exclusive device protection ecosystem. Engineering excellence meets artistic vision.',
};

export default function AboutPage() {
  return (
    <div className="bg-[#fafafa] py-24 md:py-40">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-32 animate-fade-up">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-slate-200"></div>
              <span className="text-slate-900 font-black text-[10px] uppercase tracking-[0.6em]">The ProductCase Story</span>
              <div className="w-12 h-[1px] bg-slate-200"></div>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-950 tracking-[-0.04em] leading-[0.9] mb-12 font-heading">
              Redefining the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Standard of Excellence</span>
            </h1>
            <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-[1.6]">
              At ProductCase, we don't just create enclosures. We engineer masterpieces that bridge the gap between pure protection and uncompromising luxury.
            </p>
          </div>

          {/* Hero Image / Banner Placeholder */}
          <div className="relative h-[600px] w-full bg-slate-900 rounded-[5rem] overflow-hidden mb-40 shadow-2xl animate-fade-up">
             <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-slate-900/40 z-10" />
             <div className="absolute inset-0 flex items-center justify-center text-white/5 font-black text-[20vw] select-none pointer-events-none uppercase tracking-tighter">
                Originals
             </div>
             <div className="absolute inset-0 flex items-center justify-center p-12 text-center z-20">
                <div className="max-w-2xl">
                   <Award className="w-20 h-20 text-yellow-400 mx-auto mb-10 animate-pulse" />
                   <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter leading-none font-heading">Crafting Timeless Protection</h2>
                   <p className="text-white/60 text-lg font-medium">Every piece in our collection is a testament to our commitment to engineering perfection and aesthetic purity.</p>
                </div>
             </div>
          </div>

          {/* Main Content Sections */}
          <div className="grid lg:grid-cols-2 gap-32 mb-40">
            <div className="space-y-12 animate-fade-right">
              <div className="flex flex-col gap-6">
                <span className="text-purple-600 font-black text-[10px] uppercase tracking-[0.4em]">The Beginning</span>
                <h2 className="text-5xl font-black text-slate-950 tracking-tighter leading-none font-heading">Our Legacy of Innovation</h2>
                <div className="w-20 h-1.5 bg-slate-950 rounded-full"></div>
              </div>
              <p className="text-gray-500 text-xl font-medium leading-relaxed italic border-l-[6px] border-purple-600/20 pl-10">
                "ProductCase was founded with a singular, unyielding vision: to engineer high-quality, ultra-luxury protection for the equipment you value most. We believed then, as we do now, that protection should never compromise on style."
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                From our experimental startup roots to becoming a global icon of device protection, our journey has been defined by a relentless pursuit of better materials, sharper designs, and more intelligent engineering.
              </p>
            </div>

            <div className="space-y-12 animate-fade-left">
              <div className="flex flex-col gap-6">
                <span className="text-pink-600 font-black text-[10px] uppercase tracking-[0.4em]">The North Star</span>
                <h2 className="text-5xl font-black text-slate-950 tracking-tighter leading-none font-heading">Our Unwavering Mission</h2>
                <div className="w-20 h-1.5 bg-slate-950 rounded-full"></div>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed">
                We are committed to delivering exceptional products that harmonize extreme durability, flawless functionality, and peak aesthetic appeal. Every enclosure we offer is meticulously curated, rigorously tested, and finished by hand to ensure it meets our elite standards of craftsmanship.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-8">
                 <div className="flex items-center gap-4">
                    <Globe size={24} className="text-slate-900" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Global Supply</span>
                 </div>
                 <div className="flex items-center gap-4">
                    <ShieldCheck size={24} className="text-slate-900" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure Delivery</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Value Grid Section */}
          <div className="pt-24 border-t border-gray-100 animate-fade-up">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter font-heading">The Pillars of Our Design</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              {[
                { 
                  title: 'Engineering Purity', 
                  desc: 'Only the highest grade materials and zero-tolerance craftsmanship are allowed in our production facility.', 
                  icon: Zap, 
                  color: 'text-blue-500', 
                  bg: 'bg-blue-50' 
                },
                { 
                  title: 'Aesthetic Vision', 
                  desc: 'Modern aesthetics that don’t just follow trends, but set them, complementing your personal signature style.', 
                  icon: Sparkles, 
                  color: 'text-yellow-500', 
                  bg: 'bg-yellow-50' 
                },
                { 
                  title: 'Human Centric', 
                  desc: 'Our commitment to you ends only when your expectations are exceeded. Our support is global and eternal.', 
                  icon: Heart, 
                  color: 'text-rose-500', 
                  bg: 'bg-rose-50' 
                }
              ].map((value, i) => (
                <div key={i} className="group bg-white border border-gray-100 p-12 rounded-[3.5rem] hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-700">
                  <div className={cn("w-20 h-20 rounded-[2rem] mb-10 flex items-center justify-center transition-all duration-700 group-hover:bg-slate-950 group-hover:text-white shadow-sm", value.bg, value.color)}>
                    <value.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-950 mb-6 tracking-tighter font-heading">{value.title}</h3>
                  <p className="text-gray-400 leading-relaxed font-medium">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
