'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Edit, CheckSquare, Square, MoreHorizontal, ExternalLink } from 'lucide-react';
import { GenericDeleteButton } from '@/components/GenericDeleteButton';
import { getMediaUrl } from '@/lib/media_utils';
import { deleteMultipleProducts, deleteProduct } from './actions';
import { useRouter } from 'next/navigation';

interface ProductTableProps {
  products: any[];
}

export default function ProductTable({ products }: ProductTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const router = useRouter();

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map(p => p.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) return;

    const result = await deleteMultipleProducts(selectedIds);
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
                {selectedIds.length === products.length && products.length > 0 ? (
                  <CheckSquare className="w-5 h-5 text-purple-600" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">SKU</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Quantity</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => {
            const getStatusBadge = (status: string) => {
              const badges: Record<string, { text: string; class: string }> = {
                in_stock: { text: 'In Stock', class: 'bg-green-100 text-green-700' },
                out_of_stock: { text: 'Out of Stock', class: 'bg-red-100 text-red-700' },
                pre_order: { text: 'Pre-Order', class: 'bg-blue-100 text-blue-700' },
                discontinued: { text: 'Discontinued', class: 'bg-gray-100 text-gray-700' },
              };
              return badges[status] || badges.in_stock;
            };
            const statusBadge = getStatusBadge(product.status);
            const isSelected = selectedIds.includes(product.id);

            return (
              <tr 
                key={product.id} 
                className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-purple-50 hover:bg-purple-50' : ''}`}
                onClick={() => toggleSelect(product.id)}
              >
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => toggleSelect(product.id)} className="text-gray-400">
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-purple-600" />
                    ) : (
                      <Square className="w-5 h-5 hover:text-gray-600" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {product.mainImage && (
                      <img src={getMediaUrl(product.mainImage)} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                    )}
                    <div>
                      <div className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{product.title}</div>
                      <div className="text-[10px] uppercase tracking-widest text-gray-400 font-black">{product.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono font-bold text-gray-600">
                    {product.sku || '—'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-gray-600 italic">
                    {product.category?.name || 'Uncategorized'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-black text-slate-900">${product.price}</span>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${product.quantity === 0 ? 'text-red-500' : product.quantity < 10 ? 'text-orange-500' : 'text-green-500'}`}>
                            {product.quantity}
                        </span>
                        {product.quantity < 10 && product.quantity > 0 && <span className="text-[10px] font-black text-orange-500 uppercase">Low</span>}
                    </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusBadge.class}`}>
                    {statusBadge.text}
                  </span>
                </td>
                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                        <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                            title="Edit"
                        >
                            <Edit className="w-4 h-4" />
                        </Link>
                        <GenericDeleteButton
                            itemId={product.id}
                            itemName="product"
                            onDelete={async () => {
                                await deleteProduct(product.id);
                            }}
                        />
                    </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {products.length === 0 && (
        <div className="text-center py-20 bg-gray-50 m-6 rounded-2xl border-4 border-dashed border-gray-100">
           <div className="text-gray-300 mb-4 flex justify-center"><Square className="w-12 h-12" /></div>
           <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No products found</p>
        </div>
      )}
    </div>
  );
}
