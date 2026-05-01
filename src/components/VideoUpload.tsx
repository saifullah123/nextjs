'use client';

import { useState, useRef, useEffect } from 'react';
import { MediaPicker } from './MediaPicker';
import { Video as VideoIcon, X, Upload, Search } from 'lucide-react';
import { getMediaUrl } from '@/lib/media_utils';

interface VideoUploadProps {
  name: string;
  label: string;
  required?: boolean;
  currentVideo?: string;
}

export function VideoUpload({ 
  name, 
  label, 
  required = false, 
  currentVideo
}: VideoUploadProps) {
  const initialPreview = currentVideo ? getMediaUrl(currentVideo) : '';
  const [preview, setPreview] = useState<string>(initialPreview);
  const [isDragging, setIsDragging] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedLibraryUrl, setSelectedLibraryUrl] = useState<string>(currentVideo ? getMediaUrl(currentVideo) : '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with prop changes
  useEffect(() => {
    if (currentVideo) {
        const proxied = getMediaUrl(currentVideo);
        setPreview(proxied);
        setSelectedLibraryUrl(proxied);
    }
  }, [currentVideo]);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 20 * 1024 * 1024) {
      alert("Video size exceeds 20MB limit");
      e.target.value = '';
      return;
    }

    setSelectedLibraryUrl('');
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const handleLibrarySelect = (url: string) => {
    const proxiedUrl = getMediaUrl(url);
    setSelectedLibraryUrl(proxiedUrl);
    setPreview(proxiedUrl);
    if (fileInputRef.current) {
        fileInputRef.current.value = ''; 
    }
  };

  const clearVideo = () => {
    setPreview('');
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
        {preview && (
          <button 
            type="button"
            onClick={clearVideo}
            className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Remove
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            isDragging 
              ? 'border-purple-500 bg-purple-50' 
              : 'border-gray-200 hover:border-purple-300 bg-gray-50/50'
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
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-purple-500">
                <VideoIcon className="w-6 h-6" />
            </div>
            <div>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-bold text-slate-900 hover:text-purple-700"
                >
                  Upload video
                </button>
                <p className="text-xs text-gray-400 mt-1">MP4, WebM up to 20MB</p>
            </div>
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50/50 flex flex-col items-center justify-center gap-4 hover:border-purple-300 transition-all">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-blue-500">
                <Search className="w-6 h-6" />
            </div>
            <button 
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="text-sm font-bold text-slate-900 hover:text-blue-700"
            >
              Choose from Library
            </button>
            <p className="text-xs text-gray-400 mt-1">Select existing video</p>
        </div>
      </div>

      <input type="hidden" name={`${name}Url`} value={selectedLibraryUrl} />
      <input type="hidden" name={`current${name.charAt(0).toUpperCase() + name.slice(1)}`} value={currentVideo || ''} />

      {preview && (
        <div className="mt-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Preview</p>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-100 bg-black shadow-lg">
                <video 
                  src={preview} 
                  controls 
                  className="w-full h-full object-contain"
                />
            </div>
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
