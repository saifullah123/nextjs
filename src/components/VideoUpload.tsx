'use client';

import { useState, useRef } from 'react';

interface VideoUploadProps {
  name: string;
  label: string;
  required?: boolean;
  currentVideo?: string | null;
  accept?: string;
}

export function VideoUpload({ 
  name, 
  label, 
  required = false, 
  currentVideo,
  accept = "video/*"
}: VideoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentVideo || null);
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
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
      
      // Update preview directly
      const file = files[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
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
          required={required && !currentVideo}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        
        <label 
          htmlFor={name} 
          className="cursor-pointer block"
        >
          <div className="text-gray-600">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium">
              Drop video here or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1">MP4, WebM up to 50MB</p>
          </div>
        </label>
      </div>

      {preview && (
        <div className="mt-3 relative w-full rounded-lg overflow-hidden border-2 border-gray-200 bg-black">
          <video 
            ref={videoRef}
            src={preview} 
            className="w-full h-auto max-h-[400px]" 
            controls 
          />
        </div>
      )}
    </div>
  );
}
