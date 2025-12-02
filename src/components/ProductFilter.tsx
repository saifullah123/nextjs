'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

type Category = {
  id: string;
  name: string;
};

export default function ProductFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    startTransition(() => {
      router.replace(`/products?${params.toString()}`);
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    startTransition(() => {
      router.replace(`/products?${params.toString()}`);
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Search Products
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search products..."
            defaultValue={currentSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
        </div>
        <div className="w-full md:w-64">
          <label htmlFor="category" className="sr-only">
            Filter by Category
          </label>
          <select
            id="category"
            value={currentCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isPending && <div className="text-sm text-purple-600 mt-2">Updating...</div>}
    </div>
  );
}
