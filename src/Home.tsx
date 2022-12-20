import { difficulties } from "./difficulties";
import { getRandomInt } from "./getRandomInt";
import {
  getFastestDailyChallengeTime,
  getFastestDifficultyTimes,
} from "./leaderboard";
import { UseBoard } from "./useBoard";

export function Home({ startGame }: Pick<UseBoard, "startGame">) {
  const fastestDailyChallengeTime = getFastestDailyChallengeTime();

  return (
    <>
      <div className="flex flex-col gap-1">
        <button
          className="flex flex-grow cursor-pointer flex-col items-center justify-center rounded-lg border-2 bg-gray-700 p-4 hover:border-gray-200 hover:bg-gray-600"
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
        <ol className="self-center font-mono text-sm text-gray-400">
          <li>
            🏆
            <span className="ml-0.5">
              {fastestDailyChallengeTime || "--:--.---"}
            </span>
          </li>
        </ol>
      </div>
      {difficulties.map((boardConfiguration) => {
        const fastestDifficultyTimes = getFastestDifficultyTimes(
          boardConfiguration.id
        );

        return (
          <div key={boardConfiguration.id} className="flex flex-col gap-1">
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
            <ol className="flex gap-2 self-center whitespace-nowrap font-mono text-sm text-gray-400">
              <li>
                🥇
                <span className="ml-0.5">
                  {fastestDifficultyTimes.at(0) || "--:--.---"}
                </span>
              </li>
              <li>
                🥈
                <span className="ml-0.5">
                  {fastestDifficultyTimes.at(1) || "--:--.---"}
                </span>
              </li>
              <li>
                🥉
                <span className="ml-0.5">
                  {fastestDifficultyTimes.at(2) || "--:--.---"}
                </span>
              </li>
            </ol>
          </div>
        );
      })}
    </>
  );
}
