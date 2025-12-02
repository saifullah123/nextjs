"use client";

import { deleteCategory } from '@/app/admin/categories/actions';
import React from 'react';

export default function DeleteCategoryButton({ id }: { id: string }) {
  const handleSubmit = (e: React.FormEvent) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      e.preventDefault();
    }
  };

  return (
    <form action={deleteCategory.bind(null, id)} className="inline" onSubmit={handleSubmit}>
      <button
        type="submit"
        className="text-red-600 hover:text-red-800 font-medium"
      >
        Delete
      </button>
    </form>
  );
}
