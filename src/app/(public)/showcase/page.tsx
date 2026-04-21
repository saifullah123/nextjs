'use client';

import ProductShowcase from "@/components/ProductShowcase";
import { useTranslations } from '@/hooks/useTranslations';

export default function ShowcasePage() {
  const t = useTranslations('Showcase');

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <ProductShowcase />
      
      {/* Additional Sections to give context */}
      <section className="py-24 bg-stone-950 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
            <h3 className="text-3xl font-black text-white uppercase tracking-widest mb-12">{t('detailsTitle')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                {[
                    { title: t('feature1.title'), desc: t('feature1.desc') },
                    { title: t('feature2.title'), desc: t('feature2.desc') },
                    { title: t('feature3.title'), desc: t('feature3.desc') }
                ].map((item, i) => (
                    <div key={i} className="glass-card p-10 rounded-3xl hover-lift">
                        <div className="text-amber-500 font-bold text-4xl mb-6">0{i+1}</div>
                        <h4 className="text-white font-black text-xl mb-4 uppercase tracking-tighter">{item.title}</h4>
                        <p className="text-stone-500 font-light leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </main>
  );
}
