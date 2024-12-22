import React from 'react';
import { Search } from 'lucide-react';
import type { Product } from '../../types/database.types';

interface EtiquetteFormProps {
  products: Product[];
  selectedProduct: Product | null;
  onProductSelect: (product: Product | null) => void;
}

export function EtiquetteForm({ products, selectedProduct, onProductSelect }: EtiquetteFormProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="space-y-6">
        <div>
          <label htmlFor="product" className="block text-sm font-medium text-gray-700">
            Sélectionner un produit
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="product"
              className="block w-full pl-10 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
              value={selectedProduct?.id || ''}
              onChange={(e) => {
                const product = products.find(p => p.id === e.target.value);
                onProductSelect(product || null);
              }}
            >
              <option value="">Choisir un produit</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.nom} - {product.marque?.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedProduct && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Informations du produit</h3>
              <dl className="mt-2 space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Marque</dt>
                  <dd className="text-sm text-gray-900">{selectedProduct.marque?.nom}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Catégorie</dt>
                  <dd className="text-sm text-gray-900">{selectedProduct.categorie?.nom}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Qualité</dt>
                  <dd className="text-sm text-gray-900">{selectedProduct.qualite?.nom}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Origine</dt>
                  <dd className="text-sm text-gray-900">{selectedProduct.pays_origine}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">Options d'impression</h3>
              <div className="mt-2 space-y-4">
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Inclure les mentions légales obligatoires
                    </span>
                  </label>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Afficher le code-barres
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}