import React from 'react';
import type { Product, Qualite } from '../../types/database.types';

interface ProductQualiteSelectProps {
  product: Partial<Product>;
  availableQualites: Qualite[];
  onChange: (data: Partial<Product>) => void;
}

export function ProductQualiteSelect({ 
  product, 
  availableQualites, 
  onChange 
}: ProductQualiteSelectProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Qualité</h3>
      
      <div>
        <label htmlFor="qualite_id" className="block text-sm font-medium text-gray-700">
          Sélectionner une qualité
        </label>
        <select
          id="qualite_id"
          name="qualite_id"
          value={product.qualite_id || ''}
          onChange={(e) => onChange({ qualite_id: e.target.value })}
          required
          disabled={!product.categorie_id}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 disabled:bg-gray-100"
        >
          <option value="">Sélectionner une qualité</option>
          {availableQualites.map((qualite) => (
            <option key={qualite.id} value={qualite.id}>
              {qualite.nom}
              {qualite.taux_sucre_residuel && ` - ${qualite.taux_sucre_residuel}g/L`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}