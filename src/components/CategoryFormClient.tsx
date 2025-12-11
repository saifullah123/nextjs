'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface CategoryFormClientProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: {
    name?: string;
    slug?: string;
    description?: string;
    isActive?: boolean;
  };
  submitLabel: string;
  isEdit?: boolean;
}

export function CategoryFormClient({ 
  onSubmit, 
  initialData,
  submitLabel,
  isEdit = false
}: CategoryFormClientProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState(initialData?.slug || '');
  const router = useRouter();

  // Function to convert text to URL-friendly slug
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with dashes
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars except dashes
      .replace(/\-\-+/g, '-')         // Replace multiple dashes with single dash
      .replace(/^-+/, '')             // Trim dashes from start
      .replace(/-+$/, '');            // Trim dashes from end
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedSlug = generateSlug(e.target.value);
    setSlug(formattedSlug);
  };

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

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
          Category Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={initialData?.name}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          placeholder="e.g. Electronics"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-2">
          Slug * {isEdit && <span className="text-xs text-gray-500">(cannot be changed)</span>}
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          required
          readOnly={isEdit}
          value={slug}
          onChange={handleSlugChange}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition font-mono ${
            isEdit ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
          }`}
          placeholder="e.g. electronics or phone-cases"
        />
        {isEdit ? (
          <p className="text-xs text-gray-500 mt-1">Slug is permanent to prevent breaking links</p>
        ) : (
          <p className="text-xs text-green-600 mt-1">✓ Spaces will automatically convert to dashes</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initialData?.description}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          placeholder="Category description..."
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
          onClick={() => router.push('/admin/categories')}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
