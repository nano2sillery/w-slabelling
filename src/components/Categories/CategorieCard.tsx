import React from 'react';
import { Tag } from 'lucide-react';
import type { Categorie } from '../../types/database.types';

interface CategorieCardProps {
  categorie: Categorie;
  onClick?: () => void;
}

export function CategorieCard({ categorie, onClick }: CategorieCardProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <Tag className="h-5 w-5 text-purple-600" />
        <div>
          <h3 className="font-medium text-gray-900">{categorie.nom}</h3>
        </div>
      </div>
    </div>
  );
}