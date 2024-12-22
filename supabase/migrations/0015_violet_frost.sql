/*
  # Amélioration de la gestion des mentions légales

  1. Tables
    - `mentions_legales_categories` : Catégories de mentions (générales, vins, etc.)
    - `mentions_legales_exigences` : Exigences spécifiques par type et pays
    - `mentions_legales_positions` : Règles de positionnement
    - `mentions_legales_styles` : Règles de style et formatage

  2. Modifications
    - Support des tolérances et exigences par pays
    - Gestion des champs visuels et positions
    - Règles de style et formatage
*/

-- Table pour les catégories de mentions légales
CREATE TABLE IF NOT EXISTS mentions_legales_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    nom TEXT NOT NULL,
    description TEXT,
    ordre_affichage INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table pour les exigences spécifiques
CREATE TABLE IF NOT EXISTS mentions_legales_exigences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mention_type_id UUID REFERENCES mentions_legales_types(id),
    pays_id UUID REFERENCES pays_destinations(id),
    taille_min_mm DECIMAL(4,2) NOT NULL,
    contraste_min DECIMAL(4,2),
    tolerance_valeur DECIMAL(4,2),
    champ_visuel TEXT NOT NULL,
    obligatoire BOOLEAN DEFAULT true,
    conditions_specifiques JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(mention_type_id, pays_id)
);

-- Table pour les positions des mentions
CREATE TABLE IF NOT EXISTS mentions_legales_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mention_type_id UUID REFERENCES mentions_legales_types(id),
    pays_id UUID REFERENCES pays_destinations(id),
    zone_etiquette TEXT NOT NULL,
    position_relative JSONB,
    distance_min_mm DECIMAL(4,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table pour les styles de mentions
CREATE TABLE IF NOT EXISTS mentions_legales_styles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mention_type_id UUID REFERENCES mentions_legales_types(id),
    pays_id UUID REFERENCES pays_destinations(id),
    police_caractere TEXT,
    style_texte TEXT[],
    couleur TEXT,
    fond_contraste BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE mentions_legales_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentions_legales_exigences ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentions_legales_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentions_legales_styles ENABLE ROW LEVEL SECURITY;

-- Create policies for mentions_legales_categories
CREATE POLICY "Enable read access for all users" ON mentions_legales_categories
    FOR SELECT TO anon USING (true);

CREATE POLICY "Enable full access for authenticated users" ON mentions_legales_categories
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create policies for mentions_legales_exigences
CREATE POLICY "Enable read access for all users" ON mentions_legales_exigences
    FOR SELECT TO anon USING (true);

CREATE POLICY "Enable full access for authenticated users" ON mentions_legales_exigences
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create policies for mentions_legales_positions
CREATE POLICY "Enable read access for all users" ON mentions_legales_positions
    FOR SELECT TO anon USING (true);

CREATE POLICY "Enable full access for authenticated users" ON mentions_legales_positions
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create policies for mentions_legales_styles
CREATE POLICY "Enable read access for all users" ON mentions_legales_styles
    FOR SELECT TO anon USING (true);

CREATE POLICY "Enable full access for authenticated users" ON mentions_legales_styles
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create triggers for updated_at columns
CREATE TRIGGER update_mentions_legales_categories_updated_at
    BEFORE UPDATE ON mentions_legales_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentions_legales_exigences_updated_at
    BEFORE UPDATE ON mentions_legales_exigences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentions_legales_positions_updated_at
    BEFORE UPDATE ON mentions_legales_positions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentions_legales_styles_updated_at
    BEFORE UPDATE ON mentions_legales_styles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert base categories
INSERT INTO mentions_legales_categories (code, nom, description, ordre_affichage) VALUES
('obligatoire_generale', 'Mentions Obligatoires Générales', 'Mentions devant figurer dans le même champ visuel', 1),
('specifique_vin', 'Mentions Spécifiques Vins', 'Mentions obligatoires pour les vins', 2),
('specifique_spiritueux', 'Mentions Spécifiques Spiritueux', 'Mentions obligatoires pour les spiritueux', 3),
('nutritionnelle', 'Mentions Nutritionnelles', 'Informations sur les ingrédients et valeurs nutritionnelles', 4),
('reglementaire', 'Exigences Réglementaires', 'Mentions exigées par la réglementation', 5)
ON CONFLICT (code) DO NOTHING;