import { prisma } from '@/lib/prisma';
import { GenericDeleteButton } from '@/components/GenericDeleteButton';
import Link from 'next/link';
import { deleteCategory } from './actions';



export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

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

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Slug</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Products</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-medium text-gray-800">{category.name}</td>
                <td className="px-6 py-4 text-gray-600 font-mono text-sm">{category.slug}</td>
                <td className="px-6 py-4 text-gray-600">{category._count.products}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      category.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link href={`/admin/categories/${category.id}/edit`} className="text-blue-600 hover:text-blue-800 font-medium">Edit</Link>
                  <GenericDeleteButton 
                    itemId={category.id} 
                    itemName="category" 
                    onDelete={async () => {
                      'use server';
                      await deleteCategory(category.id);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No categories yet. Create your first category!
          </div>
        )}
      </div>
    </div>
  );
}
