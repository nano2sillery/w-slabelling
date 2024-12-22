import React, { useEffect, useState } from 'react';
import type { Product, Categorie, Qualite } from '../../types/database.types';
import { supabase } from '../../lib/supabase';

interface ProductCategorySelectProps {
  product: Partial<Product>;
  availableCategories: Categorie[];
  onChange: (data: Partial<Product>) => void;
  onQualitesChange: (qualites: Qualite[]) => void;
}

export function ProductCategorySelect({ 
  product, 
  availableCategories, 
  onChange,
  onQualitesChange 
}: ProductCategorySelectProps) {
  const [categoryQualites, setCategoryQualites] = useState<Qualite[]>([]);

  useEffect(() => {
    if (product.marque_id && product.categorie_id) {
      fetchCategoryQualites(product.marque_id, product.categorie_id);
    }
  }, [product.marque_id, product.categorie_id]);

  const fetchCategoryQualites = async (marqueId: string, categoryId: string) => {
    const { data, error } = await supabase
      .from('marques_qualites')
      .select('qualite:qualites(*)')
      .eq('marque_id', marqueId)
      .eq('categorie_id', categoryId)
      .eq('actif', true);

    if (!error && data) {
      const qualites = data.map(item => item.qualite);
      setCategoryQualites(qualites);
      onQualitesChange(qualites);
    }
  };

  const handleCategoryChange = async (categoryId: string) => {
    onChange({ categorie_id: categoryId, qualite_id: null });
    if (product.marque_id && categoryId) {
      await fetchCategoryQualites(product.marque_id, categoryId);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Catégorie</h3>
      
      <div>
        <label htmlFor="categorie_id" className="block text-sm font-medium text-gray-700">
          Sélectionner une catégorie
        </label>
        <select
          id="categorie_id"
          name="categorie_id"
          value={product.categorie_id || ''}
          onChange={(e) => handleCategoryChange(e.target.value)}
          required
          disabled={!product.marque_id}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 disabled:bg-gray-100"
        >
          <option value="">Sélectionner une catégorie</option>
          {availableCategories.map((categorie) => (
            <option key={categorie.id} value={categorie.id}>
              {categorie.nom}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}