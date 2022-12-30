import { BoardConfiguration, StoredGameResult } from "./types";
import { State } from "./useBoard";

export type LeaderboardItem = Pick<State, "actions"> & {
  boardConfiguration: BoardConfiguration;
  startDate: string;
  startTime: number;
  finishTime: number;
};

function isDefined<T>(argument: T | undefined): argument is T {
  return argument !== undefined;
}

function getLeaderboard(): LeaderboardItem[] {
  try {
    const storedLeaderboard = localStorage.getItem("leaderboard");

    if (!storedLeaderboard) {
      return [];
    }

    const leaderboard = JSON.parse(storedLeaderboard);

    if (!Array.isArray(leaderboard)) {
      return [];
    }

    return leaderboard
      .map((item) => {
        try {
          return StoredGameResult.parse(item);
        } catch {
          // 🤷‍♂️
        }
      })
      .filter(isDefined);
  } catch (e) {
    console.error(e);

    return [];
  }
}

export function encodeActions(actions: LeaderboardItem["actions"]) {
  return actions
    .map(({ type, payload, elapsedTime }) => {
      return `${type.substring(0, 1)}-${payload.id}-${elapsedTime}`;
    })
    .join("_");
}

function setLeaderboard(leaderboard: LeaderboardItem[]) {
  try {
    localStorage.setItem(
      "leaderboard",
      JSON.stringify(
        leaderboard.map(({ actions, ...rest }) => ({
          actions: encodeActions(actions),
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
