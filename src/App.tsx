import { useRef } from "react";
import { getDefaultBoardSize } from "./getDefaultBoardSize";
import {
  isBoardSizeValid,
  maxBoardSize,
  minBoardSize,
} from "./isBoardSizeValid";
import { useBoard } from "./useBoard";

const defaultBoardSize = getDefaultBoardSize();

export default function App() {
  const boardSizeInputRef = useRef<HTMLInputElement>(null);

  const {
    board,
    boardSize,
    startTime,
    finishTime,
    state,
    newGame,
    startGame,
    flagCell,
    revealCell,
  } = useBoard();

  if (!board) {
    return (
      <form
        className="m-auto flex items-center gap-2 px-4 text-gray-300"
        onSubmit={(e) => {
          e.preventDefault();

          const inputBoardSize = Number(boardSizeInputRef.current?.value);

          if (!isBoardSizeValid(inputBoardSize)) {
            return;
          }

          startGame(inputBoardSize);
        }}
      >
        <label htmlFor="board-size">Board size</label>
        <input
          autoFocus
          className="rounded px-2 py-1 text-gray-900"
          defaultValue={defaultBoardSize}
          id="board-size"
          max={maxBoardSize}
          min={minBoardSize}
          ref={boardSizeInputRef}
          required
          step={1}
          type="number"
        />
        <button
          className="rounded border border-gray-300 bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
          type="submit"
        >
          Start
        </button>
      </form>
    );
  }

  return (
    <>
      {startTime && finishTime && (
        <div className="absolute inset-0 flex scale-150 flex-col items-center justify-center bg-gray-700/75 text-gray-300">
          <span className="mb-4 text-7xl">{state === "win" ? "🎉" : "💥"}</span>
          <span className="text-xl">
            {state === "win"
              ? "Awesome! You finished in"
              : "Oh no! You blew it in"}
          </span>
          <span className="text-xl">{`${Math.round(
            (finishTime - startTime) / 1000
          )} seconds!`}</span>
          <button
            className="mt-4 rounded border border-gray-300 bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
            onClick={newGame}
            type="button"
          >
            New game
          </button>
        </div>
      )}
      <div
        className="m-auto grid w-min select-none gap-1 px-4 text-center"
        style={{
          gridTemplateRows: `repeat(${boardSize}, 1fr)`,
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
        }}
      >
        {board.map(({ id, state, type, value, x, y }, i) => (
          <button
            key={`${x},${y}`}
            className={[
              "cell",
              state !== "visible"
                ? "h"
                : type === "bomb"
                ? "bg-red-300"
                : value === 0
                ? "bg-gray-300"
                : value === 1
                ? "bg-orange-100"
                : value === 2
                ? "bg-orange-200"
                : value === 3
                ? "bg-orange-300"
                : "bg-orange-400",
            ].join(" ")}
            disabled={state === "visible"}
            onClick={() => revealCell(id)}
            onContextMenu={(e) => {
              e.preventDefault();

              flagCell(id);
            }}
          >
            {state === "hidden"
              ? null
              : state === "flag"
              ? "⛳️"
              : type === "bomb"
              ? "💣"
              : value || null}
          </button>
        ))}
      </div>
      <div className="sticky left-1/2 flex -translate-x-1/2 gap-4 self-center">
        <button
          className="rounded border border-gray-300 bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
          hidden={!!finishTime}
          onClick={newGame}
          type="button"
        >
          New game
        </button>
      </div>
    </>
  );
}
