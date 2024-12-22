import React from 'react';
import { Building2 } from 'lucide-react';
import type { Marque } from '../../types/database.types';

interface MarqueCardProps {
  marque: Marque;
  onClick?: () => void;
}

export function MarqueCard({ marque, onClick }: MarqueCardProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <Building2 className="h-5 w-5 text-purple-600 mt-1" />
        <div>
          <h3 className="font-medium text-gray-900">{marque.nom}</h3>
          {marque.description && (
            <p className="mt-1 text-sm text-gray-500">{marque.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}