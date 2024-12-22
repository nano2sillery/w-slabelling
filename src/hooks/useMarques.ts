import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Marque = Database['public']['Tables']['marques']['Row'];

export function useMarques() {
  const [marques, setMarques] = useState<Marque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMarques() {
      try {
        const { data, error } = await supabase
          .from('marques')
          .select('*')
          .order('nom');

        if (error) throw error;
        setMarques(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }

    fetchMarques();
  }, []);

  return { marques, loading, error };
}