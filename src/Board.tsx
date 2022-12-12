import { UseBoard } from "./useBoard";

export function Board({
  board,
  boardSize,
  startTime,
  finishTime,
  state,
  newGame,
  flagCell,
  revealCell,
}: { board: Exclude<UseBoard["board"], undefined> } & Omit<
  UseBoard,
  "board" | "startGame"
>) {
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
        {board.map(({ id, state, type, value, x, y }) => (
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
