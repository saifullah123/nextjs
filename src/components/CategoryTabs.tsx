'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  shortDescription: string | null;
  mainImage: string | null;
  status: string;
  isFeatured: boolean;
}

interface CategoryTabsProps {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    products: Product[];
  }>;
}

export default function CategoryTabs({ categories }: CategoryTabsProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '');

  const activeProducts = categories.find((cat) => cat.id === activeCategory)?.products || [];

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              activeCategory === category.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            <div className="relative">
              {product.mainImage && (
                <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-4">
                  <img
                    src={product.mainImage}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {product.isFeatured && (
                  <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Featured
                  </div>
                )}
                {product.status === 'in_stock' && (
                  <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    In Stock
                  </div>
                )}
                {product.status === 'out_of_stock' && (
                  <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Out of Stock
                  </div>
                )}
                {product.status === 'pre_order' && (
                  <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Pre-order
                  </div>
                )}
                {product.status === 'discontinued' && (
                  <div className="bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Discontinued
                  </div>
                )}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{product.title}</h3>
              {product.shortDescription && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.shortDescription}
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ${product.price.toString()}
                </span>
                <Link
                  href={`/products/${product.slug}`}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No products in this category yet.
        </div>
      )}
    </div>
  );
}
