import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Categories } from './pages/Categories';
import { Marques } from './pages/Marques';
import { Qualites } from './pages/Qualites';
import { LegalNotices } from './pages/LegalNotices';
import { Etiquettes } from './pages/Etiquettes';
import { Pays } from './pages/Pays';
import { PaysDetails } from './pages/PaysDetails';

export default function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/produits" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/marques" element={<Marques />} />
          <Route path="/qualites" element={<Qualites />} />
          <Route path="/mentions-legales" element={<LegalNotices />} />
          <Route path="/etiquettes" element={<Etiquettes />} />
          <Route path="/pays" element={<Pays />} />
          <Route path="/pays/:id" element={<PaysDetails />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}