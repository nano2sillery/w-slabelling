import React from 'react';
import { Calendar } from 'lucide-react';
import type { Product } from '../../types/database.types';

interface ProductMillesimesProps {
  product: Product;
  onUpdate: (data: Partial<Product>) => void;
}

export function ProductMillesimes({ product, onUpdate }: ProductMillesimesProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Millésime</h3>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={product.millesime}
            onChange={(e) => onUpdate({ millesime: e.target.checked })}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <span className="ml-2 text-sm text-gray-700">
            Ce produit est millésimé
          </span>
        </label>
      </div>

      {product.millesime && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Calendar className="h-4 w-4" />
            <span>Sélectionnez l'année de production</span>
          </div>
          
          <select
            value={product.annee_production || ''}
            onChange={(e) => onUpdate({ annee_production: parseInt(e.target.value) })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="">Sélectionner une année</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Notes sur le millésime
            </label>
            <textarea
              value={product.notes_millesime || ''}
              onChange={(e) => onUpdate({ notes_millesime: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Caractéristiques particulières de ce millésime..."
            />
          </div>
        </div>
      )}
    </div>
  );
}