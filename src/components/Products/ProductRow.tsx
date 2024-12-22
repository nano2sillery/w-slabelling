import React from 'react';
import type { Product } from '../../types/database.types';
import { ProductDetails } from './ProductDetails';
import { ProductActions } from './ProductActions';

interface ProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductRow({ product, onEdit, onDelete }: ProductRowProps) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <ProductDetails product={product} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{product.marque?.nom}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{product.categorie?.nom}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{product.qualite?.nom}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <ProductActions 
          onEdit={() => onEdit(product)}
          onDelete={() => onDelete(product)}
        />
      </td>
    </tr>
  );
}