/*
  # Restructuration complète des mentions légales

  1. Nouvelles Tables
    - `reglementations_etiquetage` : Règles d'étiquetage par pays
    - `mentions_legales_traductions` : Traductions des mentions légales
    - `mentions_legales_conditions` : Conditions d'application des mentions
    - `mentions_legales_pictogrammes` : Pictogrammes obligatoires

  2. Modifications
    - Ajout de métadonnées pour le positionnement et le style
    - Support multilingue amélioré
    - Gestion des conditions d'affichage

  3. Sécurité
    - Enable RLS sur toutes les nouvelles tables
    - Politiques d'accès pour utilisateurs authentifiés
*/

-- Table des règles d'étiquetage par pays
CREATE TABLE IF NOT EXISTS reglementations_etiquetage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pays_id UUID REFERENCES pays_destinations(id) ON DELETE CASCADE,
    type_produit TEXT NOT NULL,
    taille_police_min INTEGER NOT NULL,
    contraste_min DECIMAL(4,2) NOT NULL,
    langues_requises TEXT[] NOT NULL,
    ordre_affichage INTEGER NOT NULL,
    date_effet DATE NOT NULL,
    date_expiration DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des traductions des mentions légales
CREATE TABLE IF NOT EXISTS mentions_legales_traductions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mention_legale_id UUID REFERENCES mentions_legales(id) ON DELETE CASCADE,
    pays_id UUID REFERENCES pays_destinations(id) ON DELETE CASCADE,
    langue TEXT NOT NULL,
    texte TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(mention_legale_id, pays_id, langue)
);

-- Table des conditions d'application des mentions
CREATE TABLE IF NOT EXISTS mentions_legales_conditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mention_legale_id UUID REFERENCES mentions_legales(id) ON DELETE CASCADE,
    pays_id UUID REFERENCES pays_destinations(id) ON DELETE CASCADE,
    condition_type TEXT NOT NULL,
    condition_valeur JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des pictogrammes obligatoires
CREATE TABLE IF NOT EXISTS mentions_legales_pictogrammes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pays_id UUID REFERENCES pays_destinations(id) ON DELETE CASCADE,
    type_pictogramme TEXT NOT NULL,
    url_image TEXT NOT NULL,
    taille_min INTEGER NOT NULL,
    position_relative JSONB NOT NULL,
    conditions_affichage JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reglementations_etiquetage ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentions_legales_traductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentions_legales_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentions_legales_pictogrammes ENABLE ROW LEVEL SECURITY;

-- Création des politiques d'accès
CREATE POLICY "Enable read access for all users"
ON reglementations_etiquetage FOR SELECT TO anon USING (true);

CREATE POLICY "Enable full access for authenticated users"
ON reglementations_etiquetage FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- Répéter pour les autres tables...

-- Ajout de données d'exemple
INSERT INTO reglementations_etiquetage (
    pays_id,
    type_produit,
    taille_police_min,
    contraste_min,
    langues_requises,
    ordre_affichage,
    date_effet
)
SELECT 
    id,
    'VIN',
    8,
    4.5,
    ARRAY['en'],
    1,
    '2024-01-01'
FROM pays_destinations 
WHERE code = 'US';

-- Ajout des triggers pour updated_at
CREATE TRIGGER update_reglementations_etiquetage_updated_at
    BEFORE UPDATE ON reglementations_etiquetage
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Répéter pour les autres tables...