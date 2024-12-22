/*
  # Ajout de produits LVMH supplémentaires

  1. Nouveaux Produits
    - Ajout de produits pour Veuve Clicquot
    - Ajout de produits pour Ruinart
    - Ajout de produits pour Krug
*/

DO $$ 
DECLARE 
  v_categorie_champagne UUID;
  v_qualite_brut UUID;
  v_marque_veuve UUID;
  v_marque_ruinart UUID;
  v_marque_krug UUID;
BEGIN
  -- Récupération des IDs
  SELECT id INTO v_categorie_champagne FROM categories WHERE nom = 'Champagne';
  SELECT id INTO v_qualite_brut FROM qualites WHERE nom = 'Brut Nature';
  SELECT id INTO v_marque_veuve FROM marques WHERE nom = 'Veuve Clicquot';
  SELECT id INTO v_marque_ruinart FROM marques WHERE nom = 'Ruinart';
  SELECT id INTO v_marque_krug FROM marques WHERE nom = 'Krug';

  -- Veuve Clicquot
  IF v_marque_veuve IS NOT NULL THEN
    INSERT INTO produits (
      nom,
      marque_id,
      categorie_id,
      qualite_id,
      millesime,
      pays_origine,
      pourcentage_alcool,
      contenance,
      description_courte
    ) VALUES (
      'La Grande Dame 2012',
      v_marque_veuve,
      v_categorie_champagne,
      v_qualite_brut,
      true,
      'France',
      12.5,
      '75cl',
      'Un hommage à Madame Clicquot, assemblage de grands crus uniquement'
    ),
    (
      'Yellow Label',
      v_marque_veuve,
      v_categorie_champagne,
      v_qualite_brut,
      false,
      'France',
      12,
      '75cl',
      'Le champagne signature de la maison, reconnaissable à son étiquette jaune'
    );
  END IF;

  -- Ruinart
  IF v_marque_ruinart IS NOT NULL THEN
    INSERT INTO produits (
      nom,
      marque_id,
      categorie_id,
      qualite_id,
      millesime,
      pays_origine,
      pourcentage_alcool,
      contenance,
      description_courte
    ) VALUES (
      'Dom Ruinart Blanc de Blancs 2007',
      v_marque_ruinart,
      v_categorie_champagne,
      v_qualite_brut,
      true,
      'France',
      12.5,
      '75cl',
      'La plus pure expression du Chardonnay de la Maison Ruinart'
    ),
    (
      'R de Ruinart',
      v_marque_ruinart,
      v_categorie_champagne,
      v_qualite_brut,
      false,
      'France',
      12,
      '75cl',
      'L''expression du style Ruinart, fraîcheur et élégance'
    );
  END IF;

  -- Krug
  IF v_marque_krug IS NOT NULL THEN
    INSERT INTO produits (
      nom,
      marque_id,
      categorie_id,
      qualite_id,
      millesime,
      pays_origine,
      pourcentage_alcool,
      contenance,
      description_courte
    ) VALUES (
      'Grande Cuvée 169ème Édition',
      v_marque_krug,
      v_categorie_champagne,
      v_qualite_brut,
      false,
      'France',
      12.5,
      '75cl',
      'Un assemblage unique de plus de 120 vins de dix années différentes'
    ),
    (
      'Vintage 2006',
      v_marque_krug,
      v_categorie_champagne,
      v_qualite_brut,
      true,
      'France',
      12.5,
      '75cl',
      'L''expression d''une année exceptionnelle selon Krug'
    );
  END IF;
END $$;