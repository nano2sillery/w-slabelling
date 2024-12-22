import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wine, Scale, Building2, Tag, Award, Printer, Globe } from 'lucide-react';

const navigation = [
  { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
  { name: 'Produits', href: '/produits', icon: Wine },
  { name: 'Marques', href: '/marques', icon: Building2 },
  { name: 'Catégories', href: '/categories', icon: Tag },
  { name: 'Qualités', href: '/qualites', icon: Award },
  { name: 'Mentions légales', href: '/mentions-legales', icon: Scale },
  { name: 'Pays', href: '/pays', icon: Globe },
  { name: 'Étiquettes', href: '/etiquettes', icon: Printer },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="flex flex-wrap gap-2">
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon className="h-5 w-5 mr-2" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}