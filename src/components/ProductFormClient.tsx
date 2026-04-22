'use client';

import { useState, useTransition, useEffect } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { SeoAnalysis } from '@/components/SeoAnalysis';
import { useRouter } from 'next/navigation';
import { FullScreenLoader } from '@/components/FullScreenLoader';
import { getMediaUrl } from '@/lib/media_utils';
import { MediaPicker } from './MediaPicker';
import { Upload, Search, Trash2, X, Image as ImageIcon } from 'lucide-react';

interface ProductFormClientProps {
  categories: Array<{ id: string; name: string }>;
  onSubmit: (formData: FormData) => Promise<{ error?: string } | void>;
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
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    tags?: string[];
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
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [isGalleryPickerOpen, setIsGalleryPickerOpen] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>(
    initialData?.galleryImages ? initialData.galleryImages.split(',').filter(Boolean) : []
  );

  const handleGalleryLibrarySelect = (url: string | string[]) => {
    if (Array.isArray(url)) {
      const remainingSlots = 5 - (existingImages.length + newFiles.length);
      const toAdd = url.slice(0, remainingSlots);
      setExistingImages(prev => [...prev, ...toAdd]);
      if (url.length > remainingSlots) {
        setGalleryError('Only added as many images as would fit (max 5)');
      }
    } else {
      if (existingImages.length + newFiles.length < 5) {
        setExistingImages(prev => [...prev, url]);
      } else {
        setGalleryError('Maximum 5 images allowed in gallery');
      }
    }
  };
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || '');
  const [metaKeywords, setMetaKeywords] = useState(initialData?.metaKeywords || '');
  const [productTitle, setProductTitle] = useState(initialData?.title || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,$/, '');
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setGalleryError(null);

    const formData = new FormData(e.currentTarget);
    
    // Add existing images
    formData.append('existingGalleryImages', JSON.stringify(existingImages));

    // Add new gallery images
    newFiles.forEach((file) => {
      formData.append('galleryImages', file);
    });

    // Add tags as comma-separated string
    formData.append('tags', tags.join(','));

    startTransition(async () => {
      try {
        const result = await onSubmit(formData);
        if (result && result.error) {
          setError(result.error);
        }
      } catch (err: any) {
        // Don't catch Next.js redirect errors - let them propagate
        if (err?.digest?.startsWith('NEXT_REDIRECT')) {
          throw err;
        }
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    });
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFilesList = Array.from(files);
    const totalCurrentImages = existingImages.length + newFiles.length;
    const remainingSlots = 5 - totalCurrentImages;

    if (newFilesList.length > remainingSlots) {
      setGalleryError(`You can only upload ${remainingSlots} more image${remainingSlots !== 1 ? 's' : ''}`);
      e.target.value = '';
      return;
    }

    const validFiles: File[] = [];
    for (const file of newFilesList) {
      if (file.size > 10 * 1024 * 1024) {
        setGalleryError(`File "${file.name}" exceeds the 10MB limit`);
        e.target.value = '';
        return;
      }
      validFiles.push(file);
    }

    setNewFiles(prev => [...prev, ...validFiles]);

    // Generate previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input to allow selecting the same file again
    e.target.value = '';
    setGalleryError(null);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
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
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
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
                defaultValue={initialData?.quantity}
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
                defaultValue={initialData?.categoryId}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              >
                <option value="">No Category (Uncategorized)</option>
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
              <div className="block text-sm font-semibold text-gray-700 mb-2">
                Gallery Images (Max 5)
              </div>
              
              {!isMounted ? (
                <div className="h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
                  Loading gallery uploader...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Upload Box */}
                  <div
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                      (existingImages.length + newFiles.length) >= 5 ? 'opacity-50 cursor-not-allowed border-gray-200' : 'border-gray-200 hover:border-amber-300 bg-gray-50/50 cursor-pointer'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={(existingImages.length + newFiles.length) >= 5}
                      onChange={handleGalleryChange}
                      className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-900">Upload new files</span>
                        <p className="text-xs text-gray-400 mt-1">Select from computer</p>
                      </div>
                    </div>
                  </div>

                  {/* Library Box */}
                  <div 
                    onClick={() => (existingImages.length + newFiles.length) < 5 && setIsGalleryPickerOpen(true)}
                    className={`border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50/50 flex flex-col items-center justify-center gap-4 transition-all ${
                      (existingImages.length + newFiles.length) >= 5 ? 'opacity-50 cursor-not-allowed' : 'hover:border-amber-300 cursor-pointer'
                    }`}
                  >
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400">
                      <Search className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900">Choose from Library</span>
                      <p className="text-xs text-gray-400 mt-1">Select from previously uploaded</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-4 lg:grid-cols-5 gap-4">
                {existingImages.map((src, idx) => (
                  <div key={`existing-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group">
                    <img src={getMediaUrl(src)} alt={`Gallery Existing ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                {newPreviews.map((src, idx) => (
                  <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group">
                    <img src={src} alt={`Gallery New ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              {galleryError && (
                <p className="text-sm text-red-600 mt-2">{galleryError}</p>
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

            <div className="col-span-2 border-t pt-6 mt-6">
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
                    placeholder="SEO Title (defaults to product title if empty)"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Tags (Multiple)
                  </label>
                  <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition bg-white min-h-[50px]">
                    {tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 group hover:bg-purple-200 transition-colors"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-purple-900 focus:outline-none"
                        >
                          <X size={14} strokeWidth={3} />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      onBlur={() => {
                        const newTag = tagInput.trim().replace(/,$/, '');
                        if (newTag && !tags.includes(newTag)) {
                          setTags([...tags, newTag]);
                          setTagInput('');
                        }
                      }}
                      className="flex-1 outline-none min-w-[120px] text-sm py-1 bg-transparent"
                      placeholder={tags.length === 0 ? "Type and press Enter or comma to add tags..." : "Add more tags..."}
                    />
                  </div>
                  <p className="text-xs text-secondary-text mt-2 italic font-medium">Add multiple keywords to improve SEO ranking (e.g., leather, premium, handcrafted)</p>
                </div>
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
              onClick={() => router.push('/admin/products')}
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
            baseTitle={productTitle}
          />
        </div>
      </div>
    </div>
    
    {isGalleryPickerOpen && (
      <MediaPicker 
        onClose={() => setIsGalleryPickerOpen(false)} 
        onSelect={handleGalleryLibrarySelect} 
        onSelectMultiple={handleGalleryLibrarySelect}
        multiple={true}
        maxSelections={5 - (existingImages.length + newFiles.length)}
      />
    )}
    </>
  );
}
