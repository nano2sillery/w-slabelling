import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useMarques } from '../hooks/useMarques';
import { MarqueCard } from '../components/Marques/MarqueCard';
import { Modal } from '../components/UI/Modal';
import { MarqueForm } from '../components/Marques/MarqueForm';
import type { Marque } from '../types/database.types';

export function Marques() {
  const { marques, loading, error } = useMarques();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMarque, setSelectedMarque] = useState<Marque | undefined>();

  const handleAddClick = () => {
    setSelectedMarque(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (marque: Marque) => {
    setSelectedMarque(marque);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-gray-500">Chargement des marques...</div>
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
        <h2 className="text-2xl font-bold text-gray-900">Marques</h2>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter une marque
        </button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {marques.map((marque) => (
          <MarqueCard
            key={marque.id}
            marque={marque}
            onClick={() => handleEditClick(marque)}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedMarque ? 'Modifier la marque' : 'Ajouter une marque'}
      >
        <MarqueForm
          marque={selectedMarque}
          onSuccess={() => {
            setIsModalOpen(false);
            window.location.reload();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}