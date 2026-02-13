'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/ImageUpload';
import { FullScreenLoader } from '@/components/FullScreenLoader';

interface TestimonialFormClientProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: {
    name?: string;
    role?: string;
    avatar?: string;
    rating?: number;
    content?: string;
    isActive?: boolean;
  };
  submitLabel: string;
}

export function TestimonialFormClient({ 
  onSubmit, 
  initialData,
  submitLabel 
}: TestimonialFormClientProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(initialData?.rating ?? 5);
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
    <>
      {isPending && <FullScreenLoader />}
      <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={initialData?.name}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            placeholder="e.g. John Doe"
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
            Role / Company
          </label>
          <input
            type="text"
            id="role"
            name="role"
            defaultValue={initialData?.role}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            placeholder="e.g. CEO at TechCorp"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="rating" className="block text-sm font-semibold text-gray-700 mb-2">
            Rating *
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl focus:outline-none transition-transform hover:scale-110 ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
            <input type="hidden" name="rating" value={rating} />
            <span className="ml-2 text-sm text-gray-500">({rating} stars)</span>
          </div>
        </div>

        <div className="col-span-2">
          <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
            Testimonial Content *
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={4}
            defaultValue={initialData?.content}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            placeholder="Write the testimonial here..."
          />
        </div>

        <div className="col-span-2">
          <ImageUpload
            name="avatar"
            label="Avatar Image"
            required={false}
            currentImage={initialData?.avatar}
          />
        </div>

        <div className="col-span-2 flex items-center">
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
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/testimonials')}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </form>
    </>
  );
}
