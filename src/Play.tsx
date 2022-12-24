import { BackToMainMenu } from "./BackToMainMenu";
import { Board } from "./Board";
import { formatMilliseconds } from "./formatMilliseconds";
import { getShareURL } from "./leaderboard";
import { UseBoard } from "./useBoard";

export function Play({
  board,
  boardConfiguration,
  startGame,
  startTime,
  finishTime,
  state,
  newGame,
  flagCell,
  revealCell,
}: Pick<
  UseBoard,
  | "board"
  | "boardConfiguration"
  | "startGame"
  | "startTime"
  | "finishTime"
  | "state"
  | "newGame"
  | "flagCell"
  | "revealCell"
>) {
  return (
    <>
      <div className="flex gap-4 p-4 pb-2" hidden={state !== "in-progress"}>
        <BackToMainMenu hideLabel newGame={newGame} />
      </div>
      {boardConfiguration && startTime && finishTime && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-700/75 text-gray-300">
          <span className="text-7xl">{state === "win" ? "🎉" : "💥"}</span>
          <span className="text-center text-2xl">
            {state === "win"
              ? "Awesome! You finished in"
              : "Oh no! You blew it in"}
            <br />
            {formatMilliseconds(finishTime - startTime)}
          </span>
          <button
            className="rounded border border-gray-300 bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
            hidden={state !== "win"}
            onClick={() => {
              const shareUrl = getShareURL(boardConfiguration.id);

              if (!shareUrl) {
                return;
              }

              navigator.clipboard
                .writeText(shareUrl)
                .then(console.info)
                .catch(console.error);
            }}
            type="button"
          >
            Share replay
          </button>
          <button
            className="rounded border border-gray-300 bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
            hidden={state !== "lose"}
            onClick={() => startGame(boardConfiguration)}
            type="button"
          >
            &#8635; Try again
          </button>
          <BackToMainMenu newGame={newGame} />
        </div>
      )}
      <Board
        board={board}
        boardConfiguration={boardConfiguration}
        flagCell={flagCell}
        revealCell={revealCell}
      />
    </>
  );
}
