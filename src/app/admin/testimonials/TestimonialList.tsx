'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Edit, CheckSquare, Square, Star } from 'lucide-react';
import { GenericDeleteButton } from '@/components/GenericDeleteButton';
import { deleteMultipleTestimonials, deleteTestimonial } from './actions';
import { useRouter } from 'next/navigation';
import { getMediaUrl } from '@/lib/media_utils';

interface TestimonialListProps {
  testimonials: any[];
}

export default function TestimonialList({ testimonials }: TestimonialListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const router = useRouter();

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === testimonials.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(testimonials.map(t => t.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} testimonials?`)) return;

    const result = await deleteMultipleTestimonials(selectedIds);
    if (result.success) {
      setSelectedIds([]);
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <button 
           onClick={toggleSelectAll}
           className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-xl transition-all"
        >
          {selectedIds.length === testimonials.length && testimonials.length > 0 ? (
            <CheckSquare className="w-5 h-5 text-purple-600" />
          ) : (
            <Square className="w-5 h-5 text-gray-400" />
          )}
          <span className="text-sm font-bold text-gray-600">
            {selectedIds.length === testimonials.length ? 'Deselect All' : 'Select All'}
          </span>
        </button>

        {selectedIds.length > 0 && (
          <button 
            onClick={handleBulkDelete}
            className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg active:scale-95 animate-in zoom-in duration-200"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      <div className="grid gap-6">
        {testimonials.map((testimonial) => {
          const isSelected = selectedIds.includes(testimonial.id);
          return (
            <div
              key={testimonial.id}
              onClick={() => toggleSelect(testimonial.id)}
              className={`bg-white rounded-[2rem] shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all cursor-pointer border-4 ${
                isSelected ? 'border-purple-500' : 'border-transparent'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="relative">
                   {testimonial.avatar && (
                     <img
                       src={getMediaUrl(testimonial.avatar)}
                       alt=""
                       className="w-20 h-20 rounded-[2rem] object-cover shadow-xl"
                     />
                   )}
                   <div className={`absolute -top-3 -left-3 p-2 rounded-xl border-2 transition-all ${
                        isSelected ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white text-gray-200 border-gray-100'
                   }`}>
                        <CheckSquare className="w-4 h-4" />
                   </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 leading-tight">{testimonial.name}</h3>
                      {testimonial.role && (
                        <p className="text-[10px] uppercase font-black tracking-widest text-purple-500 mt-1">{testimonial.role}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span
                            className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                testimonial.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            {testimonial.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber-400 fill-current' : 'text-gray-200'}`} />
                    ))}
                  </div>

                  <p className="text-gray-600 leading-relaxed italic mb-8">"{testimonial.content}"</p>

                  <div className="flex gap-3 justify-end pt-6 border-t border-gray-50" onClick={(e) => e.stopPropagation()}>
                    <Link
                      href={`/admin/testimonials/${testimonial.id}/edit`}
                      className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all font-bold text-xs flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </Link>
                    <GenericDeleteButton
                      itemId={testimonial.id}
                      itemName="testimonial"
                      onDelete={async () => {
                        await deleteTestimonial(testimonial.id);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {testimonials.length === 0 && (
          <div className="bg-gray-50 rounded-[3rem] p-24 text-center border-4 border-dashed border-gray-100">
             <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-200">
                <Star className="w-10 h-10" />
             </div>
             <h3 className="text-xl font-black text-slate-900">No testimonials found</h3>
             <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Create your first customer review to show off here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
