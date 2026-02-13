import { prisma } from '@/lib/prisma';
import ProductImageGallery from '@/components/ProductImageGallery';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.metaTitle || `${product.title} - ${product.category.name} - ProductCase`,
    description: product.metaDescription || product.shortDescription || product.longDescription || `Buy ${product.title} at the best price.`,
    keywords: product.metaKeywords ? product.metaKeywords.split(',').map((k: string) => k.trim()) : [],
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  const galleryImages = product.galleryImages
    ? product.galleryImages.split(',').map((url: string) => url.trim()).filter(item => item.length > 0)
    : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">In Stock</span>;
      case 'out_of_stock':
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">Out of Stock</span>;
      case 'pre_order':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">Pre-Order</span>;
      case 'discontinued':
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">Discontinued</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 py-16">
      <div className="container mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Images */}
            <ProductImageGallery
              mainImage={product.mainImage}
              galleryImages={galleryImages}
              productTitle={product.title}
            />

            {/* Details */}
            <div className="p-8">
              <div className="mb-4">
                <Link
                  href="/products"
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  ← Back to Products
                </Link>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                  {product.category.name}
                </span>
                {getStatusBadge(product.status)}
                {product.status === 'in_stock' && product.quantity > 0 && (
                  <span className="text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                    {product.quantity} items left
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.title}</h1>

              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                ${product.price.toString()}
              </div>

              {product.shortDescription && (
                <p className="text-gray-700 text-lg mb-6">{product.shortDescription}</p>
              )}

              {product.longDescription && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {product.longDescription}
                  </p>
                </div>
              )}

              {product.status !== 'out_of_stock' && product.status !== 'discontinued' ? (
                <Link
                  href={`/contact?product=${encodeURIComponent(product.title)}`}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition shadow-lg text-center inline-block w-full md:w-auto"
                >
                  Inquire Now
                </Link>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-gray-300 text-gray-500 px-8 py-4 rounded-lg font-bold text-lg cursor-not-allowed text-center inline-block w-full md:w-auto"
                >
                  Currently Unavailable
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
