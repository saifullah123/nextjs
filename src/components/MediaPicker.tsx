'use client';

import { useState, useEffect } from 'react';
import { getMediaLibrary } from '@/app/admin/media/actions';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MediaPickerProps {
  onSelect?: (url: string) => void;
  onSelectMultiple?: (urls: string[]) => void;
  onClose: () => void;
  multiple?: boolean;
  maxSelections?: number;
}

export function MediaPicker({ onSelect, onSelectMultiple, onClose, multiple = false, maxSelections = 5 }: MediaPickerProps) {
  const [media, setMedia] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchMedia = async () => {
      const data = await getMediaLibrary();
      setMedia(data.filter((m: any) => m.type.startsWith('image/')));
      setIsLoading(false);
    };
    fetchMedia();
  }, []);

  const toggleSelection = (url: string) => {
    if (selectedUrls.includes(url)) {
      setSelectedUrls(prev => prev.filter(u => u !== url));
    } else {
      if (selectedUrls.length < maxSelections) {
        setSelectedUrls(prev => [...prev, url]);
      }
    }
  };

  const handleConfirm = () => {
    if (multiple && onSelectMultiple) {
      onSelectMultiple(selectedUrls);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {multiple ? 'Select Images' : 'Choose Image'}
            </h2>
            {multiple && (
              <p className="text-sm text-gray-500">
                Selected {selectedUrls.length} of {maxSelections} images
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
             <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6 bg-slate-50">
          {isLoading ? (
            <div className="flex justify-center py-20 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : media.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No images available. Upload some in the Media Library.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
               {media.map((item) => {
                 const url = `/api/media/${item.id}`;
                 const isSelected = selectedUrls.includes(url);
                 
                 return (
                  <div 
                    key={item.id} 
                    className={`group relative border rounded-xl overflow-hidden bg-white aspect-square flex flex-col items-center justify-center cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-amber-500 ring-4 ring-amber-500/20' 
                        : 'border-gray-200 hover:border-amber-500'
                    }`}
                    onClick={() => {
                      if (multiple) {
                        toggleSelection(url);
                      } else {
                        if (onSelect) onSelect(url);
                        onClose();
                      }
                    }}
                  >
                     <img src={url} alt={item.name} className={`w-full h-full object-cover transition-all ${isSelected ? 'scale-90 rounded-lg' : 'group-hover:opacity-90'}`} />
                     
                     {multiple && isSelected && (
                       <div className="absolute top-2 right-2 bg-amber-500 text-white rounded-full p-1 shadow-lg">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                       </div>
                     )}

                     {multiple && !isSelected && selectedUrls.length >= maxSelections && (
                       <div className="absolute inset-0 bg-white/60 cursor-not-allowed" />
                     )}
                  </div>
                 );
               })}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-white flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {multiple 
                ? `${selectedUrls.length} images selected` 
                : 'Choose an image from your library'}
            </span>
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              {multiple && (
                <button 
                  onClick={handleConfirm}
                  disabled={selectedUrls.length === 0}
                  className="px-6 py-2 text-sm font-bold bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 shadow-md"
                >
                  Add Selected
                </button>
              )}
            </div>
        </div>
      </motion.div>
    </div>
  );
}
