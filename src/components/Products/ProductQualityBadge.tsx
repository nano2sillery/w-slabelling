import React from 'react';

interface ProductQualityBadgeProps {
  qualityName: string;
  sugarLevel?: number | null;
  acidity?: number | null;
}

export function ProductQualityBadge({ qualityName, sugarLevel, acidity }: ProductQualityBadgeProps) {
  return (
    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
      <span>{qualityName}</span>
      {(sugarLevel || acidity) && (
        <div className="ml-1 text-purple-600">
          {sugarLevel && `${sugarLevel}g/L`}
          {sugarLevel && acidity && ' - '}
          {acidity && `${acidity}g/L H2T`}
        </div>
      )}
    </div>
  );
}