import React from 'react';
import { FileText, AlertTriangle } from 'lucide-react';
import type { MentionLegale } from '../../types/database.types';

interface MentionLegaleCardProps {
  mention: MentionLegale;
  onClick?: () => void;
}

export function MentionLegaleCard({ mention, onClick }: MentionLegaleCardProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <FileText className="h-5 w-5 text-purple-600 mt-1" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">{mention.type}</h3>
            {mention.obligatoire && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Obligatoire
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">{mention.texte_generique}</p>
          
          <dl className="mt-2 text-xs text-gray-500 grid grid-cols-2 gap-2">
            <div>
              <dt className="inline font-medium">Catégorie:</dt>
              <dd className="inline ml-1">{mention.categorie}</dd>
            </div>
            <div>
              <dt className="inline font-medium">Champ visuel:</dt>
              <dd className="inline ml-1">{mention.champ_visuel}</dd>
            </div>
            <div>
              <dt className="inline font-medium">Taille min:</dt>
              <dd className="inline ml-1">{mention.taille_min}mm</dd>
            </div>
            <div>
              <dt className="inline font-medium">Contraste min:</dt>
              <dd className="inline ml-1">{mention.contraste_min}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}