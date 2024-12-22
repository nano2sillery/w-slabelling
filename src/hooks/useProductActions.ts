import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types/database.types';

export function useProductActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProduct = async (productId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('produits')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId: string, data: Partial<Product>) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('produits')
        .update(data)
        .eq('id', productId);

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteProduct,
    updateProduct,
    loading,
    error
  };
}