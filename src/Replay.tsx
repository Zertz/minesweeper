import { Board } from "./Board";
import { UseBoard } from "./useBoard";

export function Replay({
  board,
  boardConfiguration,
  newGame,
  flagCell,
  revealCell,
}: Pick<
  UseBoard,
  "board" | "boardConfiguration" | "newGame" | "flagCell" | "revealCell"
>) {
  return (
    <>
      <div className="flex gap-4 p-4 pb-2">
        <button
          className="rounded border border-gray-300 bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
          onClick={newGame}
          type="button"
        >
          &larr; Back to main menu
        </button>
      </div>
      <Board
        board={board}
        boardConfiguration={boardConfiguration}
        disabled
        flagCell={flagCell}
        revealCell={revealCell}
      />
    </>
  );
}
