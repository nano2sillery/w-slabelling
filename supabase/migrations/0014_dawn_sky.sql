/*
  # Amélioration de la gestion des mentions légales

  1. Nouvelles Tables
    - `mentions_legales_types` pour catégoriser les mentions
    - `mentions_legales_regles` pour les règles d'affichage
    - `mentions_legales_produits` pour les mentions spécifiques par produit

  2. Modifications
    - Ajout de champs pour la gestion des attributs
    - Support des règles d'affichage par pays
*/

-- Table pour les types de mentions légales
CREATE TABLE IF NOT EXISTS mentions_legales_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    nom TEXT NOT NULL,
    description TEXT,
    categorie TEXT NOT NULL CHECK (categorie IN (
        'generale',
        'vin',
        'spiritueux',
        'nutritionnelle',
        'reglementaire'
    )),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table pour les règles d'affichage des mentions
CREATE TABLE IF NOT EXISTS mentions_legales_regles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mention_type_id UUID REFERENCES mentions_legales_types(id),
    pays_id UUID REFERENCES pays_destinations(id),
    champ_visuel TEXT NOT NULL,
    taille_min DECIMAL(4,2),
    tolerance DECIMAL(4,2),
    position_relative JSONB,
    style_texte JSONB,
    conditions_affichage JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(mention_type_id, pays_id)
);

-- Table pour les mentions spécifiques par produit
CREATE TABLE IF NOT EXISTS mentions_legales_produits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produit_id UUID REFERENCES produits(id),
    mention_type_id UUID REFERENCES mentions_legales_types(id),
    pays_id UUID REFERENCES pays_destinations(id),
    texte TEXT NOT NULL,
    attributs JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(produit_id, mention_type_id, pays_id)
);

-- Enable RLS
ALTER TABLE mentions_legales_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentions_legales_regles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentions_legales_produits ENABLE ROW LEVEL SECURITY;

-- Création des politiques d'accès
DO $$ 
BEGIN
    -- Politiques pour mentions_legales_types
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'mentions_legales_types' 
        AND policyname = 'Enable read access for all users'
    ) THEN
        CREATE POLICY "Enable read access for all users"
        ON mentions_legales_types FOR SELECT
        TO anon
        USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'mentions_legales_types' 
        AND policyname = 'Enable full access for authenticated users'
    ) THEN
        CREATE POLICY "Enable full access for authenticated users"
        ON mentions_legales_types FOR ALL
        TO authenticated
        USING (true)
        WITH CHECK (true);
    END IF;

    -- Politiques pour mentions_legales_regles
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'mentions_legales_regles' 
        AND policyname = 'Enable read access for all users'
    ) THEN
        CREATE POLICY "Enable read access for all users"
        ON mentions_legales_regles FOR SELECT
        TO anon
        USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'mentions_legales_regles' 
        AND policyname = 'Enable full access for authenticated users'
    ) THEN
        CREATE POLICY "Enable full access for authenticated users"
        ON mentions_legales_regles FOR ALL
        TO authenticated
        USING (true)
        WITH CHECK (true);
    END IF;

    -- Politiques pour mentions_legales_produits
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'mentions_legales_produits' 
        AND policyname = 'Enable read access for all users'
    ) THEN
        CREATE POLICY "Enable read access for all users"
        ON mentions_legales_produits FOR SELECT
        TO anon
        USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'mentions_legales_produits' 
        AND policyname = 'Enable full access for authenticated users'
    ) THEN
        CREATE POLICY "Enable full access for authenticated users"
        ON mentions_legales_produits FOR ALL
        TO authenticated
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

-- Création des triggers pour updated_at
DO $$ 
BEGIN
    -- Trigger pour mentions_legales_types
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_mentions_legales_types_updated_at'
    ) THEN
        CREATE TRIGGER update_mentions_legales_types_updated_at
            BEFORE UPDATE ON mentions_legales_types
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Trigger pour mentions_legales_regles
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_mentions_legales_regles_updated_at'
    ) THEN
        CREATE TRIGGER update_mentions_legales_regles_updated_at
            BEFORE UPDATE ON mentions_legales_regles
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Trigger pour mentions_legales_produits
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_mentions_legales_produits_updated_at'
    ) THEN
        CREATE TRIGGER update_mentions_legales_produits_updated_at
            BEFORE UPDATE ON mentions_legales_produits
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Insertion des types de mentions légales
INSERT INTO mentions_legales_types (code, nom, description, categorie) VALUES
('denomination', 'Dénomination du Produit', 'Nom du produit incluant le mot "vin" pour les produits vinicoles', 'generale'),
('alcool', 'Titre Alcoométrique', 'Pourcentage d''alcool par volume avec tolérance spécifique', 'generale'),
('origine', 'Pays d''Origine', 'Indication du pays de fabrication', 'generale'),
('allergenes', 'Mention des Allergènes', 'Indication des substances allergènes', 'generale'),
('appellation', 'Appellation d''Origine', 'Mention obligatoire pour les vins AOC/IGP', 'vin'),
('message_sante', 'Message Sanitaire', 'Message de consommation responsable', 'reglementaire'),
('ingredients', 'Liste des Ingrédients', 'Liste complète des ingrédients utilisés', 'nutritionnelle'),
('valeurs_nutritives', 'Informations Nutritionnelles', 'Informations sur la valeur nutritionnelle', 'nutritionnelle')
ON CONFLICT (code) DO NOTHING;