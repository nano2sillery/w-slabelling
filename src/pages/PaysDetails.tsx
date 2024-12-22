import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePaysDestinations } from '../hooks/usePaysDestinations';
import { useReglementationsPays } from '../hooks/useReglementationsPays';
import { ReglementationList } from '../components/Reglementations/ReglementationList';
import { ReglementationForm } from '../components/Reglementations/ReglementationForm';
import { Modal } from '../components/UI/Modal';
import type { ReglementationPays } from '../types/reglementation.types';

export function PaysDetails() {
  const { id } = useParams<{ id: string }>();
  const { pays } = usePaysDestinations();
  const { reglementations, loading, error } = useReglementationsPays(id!);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReglementation, setSelectedReglementation] = useState<ReglementationPays | undefined>();

  const currentPays = pays.find(p => p.id === id);

  const handleAddClick = () => {
    setSelectedReglementation(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (reglementation: ReglementationPays) => {
    setSelectedReglementation(reglementation);
    setIsModalOpen(true);
  };

  if (!currentPays) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Pays non trouvé.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-gray-500">Chargement des réglementations...</div>
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
      <div className="mb-6">
        <Link to="/pays" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux pays
        </Link>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{currentPays.nom}</h2>
          <p className="mt-1 text-sm text-gray-500">Zone douanière : {currentPays.zone_douaniere}</p>
        </div>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter une réglementation
        </button>
      </div>

      {currentPays.restrictions_generales && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-1">Restrictions générales :</h3>
          <p className="text-sm text-yellow-700">{currentPays.restrictions_generales}</p>
        </div>
      )}

      <ReglementationList
        reglementations={reglementations}
        onEdit={handleEditClick}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedReglementation ? 'Modifier la réglementation' : 'Ajouter une réglementation'}
      >
        <ReglementationForm
          reglementation={selectedReglementation}
          paysId={id!}
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