import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { ReglementationPays } from '../types/reglementation.types';

export function useReglementationsPays(paysId: string) {
  const [reglementations, setReglementations] = useState<ReglementationPays[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReglementations() {
      try {
        const { data, error } = await supabase
          .from('reglementations_pays')
          .select('*')
          .eq('pays_id', paysId);

        if (error) throw error;
        setReglementations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }

    if (paysId) {
      fetchReglementations();
    }
  }, [paysId]);

  return { reglementations, loading, error };
}