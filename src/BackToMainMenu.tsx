import { Link } from "wouter";
import { useTranslation } from "./useTranslation";

export function BackToMainMenu({ hideLabel }: { hideLabel?: boolean }) {
  const t = useTranslation();

  return (
    <Link
      className="inline-flex gap-1 rounded border border-gray-300 bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
      href="/"
      title={t("Back to main menu")}
    >
      &larr;{hideLabel ? "" : ` ${t("Back to main menu")}`}
    </Link>
  );
}
