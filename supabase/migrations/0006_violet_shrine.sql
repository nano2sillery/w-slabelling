/*
  # Ajout des données LVMH Vins & Spiritueux

  1. Nouvelles données
    - Marques LVMH (Moët & Chandon, Dom Pérignon, Veuve Clicquot, etc.)
    - Produits emblématiques pour chaque marque
    
  2. Structure
    - Utilisation de DO $$ pour gérer les références
    - Gestion des conflits avec ON CONFLICT
    - Insertion sécurisée avec vérification des IDs
*/

-- Insertion des marques LVMH
INSERT INTO marques (nom, description) VALUES
  ('Moët & Chandon', 'Maison de champagne fondée en 1743, symbole du luxe et de la célébration'),
  ('Dom Pérignon', 'Champagne de prestige créé par Moët & Chandon, incarnation de l''excellence'),
  ('Veuve Clicquot', 'Maison fondée en 1772, célèbre pour son innovation et sa qualité exceptionnelle'),
  ('Ruinart', 'Plus ancienne maison de champagne, fondée en 1729'),
  ('Krug', 'Maison fondée en 1843, synonyme de prestige et d''excellence'),
  ('Château d''Yquem', 'Premier Cru Supérieur exceptionnel de Sauternes depuis 1855'),
  ('Château Cheval Blanc', 'Premier Grand Cru Classé A de Saint-Émilion'),
  ('Hennessy', 'Leader mondial du cognac depuis 1765')
ON CONFLICT ON CONSTRAINT marques_nom_key DO NOTHING;

-- Insertion des produits LVMH
DO $$ 
DECLARE 
  v_categorie_champagne UUID;
  v_categorie_blanc UUID;
  v_categorie_rouge UUID;
  v_qualite_brut UUID;
  v_qualite_sec UUID;
  v_marque_moet UUID;
  v_marque_dom UUID;
  v_marque_veuve UUID;
  v_marque_ruinart UUID;
  v_marque_krug UUID;
  v_marque_yquem UUID;
  v_marque_cheval UUID;
BEGIN
  -- Récupération des IDs des catégories
  SELECT id INTO v_categorie_champagne FROM categories WHERE nom = 'Champagne';
  SELECT id INTO v_categorie_blanc FROM categories WHERE nom = 'Vin Blanc';
  SELECT id INTO v_categorie_rouge FROM categories WHERE nom = 'Vin Rouge';
  
  -- Récupération des IDs des qualités
  SELECT id INTO v_qualite_brut FROM qualites WHERE nom = 'Brut Nature';
  SELECT id INTO v_qualite_sec FROM qualites WHERE nom = 'Sec';
  
  -- Récupération des IDs des marques
  SELECT id INTO v_marque_moet FROM marques WHERE nom = 'Moët & Chandon';
  SELECT id INTO v_marque_dom FROM marques WHERE nom = 'Dom Pérignon';
  SELECT id INTO v_marque_veuve FROM marques WHERE nom = 'Veuve Clicquot';
  SELECT id INTO v_marque_ruinart FROM marques WHERE nom = 'Ruinart';
  SELECT id INTO v_marque_krug FROM marques WHERE nom = 'Krug';
  SELECT id INTO v_marque_yquem FROM marques WHERE nom = 'Château d''Yquem';
  SELECT id INTO v_marque_cheval FROM marques WHERE nom = 'Château Cheval Blanc';

  -- Insertion des produits Moët & Chandon
  IF v_marque_moet IS NOT NULL AND v_categorie_champagne IS NOT NULL AND v_qualite_brut IS NOT NULL THEN
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
      'Impérial Brut',
      v_marque_moet,
      v_categorie_champagne,
      v_qualite_brut,
      false,
      'France',
      12,
      '75cl',
      'Le champagne emblématique de la Maison, créé en 1869'
    );
  END IF;

  -- Insertion des produits Dom Pérignon
  IF v_marque_dom IS NOT NULL AND v_categorie_champagne IS NOT NULL AND v_qualite_brut IS NOT NULL THEN
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
      'Vintage 2012',
      v_marque_dom,
      v_categorie_champagne,
      v_qualite_brut,
      true,
      'France',
      12.5,
      '75cl',
      'Un millésime d''exception, expression parfaite du style Dom Pérignon'
    );
  END IF;

  -- Insertion des produits Château d''Yquem
  IF v_marque_yquem IS NOT NULL AND v_categorie_blanc IS NOT NULL AND v_qualite_sec IS NOT NULL THEN
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
      'Sauternes 2015',
      v_marque_yquem,
      v_categorie_blanc,
      v_qualite_sec,
      true,
      'France',
      14,
      '75cl',
      'Le plus prestigieux des vins liquoreux, un millésime exceptionnel'
    );
  END IF;

  -- Insertion des produits Château Cheval Blanc
  IF v_marque_cheval IS NOT NULL AND v_categorie_rouge IS NOT NULL AND v_qualite_sec IS NOT NULL THEN
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
      'Saint-Émilion Grand Cru 2016',
      v_marque_cheval,
      v_categorie_rouge,
      v_qualite_sec,
      true,
      'France',
      14,
      '75cl',
      'Un grand cru d''exception, alliance parfaite de puissance et d''élégance'
    );
  END IF;
END $$;