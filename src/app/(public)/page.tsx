'use client';

import Link from 'next/link';
import CategoryTabs from '@/components/CategoryTabs';
import TestimonialSlider from '@/components/TestimonialSlider';
import HeroSlider from '@/components/HeroSlider';
import { useTranslations } from '@/hooks/useTranslations';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Leaf, Diamond, Sparkles, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCategories, getTestimonials, getBanners } from '@/lib/actions';

export default function HomePage() {
  const t = useTranslations('Hero');
  const tFeatured = useTranslations('Featured');
  const tWhy = useTranslations('WhyUs');
  const tNewsletter = useTranslations('Newsletter');
  const tCommunity = useTranslations('Community');
  const tTestimonials = useTranslations('Testimonials');
  const tc = useTranslations('Common');

  const [categories, setCategories] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, tests, bans] = await Promise.all([
          getCategories(),
          getTestimonials(),
          getBanners()
        ]);
        setCategories(cats);
        setTestimonials(tests);
        setBanners(bans);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
         <div className="w-12 h-12 border-4 border-amber-600/20 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 pb-20">
      {/* Hero Section */}
      {banners.length > 0 ? (
        <HeroSlider banners={banners} />
      ) : (
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/luxury-saddle.png" 
              alt="Luxury Horse Tack" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10 pt-20">
            <motion.div 
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-4xl"
            >
              <motion.span 
                variants={fadeIn}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-500/20 text-amber-400 font-black text-[10px] uppercase tracking-[0.4em] mb-10 border border-amber-500/30 backdrop-blur-md"
              >
                <Sparkles className="w-3 h-3" />
                {t('badge')}
              </motion.span>
              
              <motion.h1 
                variants={fadeIn}
                className="text-3xl sm:text-5xl md:text-7xl lg:text-9xl font-black mb-8 md:mb-12 leading-[1] md:leading-[0.8] tracking-tighter text-white uppercase font-heading drop-shadow-2xl"
              >
                {t.rich('title', {
                  br: (chunks: any) => <br />,
                  BR: (chunks: any) => <br />,
                  span: (chunks: any) => <span className="text-gradient block">{chunks}</span>
                })}
              </motion.h1>
              
              <motion.p 
                variants={fadeIn}
                className="text-lg md:text-3xl mb-16 text-gray-300 max-w-2xl font-medium leading-relaxed"
              >
                {t('subtitle')}
              </motion.p>
              
              <motion.div 
                variants={fadeIn}
                className="flex flex-col sm:flex-row items-center gap-6"
              >
                <Link
                  href="/products"
                  className="w-full sm:w-auto px-10 md:px-16 py-5 md:py-7 bg-white text-slate-900 rounded-2xl font-black text-lg md:text-xl hover:shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:-translate-y-1.5 transition-all duration-500 flex items-center justify-center gap-4 group relative overflow-hidden"
                >
                  <span className="relative z-10 uppercase tracking-widest">{t('explore')}</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
                <Link
                  href="/about"
                  className="w-full sm:w-auto px-10 md:px-16 py-5 md:py-7 bg-white/10 text-white rounded-2xl font-black text-lg md:text-xl border border-white/20 hover:bg-white/20 transition-all duration-500 backdrop-blur-md"
                >
                  {t('ourStory')}
                </Link>
              </motion.div>
            </motion.div>
          </div>
          
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-4 animate-bounce">
             <div className="w-[1px] h-20 bg-gradient-to-b from-white to-transparent opacity-50"></div>
             <span className="text-[10px] text-white font-black uppercase tracking-[0.5em] opacity-40 [writing-mode:vertical-lr]">Scroll to Explore</span>
          </div>

          <div className="absolute bottom-12 right-12 z-10 hidden xl:block">
             <div className="glass-panel p-8 rounded-[2.5rem] flex flex-col gap-4 border-amber-500/20 max-w-xs group cursor-default hover:scale-105 transition-transform duration-500">
                <div className="flex gap-1">
                   {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />)}
                </div>
                <p className="text-white font-bold italic text-sm group-hover:text-amber-400 transition-colors">"The finest leatherwork I've ever experienced in my 20 years of riding."</p>
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full border border-amber-500/50 p-0.5">
                      <img src="/images/stable-lifestyle.png" className="w-full h-full object-cover rounded-full" />
                   </div>
                   <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest">— Sarah Jenkins, Pro Eventer</span>
                </div>
             </div>
          </div>

          <div className="absolute -bottom-1 w-full h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
        </section>
      )}

      {/* Trust Bar */}
      {/* <section className="py-20 border-y border-gray-100/50 bg-white/30 backdrop-blur-md relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-40 grayscale contrast-125"
          >
             <span className="text-2xl font-black tracking-tighter italic hover:opacity-100 transition-opacity cursor-default hover:text-gray-900">HERMÈS</span>
             <span className="text-2xl font-black tracking-tighter hover:opacity-100 transition-opacity cursor-default hover:text-gray-900">BUTET</span>
             <span className="text-2xl font-black tracking-tighter italic text-amber-700 hover:opacity-100 transition-opacity cursor-default">DEVOUCOUX</span>
             <span className="text-2xl font-black tracking-tighter uppercase hover:opacity-100 transition-opacity cursor-default hover:text-gray-900">CWD</span>
             <span className="text-2xl font-black tracking-tighter hover:opacity-100 transition-opacity cursor-default hover:text-gray-900">PARIANI</span>
          </motion.div>
        </div>
      </section> */}

      {/* Featured Collections Section */}
      <section className="py-20 md:py-40 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8 md:gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <span className="text-amber-700 font-black text-xs uppercase tracking-[0.4em] mb-6 block">{tFeatured('label')}</span>
              <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-black text-gray-900 tracking-tighter leading-[0.85] mb-8 md:mb-10 font-heading">
                {tFeatured.rich('title', {
                  br: (chunks: any) => <br />,
                  BR: (chunks: any) => <br />,
                  span: (chunks: any) => <span className="text-gradient">{chunks}</span>
                })}
              </h2>
              <p className="text-gray-500 text-xl font-medium max-w-lg leading-relaxed">{tFeatured('subtitle')}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Link href="/products" className="group flex items-center gap-6 text-xl font-black text-gray-900 hover:text-amber-700 transition-all">
                <span>{tFeatured('viewAll')}</span>
                <div className="w-20 h-20 rounded-[2rem] transition-all duration-500 shadow-xl bg-white flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white group-hover:rotate-45">
                  <ArrowRight className="w-8 h-8" />
                </div>
              </Link>
            </motion.div>
          </div>
          
          {categories.length > 0 ? (
            <CategoryTabs
              categories={categories.map((cat) => ({
                ...cat,
                products: cat.products.map((p: any) => ({
                  ...p,
                  price: Number(p.price),
                })),
              }))}
            />
          ) : (
            <div className="glass-panel p-24 rounded-[3rem] text-center">
              <p className="text-gray-400 font-black uppercase tracking-widest text-sm">New collections arriving soon...</p>
            </div>
          )}
        </div>
        
        {/* Editorial Breakdown Section - To break the template feel */}
        <div className="container mx-auto px-6 mt-40">
           <div className="grid lg:grid-cols-2 gap-24 items-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-[4/5] rounded-[4rem] overflow-hidden group shadow-[0_80px_150px_-30px_rgba(0,0,0,0.3)]"
              >
                 <img 
                   src="/images/bridle-detail.png" 
                   alt="Artisan Leather Craftsmanship" 
                   className="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-16">
                    <div className="max-w-xs">
                       <span className="text-amber-500 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Process</span>
                       <h4 className="text-3xl font-black text-white uppercase italic leading-none tracking-tighter">120 Hours <br /> <span className="text-amber-500">Of Hand Carving</span></h4>
                    </div>
                 </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="flex flex-col gap-12"
              >
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-[2px] bg-amber-600"></div>
                    <span className="text-amber-700 font-black text-xs uppercase tracking-[0.4em]">The Signature Series</span>
                 </div>
                 <h3 className="text-5xl md:text-7xl font-black text-slate-950 uppercase italic leading-[0.9] tracking-tighter font-heading">
                    Engineered for <br />
                    <span className="text-amber-600">The Perfectionist.</span>
                 </h3>
                 <p className="text-gray-500 text-2xl font-medium leading-relaxed max-w-lg">
                    We don't mass produce. We curate. Each saddle is a bespoke commission, balancing the rider's center of gravity with anatomically shaped trees for the ultimate equine connection.
                 </p>
                 
                 <div className="grid grid-cols-2 gap-10 mt-6">
                    <div className="flex flex-col gap-3">
                       <div className="text-4xl font-black text-slate-900 tracking-tighter">0.1mm</div>
                       <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stitching Precision</div>
                    </div>
                    <div className="flex flex-col gap-3">
                       <div className="text-4xl font-black text-slate-900 tracking-tighter">Grade A</div>
                       <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hermann Oak Leather</div>
                    </div>
                 </div>

                 <Link 
                   href="/about" 
                   className="w-fit flex items-center gap-4 px-10 py-5 bg-slate-950 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-amber-600 transition-all shadow-2xl group"
                 >
                    Explore The Process
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                 </Link>
              </motion.div>
           </div>
        </div>

        <div className="absolute -left-20 top-1/2 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute -right-20 bottom-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-[100px] -z-10"></div>
      </section>

      {/* Why Section */}
      <section className="py-20 md:py-40 bg-primary text-white rounded-[40px] md:rounded-[120px] mx-4 md:mx-12 overflow-hidden relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-4xl mx-auto text-center mb-32"
          >
             <h2 className="text-2xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-8 md:mb-10 tracking-tighter leading-[0.8] uppercase font-heading text-white px-4">
                {tWhy.rich('title', {
                  span: (chunks: any) => <span className="text-amber-500">{chunks}</span>,
                  br: (chunks: any) => <br />,
                  BR: (chunks: any) => <br />
                })}
             </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 lg:gap-16">
            {[
              { key: 'military', icon: <ShieldCheck className="w-16 h-16" />, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
              { key: 'eco', icon: <Leaf className="w-16 h-16" />, color: 'bg-amber-400/10 text-amber-400 border-amber-400/20' },
              { key: 'life', icon: <Diamond className="w-16 h-16" />, color: 'bg-amber-300/10 text-amber-300 border-amber-300/20' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center group p-12 rounded-[3.5rem] hover:bg-white/5 transition-all duration-700 border border-transparent hover:border-white/10"
              >
                <div className={`w-36 h-36 rounded-[2.5rem] ${item.color} border-2 flex items-center justify-center mb-12 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-1000 shadow-2xl relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item.icon}
                </div>
                <h3 className="text-4xl font-black mb-6 tracking-tight uppercase font-heading text-white">{tWhy(`${item.key}.title`)}</h3>
                <p className="text-gray-300 text-xl font-medium leading-relaxed max-w-xs">{tWhy(`${item.key}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-amber-600/10 rounded-full blur-[200px] animate-pulse-slow"></div>
        <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-amber-900/40 rounded-full blur-[150px]"></div>
      </section>

      {/* Community Section (Trust) */}
        <section className="py-20 md:py-40 overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
             <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
             >
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900/5 text-slate-900 font-black text-[10px] uppercase tracking-[0.4em] mb-10 border border-slate-900/10">
                  <Star className="w-3 h-3 fill-slate-900" />
                  {tCommunity('badge')}
                </span>
                <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-black text-gray-900 tracking-tighter leading-[0.85] mb-8 md:mb-10 uppercase font-heading">
                   {tCommunity.rich('title', {
                     br: () => <br />,
                     span: (chunks: any) => <span className="text-gradient">{chunks}</span>
                   })}
                </h2>
                <p className="text-gray-500 text-2xl font-medium leading-relaxed mb-16 max-w-xl">
                   {tCommunity('description')}
                </p>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-12 sm:gap-16">
                   <div className="group text-center sm:text-left">
                      <div className="text-5xl sm:text-6xl font-black text-gray-900 group-hover:text-amber-700 transition-colors">100%</div>
                      <div className="text-[10px] sm:text-sm font-bold text-gray-400 uppercase tracking-widest mt-3">{tCommunity('stat1')}</div>
                   </div>
                   <div className="hidden sm:block w-px h-20 bg-gray-100"></div>
                   <div className="block sm:hidden w-20 h-px bg-gray-100"></div>
                   <div className="group text-center sm:text-left">
                      <div className="text-5xl sm:text-6xl font-black text-gray-900 group-hover:text-amber-600 transition-colors">4.9/5</div>
                      <div className="text-[10px] sm:text-sm font-bold text-gray-400 uppercase tracking-widest mt-3">{tCommunity('stat2')}</div>
                   </div>
                </div>
             </motion.div>
             
             <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "circOut" }}
              className="relative"
             >
                  <div className="p-4 bg-white rounded-[5rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.2)] relative z-10 overflow-hidden border border-gray-100">
                    <img 
                     src="/images/elite-lifestyle.png" 
                     alt="Elite Equestrian Lifestyle" 
                     className="w-full h-[400px] md:h-[850px] object-cover rounded-[3rem] md:rounded-[4.5rem] hover:scale-110 transition-transform duration-[3000ms] ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex items-end p-10 md:p-20">
                       <div className="max-w-md">
                         <div className="flex gap-1 mb-6">
                           {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 md:w-6 h-6 fill-amber-400 text-amber-400" />)}
                         </div>
                         <p className="text-white text-xl md:text-4xl font-black leading-tight italic tracking-tighter">{tCommunity('quote')}</p>
                         <div className="mt-8 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border-2 border-amber-400 overflow-hidden">
                               <img src="/images/stable-lifestyle.png" className="w-full h-full object-cover" />
                            </div>
                            <div>
                               <div className="text-white font-black text-sm uppercase tracking-widest">{tCommunity('artisan')}</div>
                               <div className="text-amber-400 text-[10px] font-bold">{tCommunity('experience')}</div>
                            </div>
                         </div>
                       </div>
                    </div>
                 </div>
                 <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                 <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-[120px] animate-pulse-slow delay-[3000ms]"></div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-20 md:py-40 bg-gray-50/50 relative">
          <div className="container mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-32"
            >
               <span className="text-amber-600 font-black text-xs uppercase tracking-[0.4em] mb-6 md:mb-8 block">{tTestimonials('label')}</span>
              <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-9xl font-black text-gray-900 tracking-tighter leading-[0.8] uppercase font-heading">
                {tTestimonials.rich('title', {
                  br: () => <br />,
                  span: (chunks: any) => <span className="text-gradient">{chunks}</span>
                })}
              </h2>
            </motion.div>
            
            <TestimonialSlider testimonials={testimonials} key={JSON.stringify(testimonials)} />
          </div>
        </section>
      )}

      {/* Newsletter CTA Section */}
      <section className="py-20 md:py-40">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-950 p-8 sm:p-16 md:p-32 rounded-[40px] md:rounded-[120px] flex flex-col items-center text-center relative overflow-hidden group shadow-[0_60px_120px_-20px_rgba(0,0,0,0.6)]"
          >
            <div className="relative z-10 flex flex-col items-center">
               <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 rounded-3xl bg-white/10 flex items-center justify-center text-5xl mb-14 shadow-2xl border border-white/20 backdrop-blur-xl"
               >
                  ✉️
               </motion.div>
               <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-9xl font-black mb-8 md:mb-12 tracking-tighter text-white leading-[0.8] uppercase max-w-5xl font-heading">
                 {tNewsletter.rich('title', {
                    br: (chunks: any) => <br />,
                    BR: (chunks: any) => <br />
                 })}
               </h2>
               <p className="text-gray-400 text-2xl mb-20 max-w-2xl font-medium leading-relaxed">
                 {tNewsletter('subtitle')}
               </p>
               <div className="flex flex-col sm:flex-row gap-8 w-full max-w-3xl">
                  <input 
                    type="email" 
                    placeholder={tNewsletter('placeholder')} 
                    className="flex-1 px-12 py-7 rounded-[2.5rem] bg-white/5 border border-white/10 focus:bg-white/10 focus:ring-4 focus:ring-amber-500/30 focus:border-amber-400 outline-none font-bold text-white text-xl transition-all placeholder:text-gray-600"
                  />
                  <button className="px-16 py-7 bg-white text-slate-900 rounded-[2.5rem] font-black text-xl hover:bg-amber-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
                    {tNewsletter('button')}
                  </button>
               </div>
            </div>
            
             <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-600/10 rounded-full blur-[180px] -z-0"></div>
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[180px] -z-0"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
