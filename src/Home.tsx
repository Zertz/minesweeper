import { difficulties } from "./difficulties";
import { getRandomInt } from "./getRandomInt";
import { getFastestTimes } from "./leaderboard";
import { UseBoard } from "./useBoard";

export function Home({ startGame }: Pick<UseBoard, "startGame">) {
  return (
    <>
      <button
        className="mb-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 bg-gray-700 p-4 hover:border-gray-200 hover:bg-gray-600"
        onClick={() => {
          const now = new Date();

          startGame({
            ...difficulties[1],
            seed: new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              0,
              0,
              0,
              0
            ).getTime(),
            type: "daily",
          });
        }}
        type="button"
      >
        <strong className="text-lg text-gray-300">Daily challenge</strong>
      </button>
      {difficulties.map((boardConfiguration) => {
        const fastestTimes = getFastestTimes(boardConfiguration.id);

        return (
          <div
            key={boardConfiguration.id}
            className="flex w-full items-center gap-2"
          >
            <button
              className="flex flex-grow cursor-pointer flex-col items-center justify-center rounded-lg border-2 bg-gray-700 p-4 hover:border-gray-200 hover:bg-gray-600"
              onClick={() => {
                startGame({
                  ...boardConfiguration,
                  seed: Date.now() + getRandomInt(-1000, 1000),
                  type: "random",
                });
              }}
              type="button"
            >
              <strong className="text-lg text-gray-300">
                {boardConfiguration.id}
              </strong>
              <span className="text-sm text-gray-400">{`${boardConfiguration.x}x${boardConfiguration.y} · ${boardConfiguration.mines} mines`}</span>
            </button>
            <ol className="flex flex-col gap-1 font-mono text-gray-400">
              <li>
                🥇
                <span className="ml-1 text-sm">
                  {fastestTimes[0] || "--:--"}
                </span>
              </li>
              <li>
                🥈
                <span className="ml-1 text-sm">
                  {fastestTimes[1] || "--:--"}
                </span>
              </li>
              <li>
                🥉
                <span className="ml-1 text-sm">
                  {fastestTimes[2] || "--:--"}
                </span>
              </li>
            </ol>
          </div>
        );
      })}
    </>
  );
}
