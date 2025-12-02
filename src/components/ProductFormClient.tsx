'use client';

import { useState, useTransition } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { useRouter } from 'next/navigation';

interface ProductFormClientProps {
  categories: Array<{ id: string; name: string }>;
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: {
    title?: string;
    slug?: string;
    sku?: string;
    price?: number;
    quantity?: number;
    categoryId?: string;
    shortDescription?: string;
    longDescription?: string;
    mainImage?: string;
    galleryImages?: string;
    isFeatured?: boolean;
    status?: string;
    isActive?: boolean;
  };
  submitLabel: string;
  isEdit?: boolean;
}

export function ProductFormClient({ 
  categories, 
  onSubmit, 
  initialData,
  submitLabel,
  isEdit = false
}: ProductFormClientProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(
    initialData?.galleryImages ? initialData.galleryImages.split(',').filter(Boolean) : []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    // Add gallery images to formData
    galleryFiles.forEach((file, index) => {
      formData.append(`galleryImages-${index}`, file);
    });

    startTransition(async () => {
      try {
        await onSubmit(formData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    });
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setGalleryFiles([...galleryFiles, ...newFiles]);

    // Generate previews
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(galleryFiles.filter((_, i) => i !== index));
    setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            Product Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            defaultValue={initialData?.title}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            placeholder="e.g. Premium Leather Phone Case"
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
            defaultValue={initialData?.slug}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition font-mono ${
              isEdit ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
            }`}
            placeholder="e.g. premium-leather-case"
            onChange={(e) => {
              const val = e.target.value;
              e.target.value = val.replace(/\s+/g, '-').toLowerCase();
            }}
          />
          {isEdit ? (
            <p className="text-xs text-gray-500 mt-1">Slug is permanent to prevent breaking links</p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">Must be unique</p>
          )}
        </div>

        <div>
          <label htmlFor="sku" className="block text-sm font-semibold text-gray-700 mb-2">
            SKU (Stock Keeping Unit)
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            defaultValue={initialData?.sku}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition font-mono"
            placeholder="e.g. PLC-001"
          />
          <p className="text-xs text-gray-500 mt-1">Optional, must be unique if provided</p>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
            Price ($) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            required
            step="0.01"
            min="0"
            defaultValue={initialData?.price}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            placeholder="29.99"
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-2">
            Quantity in Stock *
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            required
            min="0"
            step="1"
            defaultValue={initialData?.quantity ?? 0}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            placeholder="0"
          />
          <p className="text-xs text-gray-500 mt-1">Available quantity for sale</p>
        </div>

        <div className="col-span-2">
          <label htmlFor="categoryId" className="block text-sm font-semibold text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={initialData?.categoryId}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
            Stock Status *
          </label>
          <select
            id="status"
            name="status"
            required
            defaultValue={initialData?.status || 'in_stock'}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          >
            <option value="in_stock">✅ In Stock</option>
            <option value="out_of_stock">❌ Out of Stock</option>
            <option value="pre_order">📦 Pre-Order</option>
            <option value="discontinued">⛔ Discontinued</option>
          </select>
        </div>

        <div className="col-span-2">
          <label htmlFor="shortDescription" className="block text-sm font-semibold text-gray-700 mb-2">
            Short Description
          </label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            rows={2}
            defaultValue={initialData?.shortDescription}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            placeholder="Brief product description for cards..."
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="longDescription" className="block text-sm font-semibold text-gray-700 mb-2">
            Long Description
          </label>
          <textarea
            id="longDescription"
            name="longDescription"
            rows={5}
            defaultValue={initialData?.longDescription}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            placeholder="Detailed product description..."
          />
        </div>

        <div className="col-span-2">
          <ImageUpload
            name="mainImage"
            label="Main Product Image"
            required={!initialData?.mainImage}
            currentImage={initialData?.mainImage}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Gallery Images (Max 5)
          </label>
          
          {galleryPreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {galleryPreviews.map((src, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group">
                  <img src={src} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {galleryPreviews.length < 5 && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
              <input
                type="file"
                id="galleryImages"
                accept="image/*"
                multiple
                onChange={handleGalleryChange}
                className="hidden"
              />
              <label htmlFor="galleryImages" className="cursor-pointer block">
                <div className="text-gray-600">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-sm font-medium">Add more gallery images</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
                </div>
              </label>
            </div>
          )}
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
            Active (Show on website)
          </label>
        </div>

        <div className="col-span-2 flex items-center">
          <input
            type="checkbox"
            id="isFeatured"
            name="isFeatured"
            defaultChecked={initialData?.isFeatured}
            className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          />
          <label htmlFor="isFeatured" className="ml-3 text-sm font-medium text-gray-700">
            Featured Product (show on homepage)
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
          onClick={() => router.push('/admin/products')}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
