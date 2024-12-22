import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { PaysDestination } from '../../types/reglementation.types';

interface PaysFormProps {
  pays?: PaysDestination;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaysForm({ pays, onSuccess, onCancel }: PaysFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const paysData = {
      code: (formData.get('code') as string).toUpperCase(),
      nom: formData.get('nom') as string,
      zone_douaniere: formData.get('zone_douaniere') as string,
      restrictions_generales: formData.get('restrictions_generales') as string,
    };

    try {
      if (pays?.id) {
        const { error } = await supabase
          .from('pays_destinations')
          .update(paysData)
          .eq('id', pays.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('pays_destinations')
          .insert(paysData);
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Code pays (ISO)
          </label>
          <input
            type="text"
            id="code"
            name="code"
            maxLength={2}
            defaultValue={pays?.code}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="FR"
          />
        </div>

        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
            Nom du pays
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            defaultValue={pays?.nom}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="France"
          />
        </div>
      </div>

      <div>
        <label htmlFor="zone_douaniere" className="block text-sm font-medium text-gray-700">
          Zone douanière
        </label>
        <input
          type="text"
          id="zone_douaniere"
          name="zone_douaniere"
          defaultValue={pays?.zone_douaniere}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Union Européenne"
        />
      </div>

      <div>
        <label htmlFor="restrictions_generales" className="block text-sm font-medium text-gray-700">
          Restrictions générales
        </label>
        <textarea
          id="restrictions_generales"
          name="restrictions_generales"
          defaultValue={pays?.restrictions_generales}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Restrictions applicables à tous les produits..."
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
          {loading ? 'Enregistrement...' : pays?.id ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
}