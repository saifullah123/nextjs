import { createServerSupabaseClient } from '@/lib/supabase';
import { createProduct } from '../actions';
import { ProductFormClient } from '@/components/ProductFormClient';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const supabase = createServerSupabaseClient();
  const { data: categories, error } = await supabase
    .from('Category')
    .select('*')
    .eq('isActive', true)
    .order('name', { ascending: true });
    
  if (error) {
    console.error('Error fetching categories:', error);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Add Product</h1>
        <p className="text-gray-600">Create a new product</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <ProductFormClient
          categories={categories || []}
          onSubmit={createProduct}
          submitLabel="Create Product"
        />
      </div>
    </div>
  );
}
