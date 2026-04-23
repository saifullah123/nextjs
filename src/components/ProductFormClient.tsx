'use client';

import { useState, useTransition, useEffect } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { SeoAnalysis } from '@/components/SeoAnalysis';
import { useRouter } from 'next/navigation';
import { FullScreenLoader } from '@/components/FullScreenLoader';
import { getMediaUrl } from '@/lib/media_utils';
import { MediaPicker } from './MediaPicker';
import { Upload, Search, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill for client-side rendering
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="h-40 bg-gray-50 animate-pulse rounded-lg border border-gray-200" />
});

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
  const router = useRouter();

  const [isGalleryPickerOpen, setIsGalleryPickerOpen] = useState(false);
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>(
    initialData?.galleryImages ? initialData.galleryImages.split(',').filter(Boolean) : []
  );
  const [newGalleryFiles, setNewGalleryFiles] = useState<{file: File, preview: string}[]>([]);

  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || '');
  const [metaKeywords, setMetaKeywords] = useState(initialData?.metaKeywords || '');
  const [productTitle, setProductTitle] = useState(initialData?.title || '');
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || '');
  const [longDescription, setLongDescription] = useState(initialData?.longDescription || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const handleGalleryLibrarySelect = (url: string | string[]) => {
    const urls = Array.isArray(url) ? url : [url];
    const totalCount = existingGalleryImages.length + newGalleryFiles.length;
    const remainingSlots = 15 - totalCount;
    
    if (remainingSlots <= 0) {
      setGalleryError("Maximum 15 images allowed in gallery");
      setIsGalleryPickerOpen(false);
      return;
    }

    const toAdd = urls.slice(0, remainingSlots);
    setExistingGalleryImages(prev => [...prev, ...toAdd]);
    
    if (urls.length > remainingSlots) {
      setGalleryError(`Maximum 15 images allowed. Added ${remainingSlots} images.`);
    }
    setIsGalleryPickerOpen(false);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFilesList = Array.from(files);
    const totalCount = existingGalleryImages.length + newGalleryFiles.length;
    const remainingSlots = 15 - totalCount;

    if (newFilesList.length > remainingSlots) {
      setGalleryError(`Maximum 15 images allowed. You can add ${remainingSlots} more.`);
      e.target.value = '';
      return;
    }

    const validFiles: {file: File, preview: string}[] = [];
    for (const file of newFilesList) {
      if (file.size > 10 * 1024 * 1024) {
        setGalleryError(`File "${file.name}" exceeds 10MB limit`);
        e.target.value = '';
        return;
      }
      validFiles.push({
        file,
        preview: URL.createObjectURL(file)
      });
    }

    setNewGalleryFiles(prev => [...prev, ...validFiles]);
    e.target.value = '';
    setGalleryError(null);
  };

  const removeExistingGalleryImage = (urlToRemove: string) => {
    setExistingGalleryImages(prev => prev.filter(url => url !== urlToRemove));
  };

  const removeNewGalleryFile = (indexToRemove: number) => {
    setNewGalleryFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[indexToRemove].preview);
      newFiles.splice(indexToRemove, 1);
      return newFiles;
    });
  };

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
    formData.append('existingGalleryImages', JSON.stringify(existingGalleryImages));
    
    newGalleryFiles.forEach(({file}) => {
      formData.append('galleryImages', file);
    });

    formData.set('shortDescription', shortDescription);
    formData.set('longDescription', longDescription);
    formData.append('tags', tags.join(','));

    startTransition(async () => {
      try {
        const result = await onSubmit(formData);
        if (result && result.error) {
          setError(result.error);
        }
      } catch (err: any) {
        if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err;
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
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Short Description
              </label>
              <div className="bg-white rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-purple-500 transition">
                <ReactQuill
                  theme="snow"
                  value={shortDescription}
                  onChange={setShortDescription}
                  placeholder="Brief product description for cards..."
                  modules={{
                    toolbar: [
                      ['bold', 'italic', 'underline'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['clean']
                    ],
                  }}
                  className="bg-white min-h-[100px]"
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Long Description
              </label>
              <div className="bg-white rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-purple-500 transition">
                <ReactQuill
                  theme="snow"
                  value={longDescription}
                  onChange={setLongDescription}
                  placeholder="Detailed product description..."
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'color': [] }, { 'background': [] }],
                      ['link', 'image'],
                      ['clean']
                    ],
                  }}
                  className="bg-white min-h-[300px]"
                />
              </div>
            </div>

            <div className="col-span-2">
              <ImageUpload
                name="mainImage"
                label="Main Product Image"
                required={!initialData?.mainImage}
                currentImage={initialData?.mainImage}
              />
            </div>

            <div className="col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-bold text-gray-700">
                  Product Gallery (Max 15)
                </label>
                <span className="text-xs text-gray-500 font-medium">
                  {existingGalleryImages.length + newGalleryFiles.length} / 15 images
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                    (existingGalleryImages.length + newGalleryFiles.length) >= 15 ? 'opacity-50 cursor-not-allowed border-gray-200' : 'border-gray-200 hover:border-amber-400 bg-gray-50/50 cursor-pointer hover:bg-amber-50/30'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={(existingGalleryImages.length + newGalleryFiles.length) >= 15}
                    onChange={handleGalleryChange}
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-amber-500">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900">Upload Photos</span>
                      <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG up to 10MB</p>
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => (existingGalleryImages.length + newGalleryFiles.length) < 15 && setIsGalleryPickerOpen(true)}
                  className={`border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center bg-gray-50/50 flex flex-col items-center justify-center gap-2 transition-all ${
                    (existingGalleryImages.length + newGalleryFiles.length) >= 15 ? 'opacity-50 cursor-not-allowed' : 'hover:border-amber-400 cursor-pointer hover:bg-amber-50/30'
                  }`}
                >
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-blue-500">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900">Media Library</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">Select from existing</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {/* Existing Images */}
                {existingGalleryImages.map((url, index) => (
                  <div key={`existing-${index}`} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm group">
                    <img src={getMediaUrl(url)} alt="Gallery" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingGalleryImage(url)}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 hover:text-white text-gray-600 rounded-full p-1.5 shadow-lg transition-all transform scale-0 group-hover:scale-100"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                ))}
                
                {/* New Files */}
                {newGalleryFiles.map((fileData, index) => (
                  <div key={`new-${index}`} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-amber-100 shadow-sm group">
                    <img src={fileData.preview} alt="New Gallery" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewGalleryFile(index)}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 hover:text-white text-gray-600 rounded-full p-1.5 shadow-lg transition-all transform scale-0 group-hover:scale-100"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                    <span className="absolute bottom-2 left-2 bg-amber-500 text-[10px] text-white px-2 py-0.5 rounded-md font-bold shadow-sm uppercase">New</span>
                  </div>
                ))}
              </div>

              {galleryError && (
                <p className="text-xs font-bold text-red-500 bg-red-50 px-3 py-2 rounded-lg inline-block">{galleryError}</p>
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
                    placeholder="SEO Title"
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
                    placeholder="SEO Keywords (comma separated)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Tags
                  </label>
                  <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 transition bg-white min-h-[50px]">
                    {tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2"
                      >
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)}>
                          <X size={14} strokeWidth={3} />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      className="flex-1 outline-none text-sm py-1 bg-transparent"
                      placeholder="Add tag..."
                    />
                  </div>
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
        maxSelections={15 - (existingGalleryImages.length + newGalleryFiles.length)}
      />
    )}
    </>
  );
}
