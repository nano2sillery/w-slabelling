import React, { useEffect, useState } from 'react';
import { useMarques } from '../../hooks/useMarques';
import type { Product, Marque, Categorie } from '../../types/database.types';
import { supabase } from '../../lib/supabase';

interface ProductMarqueSelectProps {
  product: Partial<Product>;
  onChange: (data: Partial<Product>) => void;
  onCategoriesChange: (categories: Categorie[]) => void;
}

export function ProductMarqueSelect({ product, onChange, onCategoriesChange }: ProductMarqueSelectProps) {
  const { marques } = useMarques();
  const [selectedMarque, setSelectedMarque] = useState<Marque | null>(null);
  const [marqueCategories, setMarqueCategories] = useState<Categorie[]>([]);

  useEffect(() => {
    if (product.marque_id) {
      const marque = marques.find(m => m.id === product.marque_id);
      setSelectedMarque(marque || null);
      fetchMarqueCategories(product.marque_id);
    }
  }, [product.marque_id, marques]);

  const fetchMarqueCategories = async (marqueId: string) => {
    const { data, error } = await supabase
      .from('marques_categories')
      .select('categorie:categories(*)')
      .eq('marque_id', marqueId)
      .eq('actif', true);

    if (!error && data) {
      const categories = data.map(item => item.categorie);
      setMarqueCategories(categories);
      onCategoriesChange(categories);
    }
  };

  const handleMarqueChange = async (marqueId: string) => {
    onChange({ marque_id: marqueId, categorie_id: null, qualite_id: null });
    await fetchMarqueCategories(marqueId);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Marque</h3>
      
      <div>
        <label htmlFor="marque_id" className="block text-sm font-medium text-gray-700">
          Sélectionner une marque
        </label>
        <select
          id="marque_id"
          name="marque_id"
          value={product.marque_id || ''}
          onChange={(e) => handleMarqueChange(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="">Sélectionner une marque</option>
          {marques.map((marque) => (
            <option key={marque.id} value={marque.id}>
              {marque.nom}
            </option>
          ))}
        </select>
      </div>

      {selectedMarque?.description && (
        <p className="text-sm text-gray-500">{selectedMarque.description}</p>
      )}
    </div>
  );
}