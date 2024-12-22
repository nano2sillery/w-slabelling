import React from 'react';
import { Wine } from 'lucide-react';
import Navigation from './Navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Wine className="h-8 w-8 text-purple-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">W&S Étiquetage</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Navigation />
        <main className="mt-8">
          {children}
        </main>
      </div>
    </div>
  );
}