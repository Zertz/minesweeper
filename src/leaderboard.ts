import { z } from "zod";
import { BoardConfiguration, StoredGameResult } from "./types";
import { State } from "./useBoard";

export type LeaderboardItem = Pick<State, "actions"> & {
  boardConfiguration: BoardConfiguration;
  startDate: string;
  startTime: number;
  finishTime: number;
};

function getLeaderboard(): LeaderboardItem[] {
  try {
    const leaderboard = localStorage.getItem("leaderboard");

    if (!leaderboard) {
      return [];
    }

    return z.array(StoredGameResult).parse(JSON.parse(leaderboard));
  } catch (e) {
    console.error(e);

    return [];
  }
}

function setLeaderboard(leaderboard: LeaderboardItem[]) {
  try {
    localStorage.setItem(
      "leaderboard",
      JSON.stringify(
        leaderboard.map(({ actions, ...rest }) => ({
          actions: actions
            .map(({ type, payload, elapsedTime }) => {
              return `${type.substring(0, 1)}-${payload.id}-${elapsedTime}`;
            })
            .join("_"),
          ...rest,
        }))
      )
    );
  } catch {
    // Some browsers throw in private mode
  }
}

export function addToLeaderboard(state: LeaderboardItem) {
  const leaderboard = getLeaderboard();

  if (
    leaderboard.some(({ boardConfiguration }) => {
      return boardConfiguration.id === state.boardConfiguration.id;
    })
  ) {
    return;
  }

  setLeaderboard(leaderboard.concat(state));
}

export function getFastestDailyChallenge() {
  const leaderboard = getLeaderboard();

  const fastestTimes = leaderboard
    .filter(({ boardConfiguration, startDate }) => {
      if (boardConfiguration.type !== "daily") {
        return false;
      }

      return startDate.split("T")[0] === new Date().toISOString().split("T")[0];
    })
    .sort((a, b) => a.finishTime - a.startTime - (b.finishTime - b.startTime));

  return fastestTimes.at(0);
}

export function getFastestGames(
  difficulty: BoardConfiguration["difficulty"],
  limit = 3
) {
  const leaderboard = getLeaderboard();

  return leaderboard
    .filter(({ boardConfiguration, startTime, finishTime }) => {
      if (boardConfiguration.difficulty !== difficulty) {
        return false;
      }

      return finishTime - startTime < 1000 * 60 * 100;
    })
    .sort((a, b) => a.finishTime - a.startTime - (b.finishTime - b.startTime))
    .filter((_, index) => index < limit);
}

export function getShareURL(id: BoardConfiguration["id"]) {
  const leaderboard = getLeaderboard();

  const game = leaderboard.find(
    ({ boardConfiguration }) => boardConfiguration.id === id
  );

  if (!game) {
    return;
  }

  return `${window.location.origin}?game=${encodeURIComponent(
    JSON.stringify(game)
  )}`;
}
