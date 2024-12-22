import type { Product } from '../types/database.types';
import type { PaysDestination, ReglementationPays } from '../types/reglementation.types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  documentsRequis: string[];
}

export function validateProductForCountry(
  product: Product,
  pays: PaysDestination,
  reglementations: ReglementationPays[]
): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    documentsRequis: []
  };

  // Vérification des restrictions générales du pays
  if (pays.restrictions_generales) {
    result.warnings.push(pays.restrictions_generales);
  }

  // Collecte des documents requis
  reglementations.forEach(reg => {
    result.documentsRequis.push(...reg.documents_requis);
  });

  // Vérifications spécifiques selon le type de produit
  if (product.categorie?.nom.toLowerCase().includes('vin')) {
    validateWineRegulations(product, reglementations, result);
  }

  // Mise à jour du statut final
  result.isValid = result.errors.length === 0;

  return result;
}

function validateWineRegulations(
  product: Product,
  reglementations: ReglementationPays[],
  result: ValidationResult
) {
  // Vérification du titre alcoométrique
  if (!product.pourcentage_alcool) {
    result.errors.push('Le titre alcoométrique est obligatoire pour les vins');
  }

  // Vérification des mentions obligatoires
  if (!product.pays_origine) {
    result.errors.push('Le pays d\'origine est obligatoire');
  }
}