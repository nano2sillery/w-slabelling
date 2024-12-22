/*
  # Remove stock management tables
  
  1. Changes
    - Drop stock_movements table
    - Drop stock_entries table
    
  2. Notes
    - Tables are dropped in correct order to respect foreign key constraints
    - All associated policies and indexes will be automatically dropped
*/

-- Drop tables in correct order
DROP TABLE IF EXISTS stock_movements;
DROP TABLE IF EXISTS stock_entries;