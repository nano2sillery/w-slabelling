import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { ReglementationPays } from '../../types/reglementation.types';

interface ReglementationFormProps {
  reglementation?: ReglementationPays;
  paysId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ReglementationForm({ reglementation, paysId, onSuccess, onCancel }: ReglementationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const reglementationData = {
      pays_id: paysId,
      type_reglementation: formData.get('type_reglementation') as string,
      description: formData.get('description') as string,
      documents_requis: (formData.get('documents_requis') as string)
        .split('\n')
        .filter(doc => doc.trim() !== '')
    };

    try {
      if (reglementation?.id) {
        const { error } = await supabase
          .from('reglementations_pays')
          .update(reglementationData)
          .eq('id', reglementation.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('reglementations_pays')
          .insert(reglementationData);
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
        <label htmlFor="type_reglementation" className="block text-sm font-medium text-gray-700">
          Type de réglementation
        </label>
        <input
          type="text"
          id="type_reglementation"
          name="type_reglementation"
          defaultValue={reglementation?.type_reglementation}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Ex: Étiquetage, Import, Sanitaire..."
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={reglementation?.description}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Description détaillée de la réglementation..."
        />
      </div>

      <div>
        <label htmlFor="documents_requis" className="block text-sm font-medium text-gray-700">
          Documents requis (un par ligne)
        </label>
        <textarea
          id="documents_requis"
          name="documents_requis"
          defaultValue={reglementation?.documents_requis.join('\n')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Certificat d'origine&#10;Analyse laboratoire&#10;..."
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
          {loading ? 'Enregistrement...' : reglementation?.id ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
}