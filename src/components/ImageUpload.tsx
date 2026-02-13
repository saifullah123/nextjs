'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  name: string;
  label: string;
  required?: boolean;
  currentImage?: string;
  multiple?: boolean;
  accept?: string;
}

export function ImageUpload({ 
  name, 
  label, 
  required = false, 
  currentImage,
  multiple = false,
  accept = "image/*"
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | string[]>(currentImage || (multiple ? [] : ''));
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (multiple) {
      const previews: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          if (previews.length === files.length) {
            setPreview(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
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

    // Create a new FileList-like object and trigger change
    const input = document.getElementById(name) as HTMLInputElement;
    if (input) {
      const dataTransfer = new DataTransfer();
      Array.from(files).forEach(file => dataTransfer.items.add(file));
      input.files = dataTransfer.files;
      
      // Manually trigger the change event
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
      handleFileChange({ target: input } as any);
    }
  };

  const renderPreview = () => {
    if (Array.isArray(preview) && preview.length > 0) {
      return (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {preview.map((src, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
              <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      );
    } else if (typeof preview === 'string' && preview) {
      return (
        <div className="mt-3 relative w-full rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
          <img src={preview} alt="Preview" className="w-full h-auto object-contain max-h-[500px]" />
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
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
          id={name}
          name={name}
          required={required && !currentImage}
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
        
        <label 
          htmlFor={name} 
          className="cursor-pointer block"
        >
          <div className="text-gray-600">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-sm font-medium">
              {multiple ? 'Drop images here or click to browse' : 'Drop image here or click to browse'}
            </p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
          </div>
        </label>
      </div>

      {renderPreview()}
    </div>
  );
}
