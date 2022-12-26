type Language = "en" | "es" | "fr";

const translations: Record<
  string,
  Partial<Record<Exclude<Language, "en">, string>>
> = {
  "Daily challenge": { es: "Desafío del día", fr: "Défi du jour" },
  Minesweeper: { es: "Buscaminas", fr: "Démineur" },
  Beginner: { es: "Principiante", fr: "Débutant" },
  Intermediate: { es: "Intermedio", fr: "Intermédiaire" },
  Expert: { es: "Experto" },
  mines: { es: "minas" },
  "Back to main menu": {
    es: "Regresar al menú principal",
    fr: "Retour au menu principal",
  },
  "Share replay": { es: "Compartir repetición", fr: "Partager la reprise" },
  "Restart replay": { es: "Reiniciar repetición", fr: "Redémarrer la reprise" },
  "Try again": { es: "Volver a intentar", fr: "Réessayer" },
  "You won in": { es: "Ganaste en", fr: "Vous avez gagné en" },
  "You lost in": { es: "Perdiste en", fr: "Vous avez perdu en" },
};

const language = (navigator.languages
  .map((language) => language.substring(0, 2).toLowerCase())
  .find((language) => language in translations) || "en") as Language;

export function t(key: keyof typeof translations) {
  if (language === "en") {
    return key;
  }

  return translations[key][language] || key;
}

document.title = t("Minesweeper");
