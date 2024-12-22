import { useState, useMemo } from 'react';
import type { Product } from '../types/database.types';

type SortField = 'nom' | 'marque' | 'categorie' | 'pays_origine';
type SortDirection = 'asc' | 'desc';

export function useProductSort(products: Product[]) {
  const [sortField, setSortField] = useState<SortField>('nom');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      let valueA: string;
      let valueB: string;

      switch (sortField) {
        case 'marque':
          valueA = a.marque?.nom || '';
          valueB = b.marque?.nom || '';
          break;
        case 'categorie':
          valueA = a.categorie?.nom || '';
          valueB = b.categorie?.nom || '';
          break;
        case 'pays_origine':
          valueA = a.pays_origine;
          valueB = b.pays_origine;
          break;
        default:
          valueA = a.nom;
          valueB = b.nom;
      }

      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB, 'fr');
      } else {
        return valueB.localeCompare(valueA, 'fr');
      }
    });
  }, [products, sortField, sortDirection]);

  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    sortedProducts,
    sortField,
    sortDirection,
    toggleSort
  };
}