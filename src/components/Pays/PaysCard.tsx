import React from 'react';
import { Globe, AlertTriangle } from 'lucide-react';
import type { PaysDestination } from '../../types/reglementation.types';

interface PaysCardProps {
  pays: PaysDestination;
  onClick: () => void;
}

export function PaysCard({ pays, onClick }: PaysCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start space-x-3">
        <Globe className="h-5 w-5 text-purple-600 mt-1" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">{pays.nom}</h3>
            <span className="text-sm text-gray-500">{pays.code}</span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{pays.zone_douaniere}</p>
          {pays.restrictions_generales && (
            <div className="mt-2 flex items-start space-x-2 text-sm text-red-600">
              <AlertTriangle className="h-4 w-4 mt-0.5" />
              <p>{pays.restrictions_generales}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}