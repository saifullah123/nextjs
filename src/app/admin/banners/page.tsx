import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { deleteBanner } from './actions';
import BannerTable from './BannerTable';

export const dynamic = 'force-dynamic';

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

      <BannerTable banners={banners} />
    </div>
  );
}
