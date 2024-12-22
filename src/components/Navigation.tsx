import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wine, Scale } from 'lucide-react';

const Navigation = () => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Wine },
    { name: 'Legal Notices', href: '/legal-notices', icon: Scale },
  ];

  return (
    <nav className="flex space-x-4">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <Icon className="h-5 w-5 mr-2" />
            {item.name}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default Navigation;