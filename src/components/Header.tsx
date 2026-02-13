'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCategories, getFeaturedProducts } from '@/lib/actions';

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
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const [cats, products] = await Promise.all([
        getCategories(),
        getFeaturedProducts()
      ]);
      setCategories(cats);
      setFeaturedProducts(products);
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4" suppressHydrationWarning>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform duration-300">
              P
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
              ProductCase
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search premium products..."
                className="w-full px-5 py-2.5 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all duration-300 outline-none"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-8 shrink-0">
            <Link
              href="/"
              className="text-gray-600 hover:text-purple-600 font-semibold transition-colors duration-200 relative group py-2"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <div
              className="static py-2"
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
            >
              <button className="text-gray-600 hover:text-purple-600 font-semibold transition-colors duration-200 flex items-center gap-1.5 group relative">
                Products
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ${isProductsOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="absolute bottom-[-8px] left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
              
              {/* Mega Menu */}
              {isProductsOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 transition-all duration-300 ease-out opacity-100 translate-y-0">
                  <div className="container mx-auto px-6 py-10">
                    <div className="grid grid-cols-12 gap-10">
                      {/* Categories Column */}
                      <div className="col-span-3">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Explore Categories</h3>
                        <div className="space-y-4">
                          <Link 
                            href="/products" 
                            className="block text-gray-900 font-bold hover:text-purple-600 transition-colors flex items-center gap-2 group"
                            onClick={() => setIsProductsOpen(false)}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            All Products
                          </Link>
                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/products?category=${cat.slug}`}
                              className="group flex flex-col items-start pl-3.5 border-l-2 border-transparent hover:border-purple-600 transition-all"
                              onClick={() => setIsProductsOpen(false)}
                            >
                              <span className="text-gray-700 font-semibold group-hover:text-purple-600 transition-colors">
                                {cat.name}
                              </span>
                              {cat.description && (
                                <span className="text-[11px] text-gray-400 group-hover:text-gray-500 transition-colors line-clamp-1 mt-0.5">
                                  {cat.description}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Quick Links Column */}
                      <div className="col-span-3">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Curated Collections</h3>
                        <div className="space-y-4">
                          {[
                            { label: 'New Arrivals', href: '/products?sort=newest', color: 'text-gray-700' },
                            { label: 'Featured Items', href: '/products?featured=true', color: 'text-gray-700' },
                            { label: 'Most Popular', href: '/products?sort=popular', color: 'text-gray-700' },
                            { label: 'Special Offers', href: '/products?onSale=true', color: 'text-pink-600' },
                          ].map((item) => (
                            <Link 
                              key={item.label}
                              href={item.href} 
                              className={`block ${item.color} font-semibold hover:text-purple-600 transition-colors flex items-center gap-2 group`}
                            >
                              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Featured Products Column */}
                      <div className="col-span-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Featured Selection</h3>
                          <Link href="/products" className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 group">
                            View All Showcase
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                          </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          {featuredProducts.length > 0 ? (
                            featuredProducts.map((product) => (
                              <Link 
                                key={product.id}
                                href={`/products/${product.slug}`}
                                className="group flex gap-4 p-4 rounded-2xl border border-gray-50 hover:border-purple-100 hover:bg-purple-50/30 transition-all duration-300"
                                onClick={() => setIsProductsOpen(false)}
                              >
                                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0 shadow-inner">
                                  {product.mainImage ? (
                                    <img 
                                      src={product.mainImage} 
                                      alt={product.title}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col justify-center">
                                  <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">{product.title}</h4>
                                  <p className="text-lg font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-1">
                                    ${Number(product.price).toFixed(2)}
                                  </p>
                                </div>
                              </Link>
                            ))
                          ) : (
                             <div className="col-span-2 py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                               <p className="text-sm text-gray-400 font-medium">No featured products at the moment.</p>
                             </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Decorative Bottom Bar */}
                  <div className="h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600"></div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="text-gray-600 hover:text-purple-600 font-semibold transition-colors duration-200 relative group py-2"
            >
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <Link
              href="/contact"
              className="text-gray-600 hover:text-purple-600 font-semibold transition-colors duration-200 relative group py-2"
            >
              Contact Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* CTA Button - Desktop */}
          <Link
            href="/products"
            className="hidden lg:block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-purple-500/25 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 shrink-0"
          >
            Shop Now
          </Link>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-6 animate-in slide-in-from-top-4 duration-300">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3.5 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-2xl transition font-bold"
              >
                Home
              </Link>
              <div className="flex flex-col">
                <Link
                  href="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3.5 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-2xl transition font-bold flex items-center justify-between"
                >
                  Products
                </Link>
                {/* Mobile Categories Submenu (Simplified) */}
                <div className="pl-6 flex flex-col gap-1">
                  {categories.slice(0, 5).map(cat => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-2 text-gray-500 hover:text-purple-600 transition text-sm font-medium"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3.5 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-2xl transition font-bold"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3.5 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-2xl transition font-bold"
              >
                Contact Us
              </Link>
              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 px-4 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-xl shadow-purple-500/20 text-center active:scale-95 transition-transform"
              >
                Shop Now
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
