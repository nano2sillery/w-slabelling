import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['produits']['Row'] & {
  marque: Database['public']['Tables']['marques']['Row'];
  categorie: Database['public']['Tables']['categories']['Row'];
  qualite: Database['public']['Tables']['qualites']['Row'];
};

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('produits')
          .select(`
            *,
            marque:marques(*),
            categorie:categories(*),
            qualite:qualites(*)
          `);

        if (error) throw error;
        setProducts(data as Product[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}