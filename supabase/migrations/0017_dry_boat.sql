-- Table pour les mentions légales par pays
CREATE TABLE IF NOT EXISTS mentions_legales_pays_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pays_id UUID REFERENCES pays_destinations(id) ON DELETE CASCADE,
    mention_legale_id UUID REFERENCES mentions_legales(id) ON DELETE CASCADE,
    texte TEXT NOT NULL,
    langue TEXT NOT NULL DEFAULT 'fr',
    taille_min DECIMAL(4,2),
    contraste_min DECIMAL(4,2),
    type_affichage TEXT CHECK (type_affichage IN ('texte', 'pictogramme')),
    url_pictogramme TEXT,
    position TEXT,
    style_texte JSONB,
    obligatoire BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(pays_id, mention_legale_id)
);

-- Enable RLS
ALTER TABLE mentions_legales_pays_config ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users"
ON mentions_legales_pays_config FOR SELECT
TO anon
USING (true);

CREATE POLICY "Enable full access for authenticated users"
ON mentions_legales_pays_config FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_mentions_legales_pays_config_updated_at
    BEFORE UPDATE ON mentions_legales_pays_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();