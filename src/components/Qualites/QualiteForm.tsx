import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Qualite } from '../../types/database.types';

interface QualiteFormProps {
  qualite?: Qualite;
  onSuccess: () => void;
  onCancel: () => void;
}

export function QualiteForm({ qualite, onSuccess, onCancel }: QualiteFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const qualiteData = {
      nom: formData.get('nom') as string,
      taux_sucre_residuel: parseFloat(formData.get('taux_sucre_residuel') as string) || null,
      acidite_totale: parseFloat(formData.get('acidite_totale') as string) || null,
      ph: parseFloat(formData.get('ph') as string) || null,
    };

    try {
      if (qualite?.id) {
        const { error } = await supabase
          .from('qualites')
          .update(qualiteData)
          .eq('id', qualite.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('qualites')
          .insert(qualiteData);
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
          Nom de la qualité
        </label>
        <input
          type="text"
          name="nom"
          id="nom"
          defaultValue={qualite?.nom}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Ex: Grand Cru, Premier Cru, etc."
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="taux_sucre_residuel" className="block text-sm font-medium text-gray-700">
            Taux de sucre résiduel (g/L)
          </label>
          <input
            type="number"
            name="taux_sucre_residuel"
            id="taux_sucre_residuel"
            defaultValue={qualite?.taux_sucre_residuel || ''}
            step="0.1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="acidite_totale" className="block text-sm font-medium text-gray-700">
            Acidité totale (g/L H2T)
          </label>
          <input
            type="number"
            name="acidite_totale"
            id="acidite_totale"
            defaultValue={qualite?.acidite_totale || ''}
            step="0.1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="ph" className="block text-sm font-medium text-gray-700">
            pH
          </label>
          <input
            type="number"
            name="ph"
            id="ph"
            defaultValue={qualite?.ph || ''}
            step="0.01"
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
          {loading ? 'Enregistrement...' : qualite?.id ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
}