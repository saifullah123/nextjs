'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Sparkles, ShoppingBag, ShieldCheck, Gem, ArrowRight } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

export default function ProductShowcase() {
  const t = useTranslations('Showcase');
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen py-24 overflow-hidden bg-[#0a0a0a] flex items-center"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-stone-900/20 rounded-full blur-[180px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-8"
          >
            <div>
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/5 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6"
              >
                <Sparkles className="w-3 h-3" />
                {t('badge')}
              </motion.span>
              
              <h2 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-6 uppercase">
                {t.rich('title', {
                  span: (chunks: any) => <span className="text-gradient">{chunks}</span>,
                  br: () => <br />
                })}
              </h2>
              
              <p className="text-stone-400 text-lg md:text-xl max-w-lg leading-relaxed font-light">
                {t('description')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 py-8 border-y border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <Gem className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider">{t('premium')}</h4>
                  <p className="text-stone-500 text-xs uppercase tracking-widest">{t('materials')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <ShieldCheck className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider">{t('ergonomic')}</h4>
                  <p className="text-stone-500 text-xs uppercase tracking-widest">{t('construction')}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 items-center">
              <button className="group relative px-8 py-4 bg-white text-black rounded-full font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
                <span className="relative z-10 flex items-center gap-3">
                  {t('inquire')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] bg-stone-800 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-full h-full object-cover grayscale opacity-50" />
                  </div>
                ))}
                <div className="h-10 px-4 flex items-center justify-center bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                  {t('owners')}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Product View */}
          <div className="relative flex justify-center items-center h-[500px] md:h-[700px]">
            {/* Ambient Lighting Behind Product */}
            <motion.div 
               animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute w-[80%] h-[80%] bg-amber-500/10 rounded-full blur-[100px] z-0"
            />
            
            <motion.div 
              style={{ y, rotate }}
              className="relative z-10 w-full h-full flex flex-col items-center justify-center"
            >
              <div className="relative w-full aspect-square max-w-[500px] group cursor-pointer">
                <Image 
                  src="/images/premium_saddle.png"
                  alt="Premium Luxury Saddle"
                  fill
                  className="object-contain drop-shadow-[0_50px_100px_rgba(0,0,0,0.8)] filter transition-all duration-700 group-hover:drop-shadow-[0_70px_120px_rgba(234,179,8,0.2)] group-hover:scale-105"
                  priority
                />
                
                {/* Hotspots */}
                <Hotspot x="25%" y="40%" label={t('hotspot1')} delay={1} />
                <Hotspot x="75%" y="30%" label={t('hotspot2')} delay={1.2} />
                <Hotspot x="50%" y="80%" label={t('hotspot3')} delay={1.4} />
              </div>

              {/* Reflection Effect */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-full h-1/2 -mt-10 overflow-hidden opacity-20 pointer-events-none select-none hidden md:block">
                <div className="relative w-full aspect-square max-w-[500px] scale-y-[-1] blur-md grayscale brightness-50">
                  <Image 
                    src="/images/premium_saddle.png"
                    alt="Reflection"
                    fill
                    className="object-contain"
                  />
                  {/* Mask for fading reflection */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Side Label */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 vertical-text hidden lg:block">
        <span className="text-stone-800 text-[120px] font-black uppercase tracking-tighter mix-blend-overlay opacity-10 leading-none">
          PERFECTION
        </span>
      </div>

      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
          transform: translateY(-50%) rotate(180deg);
        }
      `}</style>
    </section>
  );
}

function Hotspot({ x, y, label, delay }: { x: string, y: string, label: string, delay: number }) {
  return (
    <motion.div 
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      style={{ left: x, top: y }}
      className="absolute z-20 group/hotspot"
    >
      <div className="relative">
        <div className="w-4 h-4 rounded-full bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.8)] animate-pulse" />
        <div className="w-10 h-10 rounded-full bg-amber-500/20 absolute -inset-3 animate-ping" />
        
        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-32 whitespace-normal bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest opacity-0 group-hover/hotspot:opacity-100 transition-all duration-500 translate-x-4 group-hover/hotspot:translate-x-0 shadow-2xl">
          {label}
        </div>
      </div>
    </motion.div>
  );
}

