import React, { useState } from 'react';
import { Award, Plus, X } from 'lucide-react';
import { useQualites } from '../../hooks/useQualites';
import { supabase } from '../../lib/supabase';
import type { Marque, Categorie, Qualite } from '../../types/database.types';

interface MarqueQualitesProps {
  marque: Marque;
  category: Categorie;
  onUpdate: () => void;
}

export function MarqueQualites({ marque, category, onUpdate }: MarqueQualitesProps) {
  const { qualites } = useQualites();
  const [selectedQualites, setSelectedQualites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('marques_qualites')
        .insert(
          selectedQualites.map(qualiteId => ({
            marque_id: marque.id,
            categorie_id: category.id,
            qualite_id: qualiteId,
            actif: true
          }))
        );
      if (error) throw error;
      onUpdate();
    } catch (err) {
      console.error('Erreur lors de l\'ajout des qualités:', err);
    } finally {
      setLoading(false);
      setSelectedQualites([]);
    }
  };

  const handleRemoveQualite = async (qualiteId: string) => {
    try {
      const { error } = await supabase
        .from('marques_qualites')
        .update({ actif: false })
        .eq('marque_id', marque.id)
        .eq('categorie_id', category.id)
        .eq('qualite_id', qualiteId);
      
      if (error) throw error;
      onUpdate();
    } catch (err) {
      console.error('Erreur lors de la suppression de la qualité:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Qualités pour {category.nom}
        </h3>
        <button
          onClick={handleSave}
          disabled={selectedQualites.length === 0 || loading}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </button>
      </div>

      <select
        multiple
        value={selectedQualites}
        onChange={(e) => {
          const values = Array.from(e.target.selectedOptions, option => option.value);
          setSelectedQualites(values);
        }}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
      >
        {qualites.map((qualite) => (
          <option key={qualite.id} value={qualite.id}>
            {qualite.nom}
          </option>
        ))}
      </select>

      <div className="mt-4 space-y-2">
        {marque.qualites?.filter((q: Qualite & { categorie_id: string }) => 
          q.categorie_id === category.id
        ).map((qualite: Qualite) => (
          <div
            key={qualite.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
          >
            <div className="flex items-center">
              <Award className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-sm text-gray-900">{qualite.nom}</span>
            </div>
            <button
              onClick={() => handleRemoveQualite(qualite.id)}
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