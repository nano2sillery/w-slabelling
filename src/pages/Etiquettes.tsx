import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { EtiquettePreview } from '../components/Etiquettes/EtiquettePreview';
import { EtiquetteForm } from '../components/Etiquettes/EtiquetteForm';
import type { Product } from '../types/database.types';

export function Etiquettes() {
  const { products, loading, error } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-gray-500">Chargement des produits...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Générateur d'étiquettes</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <EtiquetteForm
            products={products}
            selectedProduct={selectedProduct}
            onProductSelect={setSelectedProduct}
          />
        </div>
        
        <div className="lg:sticky lg:top-6">
          <EtiquettePreview product={selectedProduct} />
        </div>
      </div>
    </div>
  );
}