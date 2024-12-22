import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Product, Categorie, Qualite } from '../../types/database.types';
import { ProductBasicInfo } from './ProductBasicInfo';
import { ProductMarqueSelect } from './ProductMarqueSelect';
import { ProductCategorySelect } from './ProductCategorySelect';
import { ProductQualiteSelect } from './ProductQualiteSelect';
import { ProductDescriptions } from './ProductDescriptions';
import { ProductMillesimes } from './ProductMillesimes';

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>(product || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<Categorie[]>([]);
  const [availableQualites, setAvailableQualites] = useState<Qualite[]>([]);

  const updateFormData = (data: Partial<Product>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (product?.id) {
        const { error } = await supabase
          .from('produits')
          .update(formData)
          .eq('id', product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('produits')
          .insert(formData);
        if (error) throw error;
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <ProductBasicInfo 
        product={formData} 
        onChange={updateFormData} 
      />

      <ProductMarqueSelect 
        product={formData} 
        onChange={updateFormData}
        onCategoriesChange={setAvailableCategories}
      />

      <ProductCategorySelect 
        product={formData}
        availableCategories={availableCategories}
        onChange={updateFormData}
        onQualitesChange={setAvailableQualites}
      />

      <ProductQualiteSelect 
        product={formData}
        availableQualites={availableQualites}
        onChange={updateFormData}
      />

      <ProductMillesimes 
        product={formData as Product}
        onUpdate={updateFormData}
      />

      <ProductDescriptions 
        product={formData}
        onChange={updateFormData}
      />

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : product?.id ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
}