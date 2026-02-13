'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { SeoAnalysis } from '@/components/SeoAnalysis';
import { FullScreenLoader } from '@/components/FullScreenLoader';

interface CategoryFormClientProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: {
    name?: string;
    slug?: string;
    description?: string;
    isActive?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
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

  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || '');
  const [metaKeywords, setMetaKeywords] = useState(initialData?.metaKeywords || '');
  const [categoryName, setCategoryName] = useState(initialData?.name || '');

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
    <>
      {isPending && <FullScreenLoader />}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
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
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
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

          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">SEO Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="metaTitle" className="block text-sm font-semibold text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  id="metaTitle"
                  name="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="SEO Title (defaults to category name if empty)"
                />
              </div>

              <div>
                <label htmlFor="metaDescription" className="block text-sm font-semibold text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  id="metaDescription"
                  name="metaDescription"
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="SEO Description..."
                />
              </div>

              <div>
                <label htmlFor="metaKeywords" className="block text-sm font-semibold text-gray-700 mb-2">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  id="metaKeywords"
                  name="metaKeywords"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
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
              onClick={() => router.push('/admin/categories')}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <SeoAnalysis
            metaTitle={metaTitle}
            metaDescription={metaDescription}
            metaKeywords={metaKeywords}
            baseTitle={categoryName}
          />
        </div>
      </div>
    </div>
    </>
  );
}
