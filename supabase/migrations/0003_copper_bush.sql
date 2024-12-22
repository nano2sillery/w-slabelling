/*
  # Système de gestion des stocks

  1. Nouvelles Tables
    - `stock_entries`: Entrées de stock
    - `stock_movements`: Mouvements de stock

  2. Description
    Cette migration ajoute les tables nécessaires pour gérer le stock des produits,
    incluant les entrées en stock et les mouvements.
*/

-- Create stock_entries table
CREATE TABLE IF NOT EXISTS stock_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produit_id UUID REFERENCES produits(id) ON DELETE CASCADE,
    quantite INTEGER NOT NULL CHECK (quantite >= 0),
    emplacement TEXT NOT NULL,
    date_entree TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    date_peremption TIMESTAMPTZ,
    lot TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create stock_movements table
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stock_entry_id UUID REFERENCES stock_entries(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('entree', 'sortie')),
    quantite INTEGER NOT NULL,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    motif TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE stock_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access for authenticated users"
ON stock_entries FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow read access for authenticated users"
ON stock_movements FOR SELECT
TO authenticated
USING (true);

-- Create indexes
CREATE INDEX idx_stock_entries_produit ON stock_entries(produit_id);
CREATE INDEX idx_stock_movements_entry ON stock_movements(stock_entry_id);