import { Metadata } from 'next';
import { ShieldCheck, Sparkles, Heart, Globe, Award, Zap, Anchor, Compass, Mountain, Star, Trophy, Crown, CheckCircle2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const metadata: Metadata = {
  title: 'Our Heritage - Net Gate Western Boutique',
  description: 'Discover the legacy of Net Gate Western Boutique. From premium Hermann Oak leather saddles to championship-grade show apparel, we define the standard of Western excellence.',
};

export default function AboutPage() {
  return (
    <div className="bg-white py-24 md:py-44 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Elite Header Section */}
          <div className="text-center mb-36 animate-fade-up">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.5em] mb-12 shadow-2xl">
               <Crown className="w-4 h-4 text-amber-400" />
               The Royal Standard of Western Gear
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black text-slate-950 tracking-[-0.05em] leading-[0.85] mb-14 font-heading uppercase italic">
              Where <span className="text-amber-600">Heritage</span> <br />
              Meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 underline decoration-amber-500/30">High-Performance</span>
            </h1>
            
            <p className="text-slate-500 text-2xl md:text-3xl max-w-4xl mx-auto font-medium leading-relaxed tracking-tight">
              Net Gate Western Boutique is the global authority in equestrian excellence. We don't just supply gear; we engineer masterpieces for the world's most discerning riders, from the lead line to World Champion classes.
            </p>
          </div>

          {/* Immersive Gallery Section */}
          <div className="grid grid-cols-12 gap-8 mb-44">
             <div className="col-span-12 lg:col-span-7 h-[700px] bg-slate-950 rounded-[4rem] overflow-hidden relative shadow-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2000&auto=format&fit=crop" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[6000ms]" 
                  alt="Elite Horseback Riding"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-16 flex flex-col justify-end">
                   <span className="text-amber-400 font-black text-xs uppercase tracking-[0.5em] mb-4">Artisan Series</span>
                   <h3 className="text-5xl font-black text-white uppercase tracking-tighter mb-6">Born in the Arena, <br /> Built for the Win</h3>
                   <p className="text-white/60 text-lg max-w-md font-medium">Our equipment is trusted by professional trainers and world-class competitors who settle for nothing less than perfection.</p>
                </div>
             </div>
             <div className="col-span-12 lg:col-span-5 grid grid-rows-2 gap-8">
                <div className="bg-amber-50 rounded-[4rem] p-16 flex flex-col justify-center border border-amber-100/50 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Star size={120} />
                   </div>
                   <Trophy className="w-16 h-16 text-amber-600 mb-8" />
                   <h4 className="text-3xl font-black text-slate-950 uppercase tracking-tighter mb-4">Championship Pedigree</h4>
                   <p className="text-amber-900/60 font-medium">For over 15 years, Net Gate has been the "Company Champions Keep," supporting winning runs across all major Western disciplines.</p>
                </div>
                <div className="bg-slate-100 rounded-[4rem] p-16 flex flex-col justify-center border border-slate-200/50 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <ShieldCheck size={120} />
                   </div>
                   <Award className="w-16 h-16 text-slate-900 mb-8" />
                   <h4 className="text-3xl font-black text-slate-950 uppercase tracking-tighter mb-4">Bespoke Curation</h4>
                   <p className="text-slate-500 font-medium">From premium Hermann Oak Leather to hand-carved silver, every piece is rigorously inspected for artisanal perfection.</p>
                </div>
             </div>
          </div>

          {/* Persuasive Copy Sections */}
          <div className="grid lg:grid-cols-2 gap-32 mb-44 items-center">
            <div className="space-y-12">
              <div className="flex flex-col gap-6">
                <div className="w-20 h-2 bg-amber-600 rounded-full"></div>
                <h2 className="text-6xl font-black text-slate-950 tracking-tighter leading-[0.9] font-heading uppercase italic">Uncompromising <br /> Quality for the <br /> Professional <br /> Horseman</h2>
              </div>
              <div className="space-y-8">
                 <p className="text-gray-600 text-2xl font-medium leading-relaxed italic border-l-[10px] border-amber-600/10 pl-12 py-4">
                  "At Net Gate, we believe quality isn't an option—it's the foundation of every winning performance."
                 </p>
                 <p className="text-gray-500 text-xl leading-relaxed">
                  We specialize in high-performance Western gear that balances tradition with innovation. Our saddles feature precision-balanced trees and anatomically shaped skirts, while our show apparel combines 4-way stretch fabrics with hand-set crystals for maximum visual impact.
                 </p>
              </div>
              <div className="flex items-center gap-10 pt-6">
                 <div className="text-center">
                    <div className="text-5xl font-black text-slate-950 tracking-tighter">50+</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 mt-2">Countries Served</div>
                 </div>
                 <div className="w-px h-12 bg-gray-200"></div>
                 <div className="text-center">
                    <div className="text-5xl font-black text-slate-950 tracking-tighter">10k+</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 mt-2">Elite Clients</div>
                 </div>
              </div>
            </div>

            <div className="relative group">
               <div className="absolute -inset-4 bg-amber-500/10 rounded-[5rem] blur-3xl group-hover:bg-amber-500/20 transition-all duration-700" />
               <div className="relative bg-white border border-gray-100 p-16 rounded-[4.5rem] shadow-xl overflow-hidden">
                  <Star className="w-12 h-12 text-amber-400 mb-10" />
                  <h3 className="text-4xl font-black text-slate-950 uppercase tracking-tighter mb-8 leading-none">Global Standards, <br /> Handcrafted Roots</h3>
                  <p className="text-gray-500 text-lg leading-relaxed mb-10">
                    Our master saddlers utilize centuries-old techniques blended with modern ergonomic research. This ensures that every Net Gate product provides optimal comfort for the horse and peak performance for the rider. 
                  </p>
                  <ul className="space-y-6">
                     {[
                       'Genuine Hermann Oak Leather',
                       'Precision-Balanced Saddle Trees',
                       'Competition-Grade Reinforced Stitching',
                       'Hand-Carved Floral & Basket Tooling'
                     ].map((item, i) => (
                       <li key={i} className="flex items-center gap-4 text-slate-950 font-black text-sm uppercase tracking-widest">
                          <CheckCircle2 size={18} className="text-amber-500" />
                          {item}
                       </li>
                     ))}
                  </ul>
               </div>
            </div>
          </div>

          {/* The Pillars - Value Proposition */}
          <div className="pt-32 border-t border-gray-100">
            <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-12">
               <div className="max-w-2xl text-center md:text-left">
                  <span className="text-amber-600 font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">Our Guarantee</span>
                  <h2 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tighter font-heading uppercase italic leading-[0.85]">The Net Gate <br /> Distinction</h2>
               </div>
               <div className="flex flex-col items-center md:items-end gap-4">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Ready to elevate your performance?</p>
                  <button className="px-12 py-6 bg-slate-950 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-amber-600 hover:shadow-2xl transition-all active:scale-95 shadow-xl">
                     Contact Our Specialist
                  </button>
               </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              {[
                { 
                  title: 'Artisan Excellence', 
                  desc: 'Every piece is a unique masterpiece, designed for the rider who values exclusivity and world-class craftsmanship.', 
                  icon: Zap, 
                  color: 'text-slate-950', 
                  bg: 'bg-gray-100' 
                },
                { 
                  title: 'Arena Dominance', 
                  desc: 'Gear designed to make a statement. We provide the visual and functional edge needed to capture the judge\'s eye.', 
                  icon: Sparkles, 
                  color: 'text-amber-700', 
                  bg: 'bg-amber-50' 
                },
                { 
                  title: 'Global Partnership', 
                  desc: 'A dedicated relationship with every buyer, ensuring personalized service and seamless worldwide logistics.', 
                  icon: Globe, 
                  color: 'text-blue-700', 
                  bg: 'bg-blue-50' 
                }
              ].map((value, i) => (
                <div key={i} className="group bg-white border border-gray-100 p-12 rounded-[4rem] hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-3 transition-all duration-700 relative overflow-hidden border-b-8 border-b-transparent hover:border-b-amber-500">
                  <div className={cn("w-20 h-20 rounded-[2.5rem] mb-10 flex items-center justify-center transition-all duration-700 group-hover:scale-110 shadow-sm", value.bg, value.color)}>
                    <value.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-950 mb-6 tracking-tighter font-heading uppercase">{value.title}</h3>
                  <p className="text-gray-500 leading-relaxed font-medium">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-44 p-24 bg-slate-950 rounded-[5rem] text-center relative overflow-hidden group">
             <div className="relative z-10">
                <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter uppercase italic">Secure Your <br /> Masterpiece Today</h2>
                <p className="text-white/40 text-xl max-w-2xl mx-auto mb-16">Join an elite global community of equestrians who settle for nothing less than absolute perfection.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-amber-400">
                         <ShieldCheck size={24} />
                      </div>
                      <span className="text-white font-bold text-xs uppercase tracking-widest">Global Export Expertise</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-amber-400">
                         <Star size={24} />
                      </div>
                      <span className="text-white font-bold text-xs uppercase tracking-widest">Certified Authenticity</span>
                   </div>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] group-hover:bg-amber-500/20 transition-all duration-700" />
             <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] group-hover:bg-blue-500/20 transition-all duration-700" />
          </div>

        </div>
      </div>
    </div>
  );
}
