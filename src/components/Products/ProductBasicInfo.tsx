import React from 'react';
import type { Product } from '../../types/database.types';

interface ProductBasicInfoProps {
  product: Partial<Product>;
  onChange: (data: Partial<Product>) => void;
}

export function ProductBasicInfo({ product, onChange }: ProductBasicInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Informations de base</h3>
      
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
          Nom du produit
        </label>
        <input
          type="text"
          id="nom"
          name="nom"
          value={product.nom || ''}
          onChange={(e) => onChange({ nom: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="pays_origine" className="block text-sm font-medium text-gray-700">
            Pays d'origine
          </label>
          <input
            type="text"
            id="pays_origine"
            name="pays_origine"
            value={product.pays_origine || ''}
            onChange={(e) => onChange({ pays_origine: e.target.value })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="contenance" className="block text-sm font-medium text-gray-700">
            Contenance
          </label>
          <input
            type="text"
            id="contenance"
            name="contenance"
            value={product.contenance || ''}
            onChange={(e) => onChange({ contenance: e.target.value })}
            required
            placeholder="Ex: 75cl"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="pourcentage_alcool" className="block text-sm font-medium text-gray-700">
          Pourcentage d'alcool
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="number"
            id="pourcentage_alcool"
            name="pourcentage_alcool"
            value={product.pourcentage_alcool || ''}
            onChange={(e) => onChange({ pourcentage_alcool: parseFloat(e.target.value) })}
            required
            step="0.1"
            min="0"
            max="100"
            className="block w-full rounded-md border-gray-300 pr-12 focus:border-purple-500 focus:ring-purple-500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm">% vol.</span>
          </div>
        </div>
      </div>
    </div>
  );
}