import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { PaysDestination } from '../types/reglementation.types';

export function usePaysDestinations() {
  const [pays, setPays] = useState<PaysDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPays() {
      try {
        const { data, error } = await supabase
          .from('pays_destinations')
          .select('*')
          .order('nom');

        if (error) throw error;
        setPays(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }

    fetchPays();
  }, []);

  return { pays, loading, error };
}