import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { MentionLegale } from '../types/database.types';

export function useMentionsLegales() {
  const [mentions, setMentions] = useState<MentionLegale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMentions() {
      try {
        const { data, error } = await supabase
          .from('mentions_legales')
          .select('*')
          .order('type');

        if (error) throw error;
        setMentions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }

    fetchMentions();
  }, []);

  return { mentions, loading, error };
}