import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { MentionLegale } from '../../types/database.types';

interface MentionLegaleFormProps {
  mention?: MentionLegale;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MentionLegaleForm({ mention, onSuccess, onCancel }: MentionLegaleFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const mentionData = {
      type: formData.get('type') as string,
      texte_generique: formData.get('texte_generique') as string,
      categorie: formData.get('categorie') as string,
      champ_visuel: formData.get('champ_visuel') as string,
      taille_min: parseFloat(formData.get('taille_min') as string),
      contraste_min: parseFloat(formData.get('contraste_min') as string),
      obligatoire: formData.get('obligatoire') === 'true',
      position: formData.get('position') as string,
      style_texte: formData.get('style_texte') as string,
    };

    try {
      if (mention?.id) {
        const { error } = await supabase
          .from('mentions_legales')
          .update(mentionData)
          .eq('id', mention.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('mentions_legales')
          .insert(mentionData);
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
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Type de mention
        </label>
        <input
          type="text"
          name="type"
          id="type"
          defaultValue={mention?.type}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Ex: Allergènes, Origine, etc."
        />
      </div>

      <div>
        <label htmlFor="categorie" className="block text-sm font-medium text-gray-700">
          Catégorie
        </label>
        <select
          name="categorie"
          id="categorie"
          defaultValue={mention?.categorie || 'generale'}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="generale">Générale</option>
          <option value="vin">Vin</option>
          <option value="spiritueux">Spiritueux</option>
          <option value="nutritionnelle">Nutritionnelle</option>
          <option value="reglementaire">Réglementaire</option>
        </select>
      </div>

      <div>
        <label htmlFor="texte_generique" className="block text-sm font-medium text-gray-700">
          Texte générique
        </label>
        <textarea
          name="texte_generique"
          id="texte_generique"
          defaultValue={mention?.texte_generique}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Saisissez le texte de la mention légale..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="champ_visuel" className="block text-sm font-medium text-gray-700">
            Champ visuel
          </label>
          <select
            name="champ_visuel"
            id="champ_visuel"
            defaultValue={mention?.champ_visuel || 'principal'}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="principal">Principal</option>
            <option value="secondaire">Secondaire</option>
            <option value="dos">Dos de l'étiquette</option>
          </select>
        </div>

        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">
            Position
          </label>
          <select
            name="position"
            id="position"
            defaultValue={mention?.position || 'haut'}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="haut">Haut</option>
            <option value="bas">Bas</option>
            <option value="gauche">Gauche</option>
            <option value="droite">Droite</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="taille_min" className="block text-sm font-medium text-gray-700">
            Taille minimale (mm)
          </label>
          <input
            type="number"
            name="taille_min"
            id="taille_min"
            defaultValue={mention?.taille_min || 1.2}
            step="0.1"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="contraste_min" className="block text-sm font-medium text-gray-700">
            Contraste minimal
          </label>
          <input
            type="number"
            name="contraste_min"
            id="contraste_min"
            defaultValue={mention?.contraste_min || 4.5}
            step="0.1"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="style_texte" className="block text-sm font-medium text-gray-700">
          Style de texte
        </label>
        <select
          name="style_texte"
          id="style_texte"
          defaultValue={mention?.style_texte || 'normal'}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="normal">Normal</option>
          <option value="gras">Gras</option>
          <option value="italique">Italique</option>
          <option value="gras_italique">Gras et italique</option>
        </select>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="obligatoire"
            defaultChecked={mention?.obligatoire}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <span className="ml-2 text-sm text-gray-700">
            Cette mention est obligatoire
          </span>
        </label>
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
          {loading ? 'Enregistrement...' : mention?.id ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
}