import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Categorie } from '../../types/database.types';

interface CategorieFormProps {
  categorie?: Categorie;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CategorieForm({ categorie, onSuccess, onCancel }: CategorieFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const categorieData = {
      nom: formData.get('nom') as string,
    };

    try {
      if (categorie?.id) {
        const { error } = await supabase
          .from('categories')
          .update(categorieData)
          .eq('id', categorie.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert(categorieData);
        if (error) throw error;
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
          Nom de la catégorie
        </label>
        <input
          type="text"
          name="nom"
          id="nom"
          defaultValue={categorie?.nom}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Ex: Vin rouge, Vin blanc, etc."
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : categorie?.id ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
}