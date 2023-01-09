import { useEffect } from "react";
import { Link } from "wouter";
import { difficulties } from "./difficulties";
import { formatMilliseconds } from "./formatMilliseconds";
import {
  getFastestDailyChallenge,
  getFastestGames,
  LeaderboardItem,
} from "./leaderboard";
import { getShareURL } from "./share";
import { UseBoard } from "./useBoard";
import { useTranslation } from "./useTranslation";

export function Home({ newGame }: Pick<UseBoard, "newGame">) {
  const t = useTranslation();

  useEffect(() => {
    newGame();
  }, [newGame]);

  const fastestDailyChallenge = getFastestDailyChallenge();

  return (
    <div className="m-auto flex w-full max-w-xs flex-col gap-8 p-4">
      <div className="flex flex-col gap-2">
        <Link href="/daily">
          <a className="flex flex-grow cursor-pointer flex-col items-center justify-center rounded-lg border-2 bg-gray-700 p-4 hover:border-gray-200 hover:bg-gray-600">
            <strong className="text-lg text-gray-300">
              {t("Daily challenge")}
            </strong>
          </a>
        </Link>
        <ol className="self-center font-mono text-sm text-gray-400">
          <li>
            🏆
            <Result game={fastestDailyChallenge} />
          </li>
        </ol>
      </div>
      {difficulties.map((boardConfiguration) => {
        const fastestGames = getFastestGames(boardConfiguration.difficulty);
        const href = `/play/${boardConfiguration.difficulty.toLowerCase()}`;

        return (
          <div
            key={boardConfiguration.difficulty}
            className="flex flex-col gap-2"
          >
            <Link href={href}>
              <a className="flex flex-grow cursor-pointer flex-col items-center justify-center rounded-lg border-2 bg-gray-700 p-4 hover:border-gray-200 hover:bg-gray-600">
                <strong className="text-lg text-gray-300">
                  {t(boardConfiguration.difficulty)}
                </strong>
                <span className="text-sm text-gray-400">{`${
                  boardConfiguration.x
                }x${boardConfiguration.y} · ${boardConfiguration.mines} ${t(
                  "mines"
                )}`}</span>
              </a>
            </Link>
            <ol className="flex gap-2 self-center whitespace-nowrap font-mono text-sm text-gray-400">
              {["🥇", "🥈", "🥉"].map((medal, index) => (
                <li key={medal}>
                  {medal}
                  <Result game={fastestGames.at(index)} />
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}

function Result({ game }: { game: LeaderboardItem | undefined }) {
  if (!game) {
    return <span className="ml-0.5">--:--.---</span>;
  }

  return (
    <Link
      className="ml-0.5 transition-colors hover:text-gray-300"
      href={getShareURL(game)}
    >
      {formatMilliseconds(game.finishTime - game.startTime)}
    </Link>
  );
}
