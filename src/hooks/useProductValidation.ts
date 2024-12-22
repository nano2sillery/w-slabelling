import { useState, useEffect } from 'react';
import { validateProductForCountry, type ValidationResult } from '../utils/validationReglementaire';
import { useReglementationsPays } from './useReglementationsPays';
import type { Product } from '../types/database.types';
import type { PaysDestination } from '../types/reglementation.types';

export function useProductValidation(product: Product, pays: PaysDestination) {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const { reglementations, loading: loadingReglementations } = useReglementationsPays(pays.id);

  useEffect(() => {
    if (!loadingReglementations && reglementations) {
      const result = validateProductForCountry(product, pays, reglementations);
      setValidation(result);
      setLoading(false);
    }
  }, [product, pays, reglementations, loadingReglementations]);

  return { validation, loading };
}