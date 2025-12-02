import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import ProductFilter from '@/components/ProductFilter';
import { Suspense } from 'react';
import { Metadata } from 'next';


export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}): Promise<Metadata> {
  const { category, search } = await searchParams;

  if (category) {
    const categoryData = await prisma.category.findUnique({
      where: { id: category },
    });
    if (categoryData) {
      return {
        title: `${categoryData.name} - ProductCase`,
        description: categoryData.description || `Browse our ${categoryData.name} collection.`,
      };
    }
  }

  if (search) {
    return {
      title: `Search Results for "${search}" - ProductCase`,
    };
  }

  return {
    title: 'Our Collection - ProductCase',
    description: 'Explore our premium range of cases designed to protect and enhance your devices.',
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { search, category } = await searchParams;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        AND: [
          {
            isActive: true,
          },
          {
            category: {
              isActive: true,
              ...(category ? { id: category } : {}),
            },
          },
          search
            ? {
                OR: [
                  { title: { contains: search } }, // Removed mode: 'insensitive' for SQLite compatibility if needed, but usually it's fine. SQLite default is case insensitive for ASCII.
                  { shortDescription: { contains: search } },
                ],
              }
            : {},
        ],
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Collection
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our premium range of cases designed to protect and enhance your devices.
          </p>
        </div>

        <Suspense fallback={<div>Loading filters...</div>}>
          <ProductFilter categories={categories} />
        </Suspense>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-64 bg-gray-100 flex items-center justify-center p-4">
                  {product.mainImage ? (
                    <img
                      src={product.mainImage}
                      alt={product.title}
                      className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {product.isFeatured && (
                      <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        Featured
                      </div>
                    )}
                    {/* Stock Status Badge */}
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
                  <div className="text-sm text-purple-600 font-semibold mb-2">
                    {product.category.name}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.shortDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price.toString()}
                    </span>
                    <span className="text-purple-600 font-medium group-hover:underline">
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-400 text-xl mb-4">No products found</div>
            <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
}
