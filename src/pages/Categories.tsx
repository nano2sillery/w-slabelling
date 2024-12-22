import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { CategorieCard } from '../components/Categories/CategorieCard';
import { Modal } from '../components/UI/Modal';
import { CategorieForm } from '../components/Categories/CategorieForm';
import type { Categorie } from '../types/database.types';

export function Categories() {
  const { categories, loading, error } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategorie, setSelectedCategorie] = useState<Categorie | undefined>();

  const handleAddClick = () => {
    setSelectedCategorie(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (categorie: Categorie) => {
    setSelectedCategorie(categorie);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCategorie(undefined);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-gray-500">Chargement des catégories...</div>
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Catégories</h2>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter une catégorie
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((categorie) => (
          <CategorieCard
            key={categorie.id}
            categorie={categorie}
            onClick={() => handleEditClick(categorie)}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={selectedCategorie ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
      >
        <CategorieForm
          categorie={selectedCategorie}
          onSuccess={() => {
            handleModalClose();
            window.location.reload();
          }}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
}