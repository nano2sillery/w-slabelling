/*
  # Ajout des pays de destination et leurs réglementations

  1. Nouvelles Tables
    - `pays_destinations` : Liste des pays de destination
    - `reglementations_pays` : Réglementations spécifiques par pays
    - `produits_pays` : Table de liaison produits-pays avec restrictions

  2. Sécurité
    - Enable RLS sur toutes les nouvelles tables
    - Politiques d'accès pour utilisateurs authentifiés
*/

-- Création de la table des pays de destination
CREATE TABLE IF NOT EXISTS pays_destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(2) NOT NULL UNIQUE,
    nom TEXT NOT NULL,
    zone_douaniere TEXT,
    restrictions_generales TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Création de la table des réglementations par pays
CREATE TABLE IF NOT EXISTS reglementations_pays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pays_id UUID REFERENCES pays_destinations(id) ON DELETE CASCADE,
    type_reglementation TEXT NOT NULL,
    description TEXT NOT NULL,
    documents_requis TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Création de la table de liaison produits-pays
CREATE TABLE IF NOT EXISTS produits_pays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produit_id UUID REFERENCES produits(id) ON DELETE CASCADE,
    pays_id UUID REFERENCES pays_destinations(id) ON DELETE CASCADE,
    autorise BOOLEAN DEFAULT true,
    restrictions_specifiques TEXT,
    documents_supplementaires TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(produit_id, pays_id)
);

-- Enable RLS
ALTER TABLE pays_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reglementations_pays ENABLE ROW LEVEL SECURITY;
ALTER TABLE produits_pays ENABLE ROW LEVEL SECURITY;

-- Création des politiques d'accès
CREATE POLICY "Enable read access for all users"
ON pays_destinations FOR SELECT
TO anon
USING (true);

CREATE POLICY "Enable full access for authenticated users"
ON pays_destinations FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable read access for all users"
ON reglementations_pays FOR SELECT
TO anon
USING (true);

CREATE POLICY "Enable full access for authenticated users"
ON reglementations_pays FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable read access for all users"
ON produits_pays FOR SELECT
TO anon
USING (true);

CREATE POLICY "Enable full access for authenticated users"
ON produits_pays FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Insertion des données de base pour les pays principaux
INSERT INTO pays_destinations (code, nom, zone_douaniere, restrictions_generales) VALUES
('US', 'États-Unis', 'Amérique du Nord', 'Licence d''importation requise. Étiquetage spécifique obligatoire.'),
('CN', 'Chine', 'Asie', 'Certification CIQ requise. Restrictions sur l''importation d''alcool.'),
('JP', 'Japon', 'Asie', 'Déclaration d''importation obligatoire. Normes d''étiquetage strictes.'),
('GB', 'Royaume-Uni', 'Europe', 'Déclaration HMRC requise. Nouvelles réglementations post-Brexit.'),
('SG', 'Singapour', 'Asie', 'Licence d''importation obligatoire. Taxes élevées sur l''alcool.');

-- Insertion des réglementations spécifiques
INSERT INTO reglementations_pays (pays_id, type_reglementation, description, documents_requis)
SELECT id, 'Étiquetage', 'Mention obligatoire du degré d''alcool et des allergènes en anglais', ARRAY['Certificat d''analyse', 'Fiche technique']
FROM pays_destinations WHERE code = 'US';

INSERT INTO reglementations_pays (pays_id, type_reglementation, description, documents_requis)
SELECT id, 'Importation', 'Certification sanitaire obligatoire', ARRAY['Certificat sanitaire', 'Analyse de laboratoire']
FROM pays_destinations WHERE code = 'CN';

-- Création des triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pays_destinations_updated_at
    BEFORE UPDATE ON pays_destinations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reglementations_pays_updated_at
    BEFORE UPDATE ON reglementations_pays
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_produits_pays_updated_at
    BEFORE UPDATE ON produits_pays
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();