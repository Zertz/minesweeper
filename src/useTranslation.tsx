import { createContext, ReactNode, useContext, useEffect } from "react";
import { Language, t } from "./i18n";

const TranslationContext = createContext<(key: string) => string>((key) => key);

export function TranslationProvider({
  children,
  language,
}: {
  children: ReactNode;
  language: Language;
}) {
  useEffect(() => {
    document.title = t("Minesweeper", language);
  }, [language]);

  return (
    <TranslationContext.Provider value={(key) => t(key, language)}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const t = useContext(TranslationContext);

  return t;
}
