import React, { useState } from 'react';
import { useMarques } from '../hooks/useMarques';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type ProductInsert = Database['public']['Tables']['produits']['Insert'];

interface ProductFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ onSuccess, onCancel }: ProductFormProps) {
  const { marques } = useMarques();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const productData: ProductInsert = {
      nom: formData.get('nom') as string,
      marque_id: formData.get('marque_id') as string,
      pays_origine: formData.get('pays_origine') as string,
      pourcentage_alcool: parseFloat(formData.get('pourcentage_alcool') as string),
      contenance: formData.get('contenance') as string,
      millesime: formData.get('millesime') === 'true',
    };

    try {
      const { error } = await supabase.from('produits').insert(productData);
      if (error) throw error;
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
          Nom du produit
        </label>
        <input
          type="text"
          name="nom"
          id="nom"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div>
        <label htmlFor="marque_id" className="block text-sm font-medium text-gray-700">
          Marque
        </label>
        <select
          name="marque_id"
          id="marque_id"
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="pays_origine" className="block text-sm font-medium text-gray-700">
            Pays d'origine
          </label>
          <input
            type="text"
            name="pays_origine"
            id="pays_origine"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="pourcentage_alcool" className="block text-sm font-medium text-gray-700">
            Pourcentage d'alcool
          </label>
          <input
            type="number"
            name="pourcentage_alcool"
            id="pourcentage_alcool"
            step="0.1"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
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
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}