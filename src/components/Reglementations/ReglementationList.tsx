import React from 'react';
import { FileText, AlertTriangle } from 'lucide-react';
import type { ReglementationPays } from '../../types/reglementation.types';

interface ReglementationListProps {
  reglementations: ReglementationPays[];
  onEdit: (reglementation: ReglementationPays) => void;
}

export function ReglementationList({ reglementations, onEdit }: ReglementationListProps) {
  return (
    <div className="space-y-4">
      {reglementations.map((reglementation) => (
        <div
          key={reglementation.id}
          onClick={() => onEdit(reglementation)}
          className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-purple-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{reglementation.type_reglementation}</h3>
              <p className="mt-1 text-sm text-gray-500">{reglementation.description}</p>
              
              {reglementation.documents_requis.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Documents requis :</h4>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    {reglementation.documents_requis.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {reglementations.length === 0 && (
        <div className="text-center py-6">
          <AlertTriangle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
          <p className="text-gray-500">Aucune réglementation définie pour ce pays.</p>
        </div>
      )}
    </div>
  );
}