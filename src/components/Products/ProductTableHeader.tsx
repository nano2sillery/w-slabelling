import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface ProductTableHeaderProps {
  onSort: (field: string) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

export function ProductTableHeader({ onSort, sortField, sortDirection }: ProductTableHeaderProps) {
  const SortHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <ArrowUpDown className={`h-4 w-4 ${sortField === field ? 'text-purple-600' : 'text-gray-400'}`} />
      </div>
    </th>
  );

  return (
    <thead className="bg-gray-50">
      <tr>
        <SortHeader field="nom">Produit</SortHeader>
        <SortHeader field="marque">Marque</SortHeader>
        <SortHeader field="categorie">Catégorie</SortHeader>
        <SortHeader field="qualite">Qualité</SortHeader>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
  );
}