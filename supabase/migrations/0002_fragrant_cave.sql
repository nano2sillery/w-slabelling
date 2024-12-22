/*
  # Ajout des champs pour la gestion des millésimes

  1. Modifications
    - Ajout du champ `annee_production` à la table `produits`
    - Ajout du champ `notes_millesime` à la table `produits`

  2. Description
    Cette migration ajoute les champs nécessaires pour gérer les millésimes des vins,
    permettant de spécifier l'année de production et d'ajouter des notes spécifiques
    au millésime.
*/

DO $$ 
BEGIN
  -- Ajout de la colonne annee_production si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'produits' AND column_name = 'annee_production'
  ) THEN
    ALTER TABLE produits ADD COLUMN annee_production INTEGER;
  END IF;

  -- Ajout de la colonne notes_millesime si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'produits' AND column_name = 'notes_millesime'
  ) THEN
    ALTER TABLE produits ADD COLUMN notes_millesime TEXT;
  END IF;
END $$;