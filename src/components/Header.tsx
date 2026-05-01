'use client';

import { useTranslations, useLocale } from '@/hooks/useTranslations';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { getCategories, getFeaturedProducts } from '@/lib/actions';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, ChevronDown, ShoppingBag, Globe, ArrowRight, Sparkles, Box, ShieldCheck, Zap } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getMediaUrl } from '@/lib/media_utils';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  mainImage: string | null;
  price: any;
}

export default function Header() {
  const t = useTranslations('Header');
  const tc = useTranslations('Common');
  const locale = useLocale();
  const pathname = usePathname();
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const langRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ar', name: 'العربية', flag: '🇦🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, products] = await Promise.all([
          getCategories(),
          getFeaturedProducts()
        ]);
        setCategories(cats);
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching header data:", error);
      }
    };
    fetchData();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname);
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
    return (
      <Link
        href={href}
        className={cn(
          "text-xs font-black uppercase tracking-[0.3em] transition-all duration-500 relative py-2 px-1 group flex items-center gap-1 whitespace-nowrap",
          "text-slate-900"
        )}
      >
        <span>{children}</span>
        <span className={cn(
          "absolute bottom-0 left-0 h-[2px] bg-amber-600 transition-all duration-500 rounded-full",
          isActive ? "w-full" : "w-0 group-hover:w-full"
        )}></span>
      </Link>
    );
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 transition-all duration-700 ease-in-out border-b",
        isScrolled 
          ? "py-3 bg-white/95 backdrop-blur-2xl border-gray-100/80 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)]" 
          : "py-6 bg-white/40 backdrop-blur-md border-white/20 shadow-sm"
      )}
    >
      <div className="container mx-auto px-6 max-w-screen-2xl">
        <div className="flex items-center justify-between gap-12">
          <Link href="/" className="flex items-center shrink-0 group relative z-10">
            <img 
              src="/logo.png" 
              alt="NET GATE Logo" 
              className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-700 group-hover:scale-105"
            />
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-12">
            <NavLink href="/">{tc('home')}</NavLink>
            
            <div
              className="relative py-2"
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
            >
              <button className={cn(
                "text-xs font-black uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-2 group cursor-pointer whitespace-nowrap",
                "text-slate-900 hover:text-amber-700"
              )}>
                {t('products')}
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-500", isProductsOpen && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {isProductsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.98, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 15, scale: 0.98, filter: 'blur(10px)' }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute top-full -left-48 w-[1000px] pt-6 pointer-events-auto"
                  >
                    <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] border border-gray-100/50 overflow-hidden p-2 backdrop-blur-3xl">
                      <div className="grid grid-cols-12">
                        {/* Sidebar */}
                        <div className="col-span-4 bg-slate-950 p-12 rounded-[2.5rem] flex flex-col justify-between relative overflow-hidden">
                           <div className="relative z-10">
                              <span className="text-amber-500 font-black text-[9px] uppercase tracking-[0.5em] mb-8 block">Exclusive Selection</span>
                              <h3 className="text-4xl font-black text-white tracking-tighter leading-none mb-12 uppercase italic">
                                Masterpieces <br /> Of <span className="text-amber-500">Tack</span>
                              </h3>
                              
                              <div className="flex flex-col gap-2">
                                <Link 
                                  href="/products" 
                                  className="group flex items-center justify-between p-5 rounded-2xl bg-white/5 hover:bg-white text-white hover:text-slate-900 transition-all duration-500"
                                  onClick={() => setIsProductsOpen(false)}
                                >
                                  <span className="font-bold text-sm">{t('masterpieces')}</span>
                                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                
                                {categories.slice(0, 3).map((cat) => (
                                  <Link
                                    key={cat.id}
                                    href={`/products?category=${cat.slug}`}
                                    className="group flex items-center justify-between p-5 rounded-2xl hover:bg-white/10 text-white/60 hover:text-white transition-all duration-500"
                                    onClick={() => setIsProductsOpen(false)}
                                  >
                                    <span className="font-medium text-sm">{cat.name}</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 scale-0 group-hover:scale-100 transition-transform" />
                                  </Link>
                                ))}
                              </div>
                           </div>

                           <div className="relative z-10 pt-12 border-t border-white/10 mt-12">
                              <p className="text-white/40 text-[10px] font-medium leading-relaxed italic">
                                "Handcrafted for elite equestrians who demand nothing but the absolute pinnacle of performance."
                              </p>
                           </div>

                           {/* Decor */}
                           <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
                        </div>

                        {/* Product Grid */}
                        <div className="col-span-8 p-12">
                          <div className="flex items-center justify-between mb-10">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-[1px] bg-gray-200" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">{t('collections')}</span>
                             </div>
                             <Link href="/products" className="group flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest hover:text-amber-700 transition-colors">
                                View Entire Archive
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                             </Link>
                          </div>

                          <div className="grid grid-cols-2 gap-8">
                             {featuredProducts.slice(0, 4).map((product) => (
                              <Link 
                                key={product.id}
                                href={`/products/${product.slug}`}
                                className="group flex items-center gap-6 p-4 rounded-3xl hover:bg-gray-50 transition-all duration-700 border border-transparent hover:border-gray-100"
                                onClick={() => setIsProductsOpen(false)}
                              >
                                <div className="w-24 h-24 bg-white rounded-2xl overflow-hidden shrink-0 shadow-sm border border-gray-100 group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-700 flex items-center justify-center p-4">
                                  {product.mainImage ? (
                                    <img 
                                      src={getMediaUrl(product.mainImage)} 
                                      alt={product.title}
                                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-1000 ease-[0.16, 1, 0.3, 1]"
                                    />
                                  ) : (
                                    <Box className="w-8 h-8 text-gray-200" strokeWidth={1} />
                                  )}
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">Elite Series</span>
                                  <h4 className="font-black text-slate-950 text-base leading-tight group-hover:text-amber-700 transition-colors duration-500 truncate max-w-[180px]">{product.title}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                     <span className="text-[10px] font-bold text-gray-400">Limited Collection</span>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>

                          <div className="mt-12 p-8 bg-amber-50 rounded-[2rem] border border-amber-100/50 flex items-center justify-between group cursor-pointer overflow-hidden relative">
                             <div className="relative z-10">
                                <h5 className="font-black text-slate-900 text-lg tracking-tight mb-1">Join the Elite Club</h5>
                                <p className="text-amber-800/60 text-[10px] font-bold uppercase tracking-widest">Early access to artisanal drops</p>
                             </div>
                             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-700 group-hover:bg-slate-900 group-hover:text-white transition-all duration-700 shadow-lg relative z-10">
                                <ShieldCheck size={24} />
                             </div>
                             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink href="/about">{t('about')}</NavLink>
            <NavLink href="/contact">{t('contact')}</NavLink>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-6 shrink-0 relative z-10">
             {/* Search Container */}
             <div className="hidden xl:flex items-center">
                <form 
                  onSubmit={handleSearch} 
                  className={cn(
                    "relative flex items-center overflow-hidden transition-all duration-700 ease-[0.16, 1, 0.3, 1]",
                    "bg-gray-100 hover:bg-gray-200",
                    "rounded-2xl border border-transparent group/search"
                  )}
                >
                  <div className="absolute left-4 z-10">
                     <Search className={cn(
                       "w-4 h-4 transition-colors duration-500",
                       "text-gray-500 group-hover/search:text-slate-950"
                     )} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className={cn(
                      "w-48 focus:w-72 px-11 py-3.5 outline-none bg-transparent font-bold text-xs ring-0 transition-all duration-700",
                      "text-slate-950 placeholder:text-gray-500"
                    )}
                  />
                  {searchQuery && (
                    <button 
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 hover:scale-110 transition-transform"
                    >
                      <X size={14} className="text-gray-400" />
                    </button>
                  )}
                </form>
             </div>

             {/* Action Buttons */}
             <div className="flex items-center gap-3">
                <div className="hidden sm:flex h-10 w-[1px] bg-gray-200" />
                
                <Link
                  href="/products"
                  className={cn(
                    "hidden sm:flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-700 relative overflow-hidden group shadow-xl active:scale-95",
                    "bg-slate-950 text-white hover:bg-amber-600 hover:shadow-amber-500/30",
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <span className="relative z-10">{t('shopNow')}</span>
                  <ShoppingBag size={18} className="relative z-10 group-hover:rotate-12 transition-transform duration-500" />
                </Link>

                {/* Mobile Toggle */}
                <button
                  className={cn(
                    "lg:hidden p-3.5 rounded-2xl transition-all duration-500 hover:rotate-90",
                    "bg-slate-950 text-white"
                  )}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
             </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="lg:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 z-50 overflow-hidden"
            >
               <div className="p-8 flex flex-col gap-10 bg-mesh">
                  <nav className="flex flex-col gap-6">
                      {[
                        { name: tc('home'), href: '/', tag: 'New' },
                        { name: t('products'), href: '/products', tag: 'Luxury' },
                        { name: t('about'), href: '/about' },
                        { name: t('contact'), href: '/contact' }
                      ].map((item, i) => (
                       <Link 
                        key={i}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group flex items-center justify-between py-2"
                       >
                         <div className="flex items-center gap-4">
                            <span className="text-2xl font-black tracking-tighter text-slate-950 group-hover:text-amber-700 transition-all duration-500">
                               {item.name}
                            </span>
                            {item.tag && (
                               <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[8px] font-black uppercase tracking-widest rounded-full">
                                  {item.tag}
                               </span>
                            )}
                         </div>
                         <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                            <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                         </div>
                       </Link>
                     ))}
                  </nav>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

