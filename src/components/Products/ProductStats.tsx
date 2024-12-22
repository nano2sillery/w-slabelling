import React from 'react';
import { Wine, MapPin, Beaker } from 'lucide-react';

interface ProductStatsProps {
  alcohol: number;
  origin: string;
  vintage?: boolean;
}

export function ProductStats({ alcohol, origin, vintage }: ProductStatsProps) {
  return (
    <div className="flex items-center space-x-4 text-sm text-gray-500">
      <div className="flex items-center">
        <Beaker className="h-4 w-4 mr-1" />
        <span>{alcohol}%</span>
      </div>
      <div className="flex items-center">
        <MapPin className="h-4 w-4 mr-1" />
        <span>{origin}</span>
      </div>
      {vintage && (
        <div className="flex items-center">
          <Wine className="h-4 w-4 mr-1" />
          <span>Millésimé</span>
        </div>
      )}
    </div>
  );
}