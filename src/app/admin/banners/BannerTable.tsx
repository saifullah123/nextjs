'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Edit, CheckSquare, Square, Play } from 'lucide-react';
import { GenericDeleteButton } from '@/components/GenericDeleteButton';
import { deleteMultipleBanners, deleteBanner } from './actions';
import { useRouter } from 'next/navigation';
import { getMediaUrl } from '@/lib/media_utils';

interface BannerTableProps {
  banners: any[];
}

export default function BannerTable({ banners }: BannerTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const router = useRouter();

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === banners.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(banners.map(b => b.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} banners?`)) return;

    const result = await deleteMultipleBanners(selectedIds);
    if (result.success) {
      setSelectedIds([]);
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full">
              {selectedIds.length} Selected
            </span>
          </div>
          <button 
            onClick={handleBulkDelete}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-bold transition-all shadow-lg active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </button>
        </div>
      )}

      <table className="w-full">
        <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
          <tr>
            <th className="px-6 py-4 text-left w-10">
              <button onClick={toggleSelectAll} className="text-gray-400 hover:text-slate-900 transition-colors">
                {selectedIds.length === banners.length && banners.length > 0 ? (
                  <CheckSquare className="w-5 h-5 text-purple-600" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Preview</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Link</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {banners.map((banner) => {
            const isSelected = selectedIds.includes(banner.id);
            return (
              <tr 
                key={banner.id} 
                className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-purple-50 hover:bg-purple-50' : ''}`}
                onClick={() => toggleSelect(banner.id)}
              >
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleSelect(banner.id)} className="text-gray-400">
                        {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-purple-600" />
                        ) : (
                            <Square className="w-5 h-5 hover:text-gray-600" />
                        )}
                    </button>
                </td>
                <td className="px-6 py-4">
                  <div className="w-24 h-12 rounded-lg overflow-hidden border border-gray-200 relative group">
                    <img
                        src={getMediaUrl(banner.image) || undefined}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{banner.title}</div>
                  {banner.subtitle && (
                    <div className="text-[10px] uppercase font-black tracking-widest text-gray-400 truncate max-w-[200px]">{banner.subtitle}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm font-mono italic truncate max-w-[150px]">
                  {banner.link || '—'}
                </td>
                <td className="px-6 py-4">
                    <span className="text-sm font-black text-slate-900">#{banner.order}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      banner.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                        <Link 
                            href={`/admin/banners/${banner.id}/edit`} 
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                            title="Edit"
                        >
                            <Edit className="w-4 h-4" />
                        </Link>
                        <GenericDeleteButton 
                            itemId={banner.id} 
                            itemName="banner" 
                            onDelete={async () => {
                                await deleteBanner(banner.id);
                            }}
                        />
                    </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {banners.length === 0 && (
        <div className="text-center py-20 bg-gray-50 m-6 rounded-2xl border-4 border-dashed border-gray-100">
           <div className="text-gray-300 mb-4 flex justify-center"><Square className="w-12 h-12" /></div>
           <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No banners yet</p>
        </div>
      )}
    </div>
  );
}
