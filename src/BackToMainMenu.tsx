import { UseBoard } from "./useBoard";
import { useTranslation } from "./useTranslation";

export function BackToMainMenu({
  hideLabel,
  newGame,
}: { hideLabel?: boolean } & Pick<UseBoard, "newGame">) {
  const t = useTranslation();

  return (
    <button
      className="inline-flex gap-1 rounded border border-gray-300 bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
      onClick={() => {
        window.history.pushState({}, document.title, "/");

        newGame();
      }}
      title={t("Back to main menu")}
      type="button"
    >
      &larr;{hideLabel ? "" : ` ${t("Back to main menu")}`}
    </button>
  );
}
