import React from 'react';
import type { Product } from '../../types/database.types';
import { ProductQualityBadge } from './ProductQualityBadge';
import { ProductStats } from './ProductStats';
import { ProductDescription } from './ProductDescription';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="py-2">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">{product.nom}</h3>
          <ProductStats
            alcohol={product.pourcentage_alcool}
            origin={product.pays_origine}
            vintage={product.millesime}
          />
        </div>
        {product.qualite && (
          <ProductQualityBadge
            qualityName={product.qualite.nom}
            sugarLevel={product.qualite.taux_sucre_residuel}
            acidity={product.qualite.acidite_totale}
          />
        )}
      </div>
      <ProductDescription
        short={product.description_courte}
        medium={product.description_moyenne}
        long={product.description_longue}
      />
    </div>
  );
}