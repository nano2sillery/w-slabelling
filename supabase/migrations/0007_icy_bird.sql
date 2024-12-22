/*
  # Ajout des politiques d'accès aux données

  1. Modifications
    - Ajout de politiques permettant l'accès en lecture/écriture pour les utilisateurs authentifiés
    - Suppression des restrictions de rôle pour faciliter l'accès initial
*/

-- Suppression des anciennes politiques restrictives
DROP POLICY IF EXISTS "Allow marketing users to manage brands" ON marques;
DROP POLICY IF EXISTS "Allow marketing users to manage products" ON produits;
DROP POLICY IF EXISTS "Allow legal users to manage legal notices" ON mentions_legales;
DROP POLICY IF EXISTS "Allow legal users to manage product-specific legal notices" ON mentions_legales_produits;

-- Création de nouvelles politiques plus permissives
CREATE POLICY "Enable full access for authenticated users"
ON marques FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users"
ON produits FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users"
ON categories FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users"
ON qualites FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable full access for authenticated users"
ON mentions_legales FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Permettre l'accès public en lecture seule
CREATE POLICY "Enable read access for all users"
ON marques FOR SELECT
TO anon
USING (true);

CREATE POLICY "Enable read access for all users"
ON produits FOR SELECT
TO anon
USING (true);

CREATE POLICY "Enable read access for all users"
ON categories FOR SELECT
TO anon
USING (true);

CREATE POLICY "Enable read access for all users"
ON qualites FOR SELECT
TO anon
USING (true);

CREATE POLICY "Enable read access for all users"
ON mentions_legales FOR SELECT
TO anon
USING (true);