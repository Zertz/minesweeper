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

  const nextLeaderboard = leaderboard
    .filter(({ boardConfiguration: { id, seed, type } }) => {
      return (
        id !== state.boardConfiguration.id &&
        seed !== state.boardConfiguration.seed &&
        type !== state.boardConfiguration.type
      );
    })
    .concat(state)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  setLeaderboard(nextLeaderboard);
}
