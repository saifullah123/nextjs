import { prisma } from '@/lib/prisma';
import { updateProduct } from '../../actions';
import { ProductFormClient } from '@/components/ProductFormClient';
import { notFound } from 'next/navigation';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Edit Product</h1>
        <p className="text-gray-600">Update product information</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <ProductFormClient
          categories={categories}
          onSubmit={async (formData) => {
            'use server';
            const result = await updateProduct(id, formData);
            if (result?.error) return result;
          }}
          initialData={{
            title: product.title,
            slug: product.slug,
            sku: product.sku || '',
            price: Number(product.price),
            quantity: product.quantity,
            categoryId: product.categoryId ?? undefined,
            shortDescription: product.shortDescription || '',
            longDescription: product.longDescription || '',
            mainImage: product.mainImage || '',
            galleryImages: product.galleryImages || '',
            isFeatured: product.isFeatured,
            status: product.status,
            isActive: product.isActive,
            metaTitle: product.metaTitle || '',
            metaDescription: product.metaDescription || '',
            metaKeywords: product.metaKeywords || '',
            tags: product.tags,
          }}
          submitLabel="Update Product"
          isEdit={true}
        />
      </div>
    </div>
  );
}
