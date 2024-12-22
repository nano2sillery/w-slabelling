/*
  # Ajout des attributs pour les mentions légales par pays

  1. Nouvelles Tables
    - `mentions_legales_attributs` : Attributs possibles pour les mentions légales
    - `mentions_legales_pays` : Mentions légales spécifiques par pays
    - `mentions_legales_valeurs` : Valeurs des attributs pour chaque mention légale

  2. Modifications
    - Ajout de champs pour le positionnement et le style des mentions
    - Support multilingue pour les mentions légales

  3. Sécurité
    - Enable RLS sur toutes les nouvelles tables
    - Politiques d'accès pour utilisateurs authentifiés
*/

-- Table des attributs possibles pour les mentions légales
CREATE TABLE IF NOT EXISTS mentions_legales_attributs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('texte', 'nombre', 'booleen', 'liste')),
    description TEXT,
    valeurs_possibles TEXT[], -- Pour les attributs de type 'liste'
    obligatoire BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(nom)
);

-- Table des mentions légales spécifiques par pays
CREATE TABLE IF NOT EXISTS mentions_legales_pays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mention_legale_id UUID REFERENCES mentions_legales(id) ON DELETE CASCADE,
    pays_id UUID REFERENCES pays_destinations(id) ON DELETE CASCADE,
    texte TEXT NOT NULL,
    langue TEXT NOT NULL DEFAULT 'fr',
    position_x INTEGER,
    position_y INTEGER,
    taille_police INTEGER,
    couleur TEXT,
    police TEXT,
    style TEXT[], -- ['gras', 'italique', 'souligne']
    obligatoire BOOLEAN DEFAULT true,
    conditions_affichage JSONB, -- Conditions spécifiques d'affichage
    date_effet DATE,
    date_expiration DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(mention_legale_id, pays_id, langue)
);

-- Table des valeurs des attributs pour chaque mention légale
CREATE TABLE IF NOT EXISTS mentions_legales_valeurs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mention_legale_pays_id UUID REFERENCES mentions_legales_pays(id) ON DELETE CASCADE,
    attribut_id UUID REFERENCES mentions_legales_attributs(id) ON DELETE CASCADE,
    valeur TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(mention_legale_pays_id, attribut_id)
);

-- Enable RLS
ALTER TABLE mentions_legales_attributs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentions_legales_pays ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentions_legales_valeurs ENABLE ROW LEVEL SECURITY;

-- Création des politiques d'accès
CREATE POLICY "Enable read access for all users"
ON mentions_legales_attributs FOR SELECT
TO anon
USING (true);

CREATE POLICY "Enable full access for authenticated users"
ON mentions_legales_attributs FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable read access for all users"
ON mentions_legales_pays FOR SELECT
TO anon
USING (true);

CREATE POLICY "Enable full access for authenticated users"
ON mentions_legales_pays FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable read access for all users"
ON mentions_legales_valeurs FOR SELECT
TO anon
USING (true);

CREATE POLICY "Enable full access for authenticated users"
ON mentions_legales_valeurs FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Création des triggers pour updated_at
CREATE TRIGGER update_mentions_legales_attributs_updated_at
    BEFORE UPDATE ON mentions_legales_attributs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentions_legales_pays_updated_at
    BEFORE UPDATE ON mentions_legales_pays
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentions_legales_valeurs_updated_at
    BEFORE UPDATE ON mentions_legales_valeurs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertion des attributs de base
INSERT INTO mentions_legales_attributs (nom, type, description, obligatoire) VALUES
('taille_minimale', 'nombre', 'Taille minimale du texte en points', true),
('contraste_minimal', 'nombre', 'Ratio de contraste minimal avec le fond', true),
('pictogramme_requis', 'booleen', 'Nécessite un pictogramme spécifique', false),
('format_date', 'texte', 'Format de date requis pour les dates de péremption', false),
('symboles_obligatoires', 'liste', 'Symboles qui doivent apparaître', false),
('position_relative', 'texte', 'Position relative par rapport aux autres mentions', false);

-- Insertion des mentions légales spécifiques pour les USA
INSERT INTO mentions_legales_pays (
    mention_legale_id,
    pays_id,
    texte,
    langue,
    taille_police,
    obligatoire,
    conditions_affichage
)
SELECT 
    ml.id,
    pd.id,
    CASE ml.type
        WHEN 'Allergènes' THEN 'CONTAINS SULFITES'
        WHEN 'Consommation responsable' THEN 'GOVERNMENT WARNING: According to the Surgeon General, women should not drink alcoholic beverages during pregnancy because of the risk of birth defects.'
    END,
    'en',
    8,
    true,
    '{"placement": "back_label", "min_contrast_ratio": 4.5}'::jsonb
FROM mentions_legales ml
CROSS JOIN pays_destinations pd
WHERE pd.code = 'US'
AND ml.type IN ('Allergènes', 'Consommation responsable');