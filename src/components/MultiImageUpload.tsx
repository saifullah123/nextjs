'use client';

import { useState } from 'react';

interface MultiImageUploadProps {
  name: string;
  label: string;
  required?: boolean;
  currentImages?: string[];
  maxImages?: number;
}

export function MultiImageUpload({ 
  name, 
  label, 
  required = false, 
  currentImages = [],
  maxImages = 5
}: MultiImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>(currentImages);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPreviews: string[] = [];
    const remainingSlots = maxImages - previews.length;
    const filesToProcess = Math.min(files.length, remainingSlots);

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === filesToProcess) {
          setPreviews([...previews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    }
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

    const input = document.getElementById(`${name}-input`) as HTMLInputElement;
    if (input) {
      const dataTransfer = new DataTransfer();
      Array.from(files).forEach(file => dataTransfer.items.add(file));
      input.files = dataTransfer.files;
      
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
      handleFileChange({ target: input } as any);
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
        <span className="text-xs text-gray-500 ml-2">({previews.length}/{maxImages})</span>
      </label>
      
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {previews.map((src, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group">
              <img src={src} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {previews.length < maxImages && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition ${
            isDragging 
              ? 'border-purple-500 bg-purple-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id={`${name}-input`}
            name={`${name}-input`}
            required={required && previews.length === 0}
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          
          <label 
            htmlFor={`${name}-input`} 
            className="cursor-pointer block"
          >
            <div className="text-gray-600">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-sm font-medium">
                Drop images here or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
            </div>
          </label>
        </div>
      )}

      {/* Hidden inputs to store the file data for form submission - will be populated via JS */}
      {previews.map((_, idx) => (
        <input key={idx} type="hidden" name={`${name}-${idx}`} />
      ))}
    </div>
  );
}
