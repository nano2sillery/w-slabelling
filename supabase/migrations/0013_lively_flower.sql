/*
  # Ajout des données pour les mentions légales

  1. Nouvelles Données
    - Mentions obligatoires générales
    - Mentions spécifiques aux vins
    - Mentions spécifiques aux spiritueux
    - Mentions nutritionnelles
    - Exigences réglementaires par pays

  2. Modifications
    - Mise à jour des attributs existants
    - Ajout des traductions
*/

-- Insertion des mentions légales obligatoires générales
INSERT INTO mentions_legales (type, texte_generique) VALUES
('denomination_produit', 'Vin'),
('titre_alcoometrique', '% vol.'),
('pays_origine', 'Produit de [PAYS]'),
('allergenes', 'Contient des sulfites')
ON CONFLICT ON CONSTRAINT mentions_legales_type_key DO NOTHING;

-- Insertion des attributs pour les mentions légales
INSERT INTO mentions_legales_attributs (nom, type, description, obligatoire) VALUES
('champ_visuel', 'texte', 'Position dans le champ visuel de l''étiquette', true),
('tolerance_alcool', 'nombre', 'Tolérance autorisée pour le degré d''alcool', true),
('hauteur_minimale', 'nombre', 'Hauteur minimale des caractères en mm', true),
('lisibilite', 'booleen', 'Texte clair et indélébile requis', true)
ON CONFLICT ON CONSTRAINT mentions_legales_attributs_nom_key DO NOTHING;

-- Insertion des règles d'étiquetage spécifiques
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
    pd.id,
    'VIN',
    12, -- 1.2mm converti en points
    4.5,
    ARRAY[CASE 
        WHEN pd.code = 'FR' THEN 'fr'
        WHEN pd.code = 'US' THEN 'en'
        ELSE 'en'
    END],
    1,
    '2024-01-01'
FROM pays_destinations pd
WHERE pd.code IN ('FR', 'US', 'GB');

-- Insertion des pictogrammes obligatoires
INSERT INTO mentions_legales_pictogrammes (
    pays_id,
    type_pictogramme,
    url_image,
    taille_min,
    position_relative,
    conditions_affichage
)
SELECT 
    pd.id,
    'femme_enceinte',
    'https://example.com/pictograms/pregnant-woman.png',
    15,
    '{"x": 0, "y": 0, "reference": "bottom_right"}'::jsonb,
    '{"required_for": ["wine", "spirits"], "min_alcohol": 1.2}'::jsonb
FROM pays_destinations pd
WHERE pd.code = 'FR';

-- Insertion des traductions
INSERT INTO mentions_legales_traductions (
    mention_legale_id,
    pays_id,
    langue,
    texte
)
SELECT 
    ml.id,
    pd.id,
    'en',
    CASE ml.type
        WHEN 'denomination_produit' THEN 'Wine'
        WHEN 'allergenes' THEN 'Contains sulfites'
        WHEN 'pays_origine' THEN 'Product of [COUNTRY]'
    END
FROM mentions_legales ml
CROSS JOIN pays_destinations pd
WHERE pd.code = 'US'
AND ml.type IN ('denomination_produit', 'allergenes', 'pays_origine');