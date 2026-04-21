'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Edit, CheckSquare, Square } from 'lucide-react';
import { GenericDeleteButton } from '@/components/GenericDeleteButton';
import { deleteMultipleCategories, deleteCategory } from './actions';
import { useRouter } from 'next/navigation';

interface CategoryTableProps {
  categories: any[];
}

export default function CategoryTable({ categories }: CategoryTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const router = useRouter();

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === categories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(categories.map(c => c.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} categories? Products in these categories will not be deleted but will become uncategorized.`)) return;

    const result = await deleteMultipleCategories(selectedIds);
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
                {selectedIds.length === categories.length && categories.length > 0 ? (
                  <CheckSquare className="w-5 h-5 text-purple-600" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Slug</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Products</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {categories.map((category) => {
            const isSelected = selectedIds.includes(category.id);
            return (
              <tr 
                key={category.id} 
                className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-purple-50 hover:bg-purple-50' : ''}`}
                onClick={() => toggleSelect(category.id)}
              >
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleSelect(category.id)} className="text-gray-400">
                        {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-purple-600" />
                        ) : (
                            <Square className="w-5 h-5 hover:text-gray-600" />
                        )}
                    </button>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">{category.name}</td>
                <td className="px-6 py-4 text-gray-500 font-mono text-sm">{category.slug}</td>
                <td className="px-6 py-4 text-gray-600 font-bold">{category._count.products}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      category.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                        <Link 
                            href={`/admin/categories/${category.id}/edit`} 
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                            title="Edit"
                        >
                            <Edit className="w-4 h-4" />
                        </Link>
                        <GenericDeleteButton 
                            itemId={category.id} 
                            itemName="category" 
                            onDelete={async () => {
                                await deleteCategory(category.id);
                            }}
                        />
                    </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {categories.length === 0 && (
        <div className="text-center py-20 bg-gray-50 m-6 rounded-2xl border-4 border-dashed border-gray-100">
           <div className="text-gray-300 mb-4 flex justify-center"><Square className="w-12 h-12" /></div>
           <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No categories yet</p>
        </div>
      )}
    </div>
  );
}
