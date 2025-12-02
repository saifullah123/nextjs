'use client';

import { useTransition } from 'react';

interface GenericDeleteButtonProps {
  itemId: string;
  itemName: string;
  onDelete: () => Promise<void>;
  className?: string;
}

export function GenericDeleteButton({ 
  itemId, 
  itemName, 
  onDelete,
  className = "text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
}: GenericDeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete this ${itemName}?`)) {
      return;
    }

    startTransition(async () => {
      await onDelete();
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className={className}
      disabled={isPending}
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
