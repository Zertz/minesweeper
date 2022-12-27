import { useTranslation } from "./App";
import { difficulties } from "./difficulties";
import { formatMilliseconds } from "./formatMilliseconds";
import { getRandomInt } from "./getRandomInt";
import {
  getFastestDailyChallenge,
  getFastestGames,
  LeaderboardItem,
} from "./leaderboard";
import { UseBoard } from "./useBoard";

export function Home({
  startGame,
  startReplay,
}: Pick<UseBoard, "startGame" | "startReplay">) {
  const t = useTranslation();

  const fastestDailyChallenge = getFastestDailyChallenge();

  return (
    <div className="m-auto flex w-full max-w-xs flex-col gap-8 p-4">
      <div className="flex flex-col gap-2">
        <button
          className="flex flex-grow cursor-pointer flex-col items-center justify-center rounded-lg border-2 bg-gray-700 p-4 hover:border-gray-200 hover:bg-gray-600"
          onClick={() => {
            const now = new Date();

            startGame({
              ...difficulties[1],
              id: crypto.randomUUID(),
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
          <strong className="text-lg text-gray-300">
            {t("Daily challenge")}
          </strong>
        </button>
        <ol className="self-center font-mono text-sm text-gray-400">
          <li>
            🏆
            <Result game={fastestDailyChallenge} startReplay={startReplay} />
          </li>
        </ol>
      </div>
      {difficulties.map((boardConfiguration) => {
        const fastestGames = getFastestGames(boardConfiguration.difficulty);

        return (
          <div
            key={boardConfiguration.difficulty}
            className="flex flex-col gap-2"
          >
            <button
              className="flex flex-grow cursor-pointer flex-col items-center justify-center rounded-lg border-2 bg-gray-700 p-4 hover:border-gray-200 hover:bg-gray-600"
              onClick={() => {
                startGame({
                  ...boardConfiguration,
                  id: crypto.randomUUID(),
                  seed: Date.now() + getRandomInt(-1000, 1000),
                  type: "random",
                });
              }}
              type="button"
            >
              <strong className="text-lg text-gray-300">
                {t(boardConfiguration.difficulty)}
              </strong>
              <span className="text-sm text-gray-400">{`${
                boardConfiguration.x
              }x${boardConfiguration.y} · ${boardConfiguration.mines} ${t(
                "mines"
              )}`}</span>
            </button>
            <ol className="flex gap-2 self-center whitespace-nowrap font-mono text-sm text-gray-400">
              {["🥇", "🥈", "🥉"].map((medal, index) => (
                <li key={medal}>
                  {medal}
                  <Result
                    game={fastestGames.at(index)}
                    startReplay={startReplay}
                  />
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}

function Result({
  game,
  startReplay,
}: { game: LeaderboardItem | undefined } & Pick<UseBoard, "startReplay">) {
  if (!game) {
    return <span className="ml-0.5">--:--.---</span>;
  }

  return (
    <button
      className="ml-0.5 transition-colors hover:text-gray-300"
      onClick={() => startReplay(game)}
    >
      {formatMilliseconds(game.finishTime - game.startTime)}
    </button>
  );
}
