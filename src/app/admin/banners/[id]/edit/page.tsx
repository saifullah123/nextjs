import { prisma } from '@/lib/prisma';
import { updateBanner } from '../../actions';
import { notFound } from 'next/navigation';
import { BannerFormClient } from '@/components/BannerFormClient';

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const banner = await prisma.banner.findUnique({
    where: { id },
  });

  if (!banner) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Edit Banner</h1>
        <p className="text-gray-600">Update banner information</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl">
        <BannerFormClient
          onSubmit={async (formData) => {
            'use server';
            await updateBanner(id, formData);
          }}
          initialData={{
            title: banner.title,
            subtitle: banner.subtitle || '',
            image: banner.image || undefined,
            video: banner.video,
            link: banner.link || '',
            order: banner.order,
            isActive: banner.isActive,
          }}
          submitLabel="Update Banner"
        />
      </div>
    </div>
  );
}
