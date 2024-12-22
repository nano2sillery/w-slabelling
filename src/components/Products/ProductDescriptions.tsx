import React from 'react';
import type { Product } from '../../types/database.types';

interface ProductDescriptionsProps {
  product: Partial<Product>;
  onChange: (data: Partial<Product>) => void;
}

export function ProductDescriptions({ product, onChange }: ProductDescriptionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Descriptions</h3>
      
      <div>
        <label htmlFor="description_courte" className="block text-sm font-medium text-gray-700">
          Description courte
        </label>
        <input
          type="text"
          id="description_courte"
          name="description_courte"
          value={product.description_courte || ''}
          onChange={(e) => onChange({ description_courte: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Brève description du produit"
        />
      </div>

      <div>
        <label htmlFor="description_moyenne" className="block text-sm font-medium text-gray-700">
          Description moyenne
        </label>
        <textarea
          id="description_moyenne"
          name="description_moyenne"
          value={product.description_moyenne || ''}
          onChange={(e) => onChange({ description_moyenne: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Description détaillée du produit"
        />
      </div>

      <div>
        <label htmlFor="description_longue" className="block text-sm font-medium text-gray-700">
          Description longue
        </label>
        <textarea
          id="description_longue"
          name="description_longue"
          value={product.description_longue || ''}
          onChange={(e) => onChange({ description_longue: e.target.value })}
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Description complète avec détails techniques"
        />
      </div>
    </div>
  );
}