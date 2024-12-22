import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePaysDestinations } from '../hooks/usePaysDestinations';
import { PaysCard } from '../components/Pays/PaysCard';
import { Modal } from '../components/UI/Modal';
import { PaysForm } from '../components/Pays/PaysForm';
import type { PaysDestination } from '../types/reglementation.types';

export function Pays() {
  const { pays, loading, error } = usePaysDestinations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPays, setSelectedPays] = useState<PaysDestination | undefined>();

  const handleAddClick = () => {
    setSelectedPays(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (pays: PaysDestination) => {
    setSelectedPays(pays);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-gray-500">Chargement des pays...</div>
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
        <h2 className="text-2xl font-bold text-gray-900">Pays de destination</h2>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter un pays
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pays.map((pays) => (
          <PaysCard
            key={pays.id}
            pays={pays}
            onClick={() => handleEditClick(pays)}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPays ? 'Modifier le pays' : 'Ajouter un pays'}
      >
        <PaysForm
          pays={selectedPays}
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