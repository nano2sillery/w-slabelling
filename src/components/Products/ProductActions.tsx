import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface ProductActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function ProductActions({ onEdit, onDelete }: ProductActionsProps) {
  return (
    <div className="flex space-x-3">
      <button 
        onClick={onEdit}
        className="text-indigo-600 hover:text-indigo-900"
        title="Modifier"
      >
        <Pencil className="h-5 w-5" />
      </button>
      <button 
        onClick={onDelete}
        className="text-red-600 hover:text-red-900"
        title="Supprimer"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}