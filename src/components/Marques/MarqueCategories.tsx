import React, { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { supabase } from '../../lib/supabase';
import type { Marque, Categorie } from '../../types/database.types';

interface MarqueCategoriesProps {
  marque: Marque;
  onUpdate: () => void;
}

export function MarqueCategories({ marque, onUpdate }: MarqueCategoriesProps) {
  const { categories } = useCategories();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('marques_categories')
        .insert(
          selectedCategories.map(categoryId => ({
            marque_id: marque.id,
            categorie_id: categoryId,
            actif: true
          }))
        );
      if (error) throw error;
      onUpdate();
    } catch (err) {
      console.error('Erreur lors de l\'ajout des catégories:', err);
    } finally {
      setLoading(false);
      setSelectedCategories([]);
    }
  };

  const handleRemoveCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('marques_categories')
        .update({ actif: false })
        .eq('marque_id', marque.id)
        .eq('categorie_id', categoryId);
      
      if (error) throw error;
      onUpdate();
    } catch (err) {
      console.error('Erreur lors de la suppression de la catégorie:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Catégories de produits</h3>
        <button
          onClick={handleSave}
          disabled={selectedCategories.length === 0 || loading}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </button>
      </div>

      <select
        multiple
        value={selectedCategories}
        onChange={(e) => {
          const values = Array.from(e.target.selectedOptions, option => option.value);
          setSelectedCategories(values);
        }}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.nom}
          </option>
        ))}
      </select>

      <div className="mt-4 space-y-2">
        {marque.categories?.map((category: Categorie) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
          >
            <div className="flex items-center">
              <Tag className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-sm text-gray-900">{category.nom}</span>
            </div>
            <button
              onClick={() => handleRemoveCategory(category.id)}
              className="text-gray-400 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}