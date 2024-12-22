/*
  # Relations marques et catégories de produits

  1. Nouvelles Tables
    - `marques_categories`: Relation many-to-many entre marques et catégories
    - `marques_qualites`: Qualités spécifiques par marque
    
  2. Modifications
    - Ajout des tables de liaison avec leurs contraintes
    - Ajout des politiques de sécurité
    - Ajout des triggers pour updated_at
    
  3. Données
    - Migration des données existantes
*/

-- Table de liaison entre marques et catégories
CREATE TABLE IF NOT EXISTS marques_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    marque_id UUID REFERENCES marques(id) ON DELETE CASCADE,
    categorie_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    actif BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(marque_id, categorie_id)
);

-- Table des qualités spécifiques par marque
CREATE TABLE IF NOT EXISTS marques_qualites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    marque_id UUID REFERENCES marques(id) ON DELETE CASCADE,
    qualite_id UUID REFERENCES qualites(id) ON DELETE CASCADE,
    categorie_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    specifications JSONB,
    actif BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(marque_id, qualite_id, categorie_id)
);

-- Enable RLS
ALTER TABLE marques_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE marques_qualites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users"
ON marques_categories FOR SELECT
TO anon
USING (true);

CREATE POLICY "Enable full access for authenticated users"
ON marques_categories FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable read access for all users"
ON marques_qualites FOR SELECT
TO anon
USING (true);

CREATE POLICY "Enable full access for authenticated users"
ON marques_qualites FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create triggers
CREATE TRIGGER update_marques_categories_updated_at
    BEFORE UPDATE ON marques_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marques_qualites_updated_at
    BEFORE UPDATE ON marques_qualites
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Migration des données existantes
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Pour chaque produit existant, créer les relations marque-catégorie si elles n'existent pas
    FOR r IN SELECT DISTINCT marque_id, categorie_id FROM produits WHERE marque_id IS NOT NULL AND categorie_id IS NOT NULL
    LOOP
        INSERT INTO marques_categories (marque_id, categorie_id)
        VALUES (r.marque_id, r.categorie_id)
        ON CONFLICT (marque_id, categorie_id) DO NOTHING;
    END LOOP;

    -- Pour chaque produit existant, créer les relations marque-qualité si elles n'existent pas
    FOR r IN SELECT DISTINCT marque_id, qualite_id, categorie_id 
             FROM produits 
             WHERE marque_id IS NOT NULL AND qualite_id IS NOT NULL AND categorie_id IS NOT NULL
    LOOP
        INSERT INTO marques_qualites (marque_id, qualite_id, categorie_id)
        VALUES (r.marque_id, r.qualite_id, r.categorie_id)
        ON CONFLICT (marque_id, qualite_id, categorie_id) DO NOTHING;
    END LOOP;
END $$;