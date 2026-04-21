'use client';

import { useState, useEffect } from 'react';
import { getMediaLibrary } from '@/app/admin/media/actions';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function MediaPicker({ onSelect, onClose }: { onSelect: (url: string) => void; onClose: () => void }) {
  const [media, setMedia] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchMedia = async () => {
      const data = await getMediaLibrary();
      setMedia(data.filter((m: any) => m.type.startsWith('image/')));
      setIsLoading(false);
    };
    fetchMedia();
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Choose Image</h2>
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
               {media.map((item) => (
                 <div 
                   key={item.id} 
                   className="group relative border border-gray-200 rounded-xl overflow-hidden bg-white aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 hover:ring-2 hover:ring-amber-500 hover:ring-offset-2 transition-all"
                   onClick={() => {
                     onSelect(`/api/media/${item.id}`);
                     onClose();
                   }}
                 >
                    <img src={`/api/media/${item.id}`} alt={item.name} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                 </div>
               ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-white text-sm text-gray-500 text-center">
            Upload new files directly from the Media Library menu.
        </div>
      </motion.div>
    </div>
  );
}
