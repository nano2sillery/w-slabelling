import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Qualite } from '../types/database.types';

export function useMarqueQualites(marqueId?: string, categorieId?: string) {
  const [qualites, setQualites] = useState<Qualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!marqueId || !categorieId) {
      setQualites([]);
      setLoading(false);
      return;
    }

    async function fetchQualites() {
      try {
        const { data, error } = await supabase
          .from('marques_qualites')
          .select(`
            qualite:qualites(*)
          `)
          .eq('marque_id', marqueId)
          .eq('categorie_id', categorieId)
          .eq('actif', true);

        if (error) throw error;
        setQualites(data.map(item => item.qualite));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }

    fetchQualites();
  }, [marqueId, categorieId]);

  return { qualites, loading, error };
}