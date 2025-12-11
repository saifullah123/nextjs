'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/ImageUpload';

interface BannerFormClientProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: {
    title?: string;
    subtitle?: string;
    image?: string;
    link?: string;
    order?: number;
    isActive?: boolean;
  };
  submitLabel: string;
}

export function BannerFormClient({ 
  onSubmit, 
  initialData,
  submitLabel 
}: BannerFormClientProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await onSubmit(formData);
      } catch (err: any) {
        // Don't catch Next.js redirect errors - let them propagate
        if (err?.digest?.startsWith('NEXT_REDIRECT')) {
          throw err;
        }
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            defaultValue={initialData?.title}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            placeholder="e.g. Summer Sale"
          />
        </div>

        <div>
          <label htmlFor="subtitle" className="block text-sm font-semibold text-gray-700 mb-2">
            Subtitle
          </label>
          <input
            type="text"
            id="subtitle"
            name="subtitle"
            defaultValue={initialData?.subtitle}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            placeholder="e.g. Up to 50% off"
          />
        </div>

        <div>
          <label htmlFor="link" className="block text-sm font-semibold text-gray-700 mb-2">
            Link URL
          </label>
          <input
            type="text"
            id="link"
            name="link"
            defaultValue={initialData?.link}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            placeholder="e.g. /products/summer-sale"
          />
        </div>

        <div>
          <label htmlFor="order" className="block text-sm font-semibold text-gray-700 mb-2">
            Display Order
          </label>
          <input
            type="number"
            id="order"
            name="order"
            defaultValue={initialData?.order ?? 0}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            placeholder="0"
          />
          <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
        </div>

        <div>
          <ImageUpload
            name="image"
            label="Banner Image"
            required={!initialData?.image}
            currentImage={initialData?.image}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            defaultChecked={initialData?.isActive ?? true}
            className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          />
          <label htmlFor="isActive" className="ml-3 text-sm font-medium text-gray-700">
            Active (visible on website)
          </label>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-lg disabled:opacity-50"
        >
          {isPending ? 'Saving...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/banners')}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
