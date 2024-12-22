import React from 'react';

interface ProductDescriptionProps {
  short?: string | null;
  medium?: string | null;
  long?: string | null;
}

export function ProductDescription({ short, medium, long }: ProductDescriptionProps) {
  if (!short && !medium && !long) return null;

  return (
    <div className="mt-2 space-y-1">
      {short && (
        <p className="text-sm text-gray-600">{short}</p>
      )}
      {medium && (
        <details className="text-sm">
          <summary className="text-purple-600 cursor-pointer">Plus de détails</summary>
          <p className="mt-2 text-gray-600">{medium}</p>
        </details>
      )}
      {long && (
        <details className="text-sm">
          <summary className="text-purple-600 cursor-pointer">Description complète</summary>
          <p className="mt-2 text-gray-600">{long}</p>
        </details>
      )}
    </div>
  );
}