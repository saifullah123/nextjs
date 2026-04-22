import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { deleteProduct } from './actions';
import ProductTable from './ProductTable';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  console.log("Rendering Admin Products Page");
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Serialize products for client consumption (Prisma Decimal is not a plain object)
    const serializedProducts = products.map(product => ({
      ...product,
      price: product.price ? product.price.toString() : '—',
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));

    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Products</h1>
            <p className="text-gray-600">Manage your product catalog</p>
          </div>
          <Link
            href="/admin/products/new"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
          >
            + Add Product
          </Link>
        </div>

        <ProductTable products={serializedProducts} />
      </div>
    );
  } catch (error) {
    console.error("Error loading products:", error);
    return (
      <div className="p-8 text-center text-red-600">
        <h2 className="text-xl font-bold mb-2">Error Loading Products</h2>
        <p>There was an error loading the product list. Please try again later.</p>
        <p className="text-sm mt-4 text-gray-500">{(error as Error).message}</p>
      </div>
    );
  }
}
