import type { Produit } from '../types/database.types';

export function genererMentionsLegales(produit: Produit): string[] {
  const mentions: string[] = [];

  // Mention d'origine
  if (produit.pays_origine) {
    mentions.push(`Produit de ${produit.pays_origine}`);
  }

  // Titre alcoométrique
  if (produit.pourcentage_alcool) {
    mentions.push(`${produit.pourcentage_alcool} % vol.`);
  }

  // Mention allergène (par défaut pour les vins)
  mentions.push("Contient des sulfites");

  return mentions;
}