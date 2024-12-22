export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      marques: {
        Row: {
          id: string
          nom: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nom: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          nom: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nom: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          created_at?: string
          updated_at?: string
        }
      }
      qualites: {
        Row: {
          id: string
          nom: string
          taux_sucre_residuel: number | null
          acidite_totale: number | null
          ph: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nom: string
          taux_sucre_residuel?: number | null
          acidite_totale?: number | null
          ph?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          taux_sucre_residuel?: number | null
          acidite_totale?: number | null
          ph?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      produits: {
        Row: {
          id: string
          nom: string
          marque_id: string | null
          categorie_id: string | null
          qualite_id: string | null
          millesime: boolean
          pays_origine: string
          pourcentage_alcool: number
          contenance: string
          description_courte: string | null
          description_moyenne: string | null
          description_longue: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nom: string
          marque_id?: string | null
          categorie_id?: string | null
          qualite_id?: string | null
          millesime?: boolean
          pays_origine: string
          pourcentage_alcool: number
          contenance: string
          description_courte?: string | null
          description_moyenne?: string | null
          description_longue?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          marque_id?: string | null
          categorie_id?: string | null
          qualite_id?: string | null
          millesime?: boolean
          pays_origine?: string
          pourcentage_alcool?: number
          contenance?: string
          description_courte?: string | null
          description_moyenne?: string | null
          description_longue?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}