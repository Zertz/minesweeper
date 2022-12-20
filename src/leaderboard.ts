import { formatMilliseconds } from "./formatMilliseconds";
import { BoardConfiguration } from "./types";

type LeaderboardItem = {
  boardConfiguration: BoardConfiguration;
  revealedCells: number;
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

export function getFastestTimes(
  difficulty: BoardConfiguration["id"],
  limit = 3
) {
  const leaderboard = getLeaderboard();

  return leaderboard
    .filter(({ boardConfiguration }) => boardConfiguration.id === difficulty)
    .map(({ startTime, finishTime }) => finishTime - startTime)
    .sort((a, b) => a - b)
    .filter((ms) => ms < 1000 * 60 * 100)
    .filter((_, index) => index < limit)
    .map((ms) => formatMilliseconds(ms));
}
