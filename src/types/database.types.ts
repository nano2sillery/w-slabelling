// Mise à jour du type MentionLegale
export interface MentionLegale {
  id: string;
  type: string;
  texte_generique: string;
  categorie: 'generale' | 'vin' | 'spiritueux' | 'nutritionnelle' | 'reglementaire';
  champ_visuel: string;
  taille_min: number;
  contraste_min: number;
  obligatoire: boolean;
  position: string;
  style_texte: string;
}