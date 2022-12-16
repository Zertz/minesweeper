import { Fragment } from "react";
import { difficulties } from "./difficulties";
import { getSavedDifficulty } from "./getSavedDifficulty";
import { saveDifficulty } from "./saveDifficulty";
import { UseBoard } from "./useBoard";

export function StartGame({
  startGame,
  state,
}: Pick<UseBoard, "startGame" | "state">) {
  const savedDifficulty = getSavedDifficulty();

  return (
    <form
      className={[
        "absolute inset-4 flex flex-col items-center justify-center gap-4 bg-gray-900 text-gray-300",
        state === "idle"
          ? ""
          : "pointer-events-none animate-fade-out opacity-0",
      ].join(" ")}
      onSubmit={(e) => {
        e.preventDefault();

        const { difficulty } = Object.fromEntries(
          Array.from(new FormData(e.currentTarget).entries()).map(([k, v]) => [
            k,
            v.toString(),
          ])
        );

        const boardConfiguration = difficulties.find(
          ({ id }) => id === difficulty
        );

        if (!boardConfiguration) {
          return;
        }

        startGame(boardConfiguration);

        saveDifficulty(difficulty);
      }}
    >
      <div className="grid grid-cols-3 grid-rows-[min-content,1fr,min-content] gap-4">
        <button
          className="col-span-3 rounded border border-gray-300 bg-gray-700 px-2 py-4 font-bold text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
          onClick={() => {
            const now = new Date();

            startGame({
              ...difficulties[1],
              seed: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                now.getMonth(),
                now.getDate(),
                now.getDate(),
                Math.round(now.getFullYear() / 10)
              ).getTime(),
            });
          }}
          type="button"
        >
          Daily challenge
        </button>
        {difficulties.map(({ id, mines, x, y }) => (
          <Fragment key={id}>
            <input
              className="hidden"
              defaultChecked={id === savedDifficulty}
              id={`difficulty-${id}`}
              name="difficulty"
              type="radio"
              value={id}
            />
            <label
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 bg-gray-700 p-4 text-gray-300 hover:border-gray-200 hover:bg-gray-600"
              htmlFor={`difficulty-${id}`}
            >
              <strong>{id}</strong>
              <span>{`${x}x${y}`}</span>
              <span>{`${mines} mines`}</span>
            </label>
          </Fragment>
        ))}
        <button
          className="col-span-3 rounded border border-gray-300 bg-gray-700 px-2 py-1 font-bold text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
          type="submit"
        >
          Play
        </button>
      </div>
    </form>
  );
}
