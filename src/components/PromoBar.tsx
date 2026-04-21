'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { motion } from 'framer-motion';
import { Sparkles, Truck, Clock, ShieldCheck, Diamond } from 'lucide-react';

export default function PromoBar() {
  const t = useTranslations('PromoBar');

  const items = [
    { icon: Sparkles, text: t('summerDrop') || 'Exclusive Summer Collection 2026' },
    { icon: Truck, text: t('freeShipping') || 'Premium Stable Delivery Available' },
    { icon: Clock, text: t('limitedStock') || 'Limited Artisanal Pieces Remaining' },
    { icon: ShieldCheck, text: 'Elite Craftsmanship Guaranteed' },
    { icon: Diamond, text: 'The Pinnacle of Equestrian Luxury' },
  ];

  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="bg-[#0a0a0a] text-white py-2.5 overflow-hidden border-b border-white/5 relative z-[60]">
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{
            x: [0, -1000],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex items-center gap-20 px-8"
        >
          {duplicatedItems.map((item, index) => (
            <div key={index} className="flex items-center gap-5 group cursor-default">
              <item.icon size={11} className="text-amber-500 group-hover:scale-125 transition-transform duration-500" />
              <span className="text-[8px] font-black uppercase tracking-[0.6em] text-white/70 group-hover:text-white transition-all duration-500">
                {item.text}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Side Fades for Premium Look */}
      <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />
    </div>
  );
}
