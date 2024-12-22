import React from 'react';
import { Download } from 'lucide-react';
import type { Product } from '../../types/database.types';
import { genererMentionsLegales } from '../../utils/mentionsLegales';

interface EtiquettePreviewProps {
  product: Product | null;
}

export function EtiquettePreview({ product }: EtiquettePreviewProps) {
  if (!product) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6 text-center">
        <p className="text-gray-500">
          Sélectionnez un produit pour prévisualiser son étiquette
        </p>
      </div>
    );
  }

  const mentions = genererMentionsLegales(product);

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-gray-900">Prévisualisation</h3>
        <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </button>
      </div>

      <div className="border rounded-lg p-6 bg-gray-50">
        <div className="space-y-6 text-center">
          <div>
            <h4 className="text-xl font-semibold text-gray-900">{product.marque?.nom}</h4>
            <p className="text-2xl font-bold mt-2">{product.nom}</p>
          </div>

          {product.qualite && (
            <p className="text-lg font-medium text-gray-800">{product.qualite.nom}</p>
          )}

          <div className="text-sm text-gray-600">
            <p>{product.pays_origine}</p>
            <p>{product.contenance} - {product.pourcentage_alcool}% vol.</p>
          </div>

          <div className="pt-4 border-t text-xs text-gray-500 space-y-1">
            {mentions.map((mention, index) => (
              <p key={index}>{mention}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}