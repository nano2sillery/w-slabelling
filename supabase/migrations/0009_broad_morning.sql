/*
  # Enrichissement des données LVMH

  1. Nouveaux Produits
    - Ajout de produits Hennessy
    - Ajout de produits supplémentaires Moët & Chandon
    - Mise à jour des descriptions des marques existantes
*/

-- Mise à jour des descriptions des marques avec plus de détails
UPDATE marques 
SET description = 'Fondée en 1743, Moët & Chandon est la plus grande maison de champagne au monde. Symbole du succès et de l''élégance, elle incarne l''art de la célébration depuis près de trois siècles.'
WHERE nom = 'Moët & Chandon';

UPDATE marques 
SET description = 'Créée en 1668, Dom Pérignon représente l''apogée de l''art du champagne. Chaque millésime est unique, produit uniquement les années exceptionnelles avec les meilleurs raisins.'
WHERE nom = 'Dom Pérignon';

-- Ajout de produits Hennessy
DO $$ 
DECLARE 
  v_marque_hennessy UUID;
  v_marque_moet UUID;
BEGIN
  -- Récupération des IDs
  SELECT id INTO v_marque_hennessy FROM marques WHERE nom = 'Hennessy';
  SELECT id INTO v_marque_moet FROM marques WHERE nom = 'Moët & Chandon';

  -- Produits Hennessy
  IF v_marque_hennessy IS NOT NULL THEN
    INSERT INTO produits (
      nom,
      marque_id,
      pays_origine,
      pourcentage_alcool,
      contenance,
      description_courte,
      description_moyenne
    ) VALUES 
    (
      'Hennessy X.O',
      v_marque_hennessy,
      'France',
      40,
      '70cl',
      'Le premier X.O jamais créé, depuis 1870',
      'Un cognac d''exception aux arômes riches et complexes. Notes de fruits confits, de chocolat et d''épices.'
    ),
    (
      'Hennessy Paradis',
      v_marque_hennessy,
      'France',
      40,
      '70cl',
      'Un assemblage des eaux-de-vie les plus rares',
      'Élégance et raffinement absolus. Notes florales, de miel et d''épices douces.'
    ),
    (
      'Richard Hennessy',
      v_marque_hennessy,
      'France',
      40,
      '70cl',
      'L''ultime expression du savoir-faire Hennessy',
      'Assemblage des eaux-de-vie les plus précieuses, certaines centenaires. Un cognac d''une complexité incomparable.'
    );
  END IF;

  -- Produits supplémentaires Moët & Chandon
  IF v_marque_moet IS NOT NULL THEN
    INSERT INTO produits (
      nom,
      marque_id,
      categorie_id,
      qualite_id,
      millesime,
      pays_origine,
      pourcentage_alcool,
      contenance,
      description_courte,
      description_moyenne
    ) 
    SELECT 
      'Nectar Impérial Rosé',
      v_marque_moet,
      c.id,
      q.id,
      false,
      'France',
      12,
      '75cl',
      'L''expression la plus gourmande de Moët & Chandon',
      'Un champagne rosé intense et fruité, avec des notes de fruits rouges et une finale épicée.'
    FROM categories c, qualites q
    WHERE c.nom = 'Champagne' AND q.nom = 'Demi-sec'
    LIMIT 1;
  END IF;
END $$;