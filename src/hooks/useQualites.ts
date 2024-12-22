import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Qualite } from '../types/database.types';

export function useQualites() {
  const [qualites, setQualites] = useState<Qualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQualites() {
      try {
        const { data, error } = await supabase
          .from('qualites')
          .select('*')
          .order('nom');

        if (error) throw error;
        setQualites(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }

    fetchQualites();
  }, []);

  return { qualites, loading, error };
}