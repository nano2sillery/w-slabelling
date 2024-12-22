-- Add unique constraints
ALTER TABLE categories ADD CONSTRAINT categories_nom_key UNIQUE (nom);
ALTER TABLE qualites ADD CONSTRAINT qualites_nom_key UNIQUE (nom);
ALTER TABLE mentions_legales ADD CONSTRAINT mentions_legales_type_key UNIQUE (type);
ALTER TABLE marques ADD CONSTRAINT marques_nom_key UNIQUE (nom);

-- Insertion des catégories de base
INSERT INTO categories (nom) VALUES
  ('Vin Rouge'),
  ('Vin Blanc'),
  ('Vin Rosé'),
  ('Champagne'),
  ('Vin Mousseux'),
  ('Vin Doux Naturel')
ON CONFLICT ON CONSTRAINT categories_nom_key DO NOTHING;

-- Insertion des qualités standards
INSERT INTO qualites (nom, taux_sucre_residuel, acidite_totale, ph) VALUES
  ('Sec', 4.0, 3.5, 3.3),
  ('Demi-sec', 12.0, 3.3, 3.4),
  ('Moelleux', 45.0, 3.2, 3.5),
  ('Doux', 45.0, 3.0, 3.6),
  ('Brut Nature', 3.0, 3.8, 3.1),
  ('Extra Brut', 6.0, 3.7, 3.2)
ON CONFLICT ON CONSTRAINT qualites_nom_key DO NOTHING;

-- Insertion des mentions légales standards
INSERT INTO mentions_legales (type, texte_generique) VALUES
  ('Allergènes', 'Contient des sulfites'),
  ('Conservation', 'À conserver dans un endroit frais et sec, à l''abri de la lumière'),
  ('Consommation responsable', 'L''abus d''alcool est dangereux pour la santé. À consommer avec modération'),
  ('Femmes enceintes', 'La consommation de boissons alcoolisées pendant la grossesse, même en faible quantité, peut avoir des conséquences graves sur la santé de l''enfant'),
  ('Recyclage', 'Pensez au tri ! Cette bouteille en verre est recyclable')
ON CONFLICT ON CONSTRAINT mentions_legales_type_key DO NOTHING;

-- Insertion des marques exemple
INSERT INTO marques (nom, description) VALUES
  ('Château Example', 'Domaine viticole traditionnel situé dans le Bordelais'),
  ('Domaine Test', 'Producteur de vins biologiques de la vallée du Rhône'),
  ('Maison Démo', 'Maison de champagne familiale depuis 1850')
ON CONFLICT ON CONSTRAINT marques_nom_key DO NOTHING;

-- Insertion de quelques produits exemple
DO $$ 
DECLARE 
  v_marque_id UUID;
  v_categorie_id UUID;
  v_qualite_id UUID;
BEGIN
  -- Get IDs
  SELECT id INTO v_marque_id FROM marques WHERE nom = 'Château Example';
  SELECT id INTO v_categorie_id FROM categories WHERE nom = 'Vin Rouge';
  SELECT id INTO v_qualite_id FROM qualites WHERE nom = 'Sec';
  
  -- Insert product if IDs exist
  IF v_marque_id IS NOT NULL AND v_categorie_id IS NOT NULL AND v_qualite_id IS NOT NULL THEN
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
      'Grande Réserve',
      v_marque_id,
      v_categorie_id,
      v_qualite_id,
      true,
      'France',
      13.5,
      '75cl',
      'Un vin rouge d''exception aux arômes complexes'
    );
  END IF;
END $$;