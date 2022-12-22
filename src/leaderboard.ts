import { BoardConfiguration } from "./types";
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

    return JSON.parse(leaderboard);
  } catch {
    return [];
  }
}

function setLeaderboard(leaderboard: LeaderboardItem[]) {
  try {
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  } catch {
    // Some browsers throw in private mode
  }
}

export function addToLeaderboard(state: LeaderboardItem) {
  const leaderboard = getLeaderboard();

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
  difficulty: BoardConfiguration["id"],
  limit = 3
) {
  const leaderboard = getLeaderboard();

  return leaderboard
    .filter(({ boardConfiguration, startTime, finishTime }) => {
      if (boardConfiguration.id !== difficulty) {
        return false;
      }

      return finishTime - startTime < 1000 * 60 * 100;
    })
    .sort((a, b) => a.finishTime - a.startTime - (b.finishTime - b.startTime))
    .filter((_, index) => index < limit);
}
