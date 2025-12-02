import { createCategory } from '../actions';
import Link from 'next/link';
import { CategoryFormClient } from '@/components/CategoryFormClient';

export default function NewCategoryPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Add Category</h1>
        <p className="text-gray-600">Create a new product category</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl">
        <CategoryFormClient
          onSubmit={createCategory}
          submitLabel="Create Category"
        />
      </div>
    </div>
  );
}
