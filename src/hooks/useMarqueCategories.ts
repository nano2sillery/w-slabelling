import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Categorie } from '../types/database.types';

export function useMarqueCategories(marqueId?: string) {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!marqueId) {
      setCategories([]);
      setLoading(false);
      return;
    }

    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('marques_categories')
          .select(`
            categorie:categories(*)
          `)
          .eq('marque_id', marqueId)
          .eq('actif', true);

        if (error) throw error;
        setCategories(data.map(item => item.categorie));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, [marqueId]);

  return { categories, loading, error };
}