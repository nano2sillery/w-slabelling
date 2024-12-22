export interface PaysDestination {
  id: string;
  code: string;
  nom: string;
  zone_douaniere: string;
  restrictions_generales: string;
}

export interface ReglementationPays {
  id: string;
  pays_id: string;
  type_reglementation: string;
  description: string;
  documents_requis: string[];
}

export interface ProduitPays {
  id: string;
  produit_id: string;
  pays_id: string;
  autorise: boolean;
  restrictions_specifiques: string;
  documents_supplementaires: string[];
}