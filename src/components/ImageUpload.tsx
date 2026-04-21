'use client';

import { useState, useRef, useEffect } from 'react';
import { MediaPicker } from './MediaPicker';
import { Image as ImageIcon, X, Upload, Search } from 'lucide-react';
import { getMediaUrl } from '@/lib/media_utils';

interface ImageUploadProps {
  name: string;
  label: string;
  required?: boolean;
  currentImage?: string;
  multiple?: boolean;
  accept?: string;
  onImageSelect?: (url: string) => void;
}

export function ImageUpload({ 
  name, 
  label, 
  required = false, 
  currentImage,
  multiple = false,
  accept = "image/*",
  onImageSelect
}: ImageUploadProps) {
  // Use getMediaUrl for the initial preview if it's a single image string
  const initialPreview = currentImage && !multiple ? getMediaUrl(currentImage) : (multiple ? [] : '');
  const [preview, setPreview] = useState<string | string[]>(initialPreview);
  const [isDragging, setIsDragging] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedLibraryUrl, setSelectedLibraryUrl] = useState<string>(currentImage ? getMediaUrl(currentImage) : '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with prop changes
  useEffect(() => {
    if (currentImage && !multiple) {
        const proxied = getMediaUrl(currentImage);
        setPreview(proxied);
        setSelectedLibraryUrl(proxied);
    }
  }, [currentImage, multiple]);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (Array.isArray(preview)) {
        preview.forEach(url => {
          if (url.startsWith('blob:')) URL.revokeObjectURL(url);
        });
      } else if (preview && typeof preview === 'string' && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // When a new file is selected, we nullify the selected library URL
    setSelectedLibraryUrl('');

    if (multiple) {
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setPreview(urls);
    } else {
      const file = files[0];
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleLibrarySelect = (url: string) => {
    const proxiedUrl = getMediaUrl(url);
    setSelectedLibraryUrl(proxiedUrl);
    setPreview(proxiedUrl);
    if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear file input
    }
    if (onImageSelect) onImageSelect(proxiedUrl);
  };

  const clearImage = () => {
    setPreview(multiple ? [] : '');
    setSelectedLibraryUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      Array.from(files).forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
      
      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
      handleFileChange({ target: fileInputRef.current } as any);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-bold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {preview && (Array.isArray(preview) ? preview.length > 0 : true) && (
          <button 
            type="button"
            onClick={clearImage}
            className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Remove
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload Box */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            isDragging 
              ? 'border-amber-500 bg-amber-50' 
              : 'border-gray-200 hover:border-amber-300 bg-gray-50/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            id={name}
            name={name}
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            className="hidden"
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400">
                <Upload className="w-6 h-6" />
            </div>
            <div>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-bold text-slate-900 hover:text-amber-700"
                >
                  Upload new file
                </button>
                <p className="text-xs text-gray-400 mt-1">or drag and drop here</p>
            </div>
          </div>
        </div>

        {/* Library Box */}
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50/50 flex flex-col items-center justify-center gap-4 hover:border-amber-300 transition-all">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400">
                <Search className="w-6 h-6" />
            </div>
            <button 
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="text-sm font-bold text-slate-900 hover:text-amber-700"
            >
              Choose from Library
            </button>
            <p className="text-xs text-gray-400 mt-1">Select from previously uploaded media</p>
        </div>
      </div>

      {/* Hidden input for library-selected URL */}
      <input type="hidden" name={`${name}Url`} value={selectedLibraryUrl} />

      {/* Preview Section */}
      {preview && (Array.isArray(preview) ? preview.length > 0 : true) && (
        <div className="mt-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Preview</p>
            {Array.isArray(preview) ? (
                <div className="grid grid-cols-4 gap-3">
                    {preview.map((src, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100">
                            <img src={src} alt="Selected preview" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-100 bg-white">
                    <img src={preview} alt="Selected preview" className="w-full h-full object-contain" />
                </div>
            )}
        </div>
      )}

      {isPickerOpen && (
        <MediaPicker 
          onClose={() => setIsPickerOpen(false)} 
          onSelect={handleLibrarySelect} 
        />
      )}
    </div>
  );
}
