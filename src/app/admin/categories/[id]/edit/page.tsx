import { prisma } from '@/lib/prisma';
import { updateCategory } from '../../actions';
import { notFound } from 'next/navigation';
import { CategoryFormClient } from '@/components/CategoryFormClient';

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Edit Category</h1>
        <p className="text-gray-600">Update category information</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl">
        <CategoryFormClient
          onSubmit={async (formData) => {
            'use server';
            await updateCategory(id, formData);
          }}
          initialData={{
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            isActive: category.isActive,
          }}
          submitLabel="Update Category"
          isEdit={true}
        />
      </div>
    </div>
  );
}
