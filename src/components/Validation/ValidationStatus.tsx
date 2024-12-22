import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';
import type { ValidationResult } from '../../utils/validationReglementaire';

interface ValidationStatusProps {
  validation: ValidationResult;
}

export function ValidationStatus({ validation }: ValidationStatusProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        {validation.isValid ? (
          <CheckCircle className="h-6 w-6 text-green-500" />
        ) : (
          <XCircle className="h-6 w-6 text-red-500" />
        )}
        <span className={`font-medium ${validation.isValid ? 'text-green-700' : 'text-red-700'}`}>
          {validation.isValid ? 'Produit conforme' : 'Produit non conforme'}
        </span>
      </div>

      {validation.errors.length > 0 && (
        <div className="bg-red-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-red-800 mb-2">Erreurs à corriger :</h4>
          <ul className="text-sm text-red-700 list-disc list-inside">
            {validation.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Points d'attention :</h4>
          <ul className="text-sm text-yellow-700 list-disc list-inside">
            {validation.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex items-center space-x-2 mb-2">
          <FileText className="h-5 w-5 text-gray-600" />
          <h4 className="text-sm font-medium text-gray-800">Documents requis :</h4>
        </div>
        <ul className="text-sm text-gray-600 list-disc list-inside">
          {validation.documentsRequis.map((doc, index) => (
            <li key={index}>{doc}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}