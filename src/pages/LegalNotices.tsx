import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useMentionsLegales } from '../hooks/useMentionsLegales';
import { MentionLegaleCard } from '../components/MentionsLegales/MentionLegaleCard';
import { Modal } from '../components/UI/Modal';
import { MentionLegaleForm } from '../components/MentionsLegales/MentionLegaleForm';
import type { MentionLegale } from '../types/database.types';

export function LegalNotices() {
  const { mentions, loading, error } = useMentionsLegales();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMention, setSelectedMention] = useState<MentionLegale | undefined>();

  const handleAddClick = () => {
    setSelectedMention(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (mention: MentionLegale) => {
    setSelectedMention(mention);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMention(undefined);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-gray-500">Chargement des mentions légales...</div>
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
        <h2 className="text-2xl font-bold text-gray-900">Mentions Légales</h2>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter une mention légale
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mentions.map((mention) => (
          <MentionLegaleCard
            key={mention.id}
            mention={mention}
            onClick={() => handleEditClick(mention)}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={selectedMention ? 'Modifier la mention légale' : 'Ajouter une mention légale'}
      >
        <MentionLegaleForm
          mention={selectedMention}
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