import { prisma } from '@/lib/prisma';
import { createProduct } from '../actions';
import { ProductFormClient } from '@/components/ProductFormClient';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  let categories: { id: string; name: string }[] = [];
  try {
    categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Add Product</h1>
        <p className="text-gray-600">Create a new product</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <ProductFormClient
          categories={categories || []}
          onSubmit={createProduct}
          submitLabel="Create Product"
        />
      </div>
    </div>
  );
}
