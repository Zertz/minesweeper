import { UseBoard } from "./useBoard";

export function BackToMainMenu({ newGame }: Pick<UseBoard, "newGame">) {
  return (
    <button
      className="inline-flex gap-1 rounded border border-gray-300 bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
      onClick={newGame}
      title="Back to main menu"
      type="button"
    >
      &larr;
    </button>
  );
}
