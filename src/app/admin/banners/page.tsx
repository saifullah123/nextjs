import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { deleteBanner } from './actions';
import { GenericDeleteButton } from '@/components/GenericDeleteButton';



export default async function BannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Banners</h1>
          <p className="text-gray-600">Manage homepage banners</p>
        </div>
        <Link
          href="/admin/banners/new"
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
        >
          + Add Banner
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Image</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Link</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {banners.map((banner) => (
              <tr key={banner.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4">
                  <div className="w-24 h-12 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800">{banner.title}</div>
                  {banner.subtitle && (
                    <div className="text-sm text-gray-500">{banner.subtitle}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm font-mono">
                  {banner.link || '-'}
                </td>
                <td className="px-6 py-4 text-gray-600">{banner.order}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      banner.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/admin/banners/${banner.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </Link>
                  <GenericDeleteButton
                    itemId={banner.id}
                    itemName="banner"
                    onDelete={async () => {
                      'use server';
                      await deleteBanner(banner.id);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {banners.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No banners yet. Create your first banner!
          </div>
        )}
      </div>
    </div>
  );
}
