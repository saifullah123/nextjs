import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { deleteCategory } from './actions';
import CategoryTable from './CategoryTable';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  let categories;
  try {
    categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  } catch (error: any) {
    console.error('Failed to fetch categories:', error);
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block text-left">
          <h3 className="font-bold text-lg mb-2">Database Connection Error</h3>
          <p className="mb-4">Could not load categories. Please check your database settings.</p>
          <pre className="bg-white p-4 rounded border border-red-200 text-xs overflow-auto max-w-2xl">
            {error.message || JSON.stringify(error, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Categories</h1>
          <p className="text-gray-600">Manage product categories</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
        >
          + Add Category
        </Link>
      </div>

      <CategoryTable categories={categories} />
    </div>
  );
}
