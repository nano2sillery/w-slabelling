import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useQualites } from '../hooks/useQualites';
import { Modal } from '../components/UI/Modal';
import { QualiteForm } from '../components/Qualites/QualiteForm';
import type { Qualite } from '../types/database.types';

export function Qualites() {
  const { qualites, loading, error } = useQualites();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQualite, setSelectedQualite] = useState<Qualite | undefined>();

  const handleAddClick = () => {
    setSelectedQualite(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (qualite: Qualite) => {
    setSelectedQualite(qualite);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-gray-500">Chargement des qualités...</div>
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
        <h2 className="text-2xl font-bold text-gray-900">Qualités</h2>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter une qualité
        </button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {qualites.map((qualite) => (
          <div
            key={qualite.id}
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleEditClick(qualite)}
          >
            <h3 className="font-medium text-gray-900">{qualite.nom}</h3>
            <dl className="mt-2 text-sm text-gray-500">
              {qualite.taux_sucre_residuel && (
                <div className="mt-1">
                  <dt className="inline">Sucre résiduel : </dt>
                  <dd className="inline">{qualite.taux_sucre_residuel} g/L</dd>
                </div>
              )}
              {qualite.acidite_totale && (
                <div className="mt-1">
                  <dt className="inline">Acidité totale : </dt>
                  <dd className="inline">{qualite.acidite_totale} g/L H2T</dd>
                </div>
              )}
              {qualite.ph && (
                <div className="mt-1">
                  <dt className="inline">pH : </dt>
                  <dd className="inline">{qualite.ph}</dd>
                </div>
              )}
            </dl>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedQualite ? 'Modifier la qualité' : 'Ajouter une qualité'}
      >
        <QualiteForm
          qualite={selectedQualite}
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