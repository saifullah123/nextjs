import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import CategoryTabs from '@/components/CategoryTabs';
import TestimonialSlider from '@/components/TestimonialSlider';
import HeroSlider from '@/components/HeroSlider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  alternates: {
    canonical: '/',
  },
};

import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  noStore();
  const [categories, testimonials, banners] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      include: {
        products: {
          where: { isActive: true },
          take: 6,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
  ]);
  
  console.log('HomePage Testimonials Ratings:', testimonials.map(t => ({ id: t.id, rating: t.rating, name: t.name })));

  return (
    <div>
      {/* Hero Section */}
      {banners.length > 0 ? (
        <HeroSlider banners={banners} />
      ) : (
        <section className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white">
          <div className="container mx-auto px-6 py-20 md:py-32">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Premium Product Cases
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-purple-100">
                Protect your devices with style. Discover our collection of high-quality cases designed for perfection.
              </p>
              <Link
                href="/products"
                className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-2xl"
              >
                View Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Category Tabs Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Browse by Category</h2>
            <p className="text-gray-600 text-lg">Find the perfect case for your device</p>
          </div>
          
          {categories.length > 0 ? (
            <CategoryTabs
              categories={categories.map((cat) => ({
                ...cat,
                products: cat.products.map((p) => ({
                  ...p,
                  price: Number(p.price),
                })),
              }))}
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              No categories available yet.
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
              <p className="text-gray-600 text-lg">Real reviews from real customers</p>
            </div>
            
            <TestimonialSlider testimonials={testimonials} key={JSON.stringify(testimonials)} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Protect Your Device?</h2>
          <p className="text-xl mb-8 text-purple-100">
            Browse our full collection and find your perfect case today
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-2xl"
          >
            Shop All Products
          </Link>
        </div>
      </section>
    </div>
  );
}
