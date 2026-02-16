import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { deleteProduct } from './actions';
import { GenericDeleteButton } from '@/components/GenericDeleteButton';

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

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">SKU</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Active</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Featured</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(products || []).map((product) => {
                const getStatusBadge = (status: string) => {
                  const badges: Record<string, { text: string; class: string }> = {
                    in_stock: { text: '✅ In Stock', class: 'bg-green-100 text-green-700' },
                    out_of_stock: { text: '❌ Out of Stock', class: 'bg-red-100 text-red-700' },
                    pre_order: { text: '📦 Pre-Order', class: 'bg-blue-100 text-blue-700' },
                    discontinued: { text: '⛔ Discontinued', class: 'bg-gray-100 text-gray-700' },
                  };
                  return badges[status] || badges.in_stock;
                };
                const statusBadge = getStatusBadge(product.status);
                
                const categoryName = product.category?.name || 'Uncategorized';

                return (
                <tr key={product.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.mainImage && (
                        <img
                          src={product.mainImage}
                          alt={product.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium text-gray-800">{product.title}</div>
                        <div className="text-sm text-gray-500 font-mono">{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.sku ? (
                      <span className="font-mono text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {product.sku}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{categoryName}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">${product.price.toString()}</td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${product.quantity === 0 ? 'text-red-600' : product.quantity < 10 ? 'text-orange-600' : 'text-green-600'}`}>
                      {product.quantity}
                    </span>
                    {product.quantity < 10 && product.quantity > 0 && (
                      <span className="ml-2 text-xs text-orange-600">⚠️ Low</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.class}`}>
                      {statusBadge.text}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {product.isActive ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-semibold">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {product.isFeatured && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                        ⭐ Featured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </Link>
                    <GenericDeleteButton
                      itemId={product.id}
                      itemName="product"
                      onDelete={async () => {
                        'use server';
                        await deleteProduct(product.id);
                      }}
                    />
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>

          {(!products || products.length === 0) && (
            <div className="text-center py-12 text-gray-500">
              No products yet. Create your first product!
            </div>
          )}
        </div>
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
