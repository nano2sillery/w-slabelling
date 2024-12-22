import React from 'react';
import { Link } from 'react-router-dom';
import { Wine, Scale, Tag, Building2 } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useMarques } from '../hooks/useMarques';
import { StatCard } from '../components/Dashboard/StatCard';

export function Dashboard() {
  const { products } = useProducts();
  const { categories } = useCategories();
  const { marques } = useMarques();

  const stats = [
    {
      title: 'Produits',
      value: products.length,
      icon: Wine,
      href: '/produits',
      description: 'Nombre total de produits dans le catalogue'
    },
    {
      title: 'Marques',
      value: marques.length,
      icon: Building2,
      href: '/marques',
      description: 'Marques partenaires'
    },
    {
      title: 'Catégories',
      value: categories.length,
      icon: Tag,
      href: '/categories',
      description: 'Types de produits'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h2>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <Link key={stat.title} to={stat.href}>
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={stat.description}
            />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Ici nous pourrions ajouter des graphiques ou des statistiques plus détaillées */}
      </div>
    </div>
  );
}