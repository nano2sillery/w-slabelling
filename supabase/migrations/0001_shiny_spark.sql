/*
  # Initial Schema for W&S Labelling Application

  1. New Tables
    - `marques` (brands)
      - `id` (uuid, primary key)
      - `nom` (text, brand name)
      - `description` (text, brand description)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `categories` (product categories)
      - `id` (uuid, primary key)
      - `nom` (text, category name)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `qualites` (product qualities)
      - `id` (uuid, primary key)
      - `nom` (text, quality name)
      - `taux_sucre_residuel` (decimal, residual sugar rate)
      - `acidite_totale` (decimal, total acidity)
      - `ph` (decimal, pH level)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `produits` (products)
      - `id` (uuid, primary key)
      - `nom` (text, product name)
      - `marque_id` (uuid, foreign key to marques)
      - `categorie_id` (uuid, foreign key to categories)
      - `qualite_id` (uuid, foreign key to qualites)
      - `millesime` (boolean)
      - `pays_origine` (text, country of origin)
      - `pourcentage_alcool` (decimal, alcohol percentage)
      - `contenance` (text, volume)
      - `description_courte` (text, short marketing description)
      - `description_moyenne` (text, medium marketing description)
      - `description_longue` (text, long marketing description)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `mentions_legales` (legal notices)
      - `id` (uuid, primary key)
      - `type` (text, notice type)
      - `texte_generique` (text, generic text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `mentions_legales_produits` (product-specific legal notices)
      - `id` (uuid, primary key)
      - `produit_id` (uuid, foreign key to produits)
      - `mention_legale_id` (uuid, foreign key to mentions_legales)
      - `texte_specifique` (text, product-specific text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on their role
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create marques table
CREATE TABLE IF NOT EXISTS marques (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_marques_updated_at
    BEFORE UPDATE ON marques
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create qualites table
CREATE TABLE IF NOT EXISTS qualites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom TEXT NOT NULL,
    taux_sucre_residuel DECIMAL(5,2),
    acidite_totale DECIMAL(4,2),
    ph DECIMAL(3,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_qualites_updated_at
    BEFORE UPDATE ON qualites
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create produits table
CREATE TABLE IF NOT EXISTS produits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom TEXT NOT NULL,
    marque_id UUID REFERENCES marques(id),
    categorie_id UUID REFERENCES categories(id),
    qualite_id UUID REFERENCES qualites(id),
    millesime BOOLEAN DEFAULT false,
    pays_origine TEXT NOT NULL,
    pourcentage_alcool DECIMAL(4,2) NOT NULL,
    contenance TEXT NOT NULL,
    description_courte TEXT,
    description_moyenne TEXT,
    description_longue TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_produits_updated_at
    BEFORE UPDATE ON produits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create mentions_legales table
CREATE TABLE IF NOT EXISTS mentions_legales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    texte_generique TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_mentions_legales_updated_at
    BEFORE UPDATE ON mentions_legales
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create mentions_legales_produits table
CREATE TABLE IF NOT EXISTS mentions_legales_produits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    produit_id UUID REFERENCES produits(id),
    mention_legale_id UUID REFERENCES mentions_legales(id),
    texte_specifique TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_mentions_legales_produits_updated_at
    BEFORE UPDATE ON mentions_legales_produits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE marques ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE qualites ENABLE ROW LEVEL SECURITY;
ALTER TABLE produits ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentions_legales ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentions_legales_produits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access for all authenticated users"
ON marques FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow read access for all authenticated users"
ON categories FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow read access for all authenticated users"
ON qualites FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow read access for all authenticated users"
ON produits FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow read access for all authenticated users"
ON mentions_legales FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow read access for all authenticated users"
ON mentions_legales_produits FOR SELECT
TO authenticated
USING (true);

-- Create policies for marketing users
CREATE POLICY "Allow marketing users to manage brands"
ON marques FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'marketing')
WITH CHECK (auth.jwt() ->> 'role' = 'marketing');

CREATE POLICY "Allow marketing users to manage products"
ON produits FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'marketing')
WITH CHECK (auth.jwt() ->> 'role' = 'marketing');

-- Create policies for legal users
CREATE POLICY "Allow legal users to manage legal notices"
ON mentions_legales FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'legal')
WITH CHECK (auth.jwt() ->> 'role' = 'legal');

CREATE POLICY "Allow legal users to manage product-specific legal notices"
ON mentions_legales_produits FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'legal')
WITH CHECK (auth.jwt() ->> 'role' = 'legal');