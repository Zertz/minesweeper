import { isTruthy } from "./isTruthy";

export const languages = [
  { k: "en", v: "English" },
  { k: "es", v: "Español" },
  { k: "fr", v: "Français" },
] as const;

const languageKeys = Object.values(languages).map(({ k }) => k);

export type Language = typeof languageKeys[number];

const translations: Record<
  string,
  Partial<Record<Exclude<Language, "en">, string>>
> = {
  Language: { es: "Idioma", fr: "Langue" },
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
  "New game": { es: "Nueva parte", fr: "Nouvelle partie" },
  "Try again": { es: "Volver a intentar", fr: "Réessayer" },
  "You won in": { es: "Ganaste en", fr: "Vous avez gagné en" },
  "You lost in": { es: "Perdiste en", fr: "Vous avez perdu en" },
};

export function getDefaultLanguage(): Language {
  const storedLanguage = window.localStorage.getItem("language");

  const wantedLanguage = [storedLanguage, ...navigator.languages]
    .filter(isTruthy)
    .map((language) => language.substring(0, 2).toLowerCase())
    .find((language) => languageKeys.includes(language as Language));

  if (wantedLanguage) {
    return wantedLanguage as Language;
  }

  return languages[0].k;
}

export function t(key: keyof typeof translations, language: Language) {
  if (language === "en") {
    return key;
  }

  return translations[key][language] || key;
}
