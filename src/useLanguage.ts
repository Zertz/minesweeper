import { useEffect, useState } from "react";
import { getDefaultLanguage } from "./i18n";

export function useLanguage() {
  const state = useState(getDefaultLanguage());

  const [language] = state;

  useEffect(() => {
    window.localStorage.setItem("language", language);
  }, [language]);

  return state;
}
