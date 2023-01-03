import { useCallback, useEffect, useReducer } from "react";
import { flagCell } from "./flagCell";
import { getEmptyBoard } from "./getEmptyBoard";
import { addToLeaderboard, LeaderboardItem } from "./leaderboard";
import { mineBoard } from "./mineBoard";
import { revealCell } from "./revealCell";
import { BoardConfiguration, Cell } from "./types";

type BoardAction =
  | {
      type: "newGame";
    }
  | {
      type: "startGame";
      payload: {
        boardConfiguration: BoardConfiguration;
      };
    }
  | {
      type: "startReplay";
      payload?: LeaderboardItem;
    }
  | {
      type: "restartReplay";
    };

type PlayerAction =
  | {
      type: "revealCell";
      payload: {
        id: string;
      };
    }
  | {
      type: "flagCell";
      payload: {
        id: string;
      };
    };

export type State = {
  actions: (PlayerAction & { elapsedTime: number })[];
  board: Cell[] | undefined;
  boardConfiguration: BoardConfiguration | undefined;
  game: LeaderboardItem | undefined;
  replayActionIndex: number | undefined;
  startDate: string | undefined;
  startTime: number | undefined;
  finishTime: number | undefined;
  state: "idle" | "in-progress" | "win" | "lose";
};

const initialState: State = {
  actions: [],
  board: undefined,
  boardConfiguration: undefined,
  game: undefined,
  replayActionIndex: undefined,
  startDate: undefined,
  startTime: undefined,
  finishTime: undefined,
  state: "idle",
};

function reducer(state: State, action: BoardAction | PlayerAction): State {
  switch (action.type) {
    case "newGame": {
      return initialState;
    }
    case "startGame": {
      return {
        actions: [],
        board: getEmptyBoard(action.payload.boardConfiguration),
        boardConfiguration: action.payload.boardConfiguration,
        game: undefined,
        replayActionIndex: undefined,
        startDate: new Date().toISOString(),
        startTime: undefined,
        finishTime: undefined,
        state: "in-progress",
      };
    }
    case "startReplay": {
      if (action.payload) {
        const initialCellId = action.payload.actions.find(
          (action) => action.type === "revealCell"
        )?.payload.id;

        if (!initialCellId) {
          throw new Error("Can't replay without at least one revealed cell");
        }

        return {
          actions: action.payload.actions,
          board: mineBoard(
            action.payload.boardConfiguration,
            getEmptyBoard(action.payload.boardConfiguration),
            initialCellId
          ),
          boardConfiguration: {
            ...action.payload.boardConfiguration,
            type: "replay",
          },
          game: action.payload,
          replayActionIndex: 0,
          startDate: action.payload.startDate,
          startTime: action.payload.startTime,
          finishTime: action.payload.finishTime,
          state: "win",
        };
      }

      return {
        actions: state.actions,
        board: state.board?.map((cell) => ({
          ...cell,
          state: "hidden",
        })),
        boardConfiguration: state.boardConfiguration,
        game: undefined,
        replayActionIndex: 0,
        startDate: state.startDate,
        startTime: state.startTime,
        finishTime: state.finishTime,
        state: state.state,
      };
    }
    case "restartReplay": {
      if (
        !state.boardConfiguration ||
        state.boardConfiguration.type !== "replay"
      ) {
        throw new Error("Can't restart replay");
      }

      const initialCellId = state.actions.find(
        (action) => action.type === "revealCell"
      )?.payload.id;

      if (!initialCellId) {
        throw new Error("Can't replay without at least one revealed cell");
      }

      return {
        actions: state.actions,
        board: mineBoard(
          state.boardConfiguration,
          getEmptyBoard(state.boardConfiguration),
          initialCellId
        ),
        boardConfiguration: state.boardConfiguration,
        game: state.game,
        replayActionIndex: 0,
        startDate: state.startDate,
        startTime: state.startTime,
        finishTime: state.finishTime,
        state: state.state,
      };
    }
  }

  if (typeof state.replayActionIndex === "number") {
    switch (action.type) {
      case "flagCell": {
        if (!state.board) {
          throw new Error("Game not started");
        }

        return {
          actions: state.actions,
          board: flagCell(state.board, action.payload.id),
          boardConfiguration: state.boardConfiguration,
          game: state.game,
          replayActionIndex: state.replayActionIndex + 1,
          startDate: state.startDate,
          startTime: state.startTime,
          finishTime: state.finishTime,
          state: state.state,
        };
      }
      case "revealCell": {
        if (!state.board || !state.boardConfiguration) {
          throw new Error("Game not started");
        }

        const board = state.actions.some(({ type }) => type === "revealCell")
          ? revealCell(state.board, action.payload.id)
          : revealCell(
              mineBoard(
                state.boardConfiguration,
                state.board,
                action.payload.id
              ),
              action.payload.id
            );

        return {
          actions: state.actions,
          board,
          boardConfiguration: state.boardConfiguration,
          game: state.game,
          replayActionIndex: state.replayActionIndex + 1,
          startDate: state.startDate,
          startTime: state.startTime,
          finishTime: state.finishTime,
          state: state.state,
        };
      }
    }
  }

  const elapsedTime = state.actions.reduce(
    (acc, { elapsedTime }) => acc + elapsedTime,
    0
  );

  const actions = state.actions.concat({
    ...action,
    elapsedTime: state.startTime
      ? Date.now() - state.startTime - elapsedTime
      : 0,
  });

  switch (action.type) {
    case "flagCell": {
      if (!state.board) {
        throw new Error("Game not started");
      }

      return {
        actions,
        board: flagCell(state.board, action.payload.id),
        boardConfiguration: state.boardConfiguration,
        game: undefined,
        replayActionIndex: undefined,
        startDate: state.startDate,
        startTime: state.startTime || Date.now(),
        finishTime: undefined,
        state: "in-progress",
      };
    }
    case "revealCell": {
      if (!state.board || !state.boardConfiguration) {
        throw new Error("Game not started");
      }

      const board = state.actions.some(({ type }) => type === "revealCell")
        ? revealCell(state.board, action.payload.id)
        : revealCell(
            mineBoard(state.boardConfiguration, state.board, action.payload.id),
            action.payload.id
          );

      const didLoseGame = board.some(
        (cell) => cell.state === "visible" && cell.type === "mine"
      );

      const didWinGame =
        !didLoseGame &&
        board
          .filter((cell) => cell.state === "hidden")
          .every((cell) => cell.type === "mine");

      const didFinishGame = didLoseGame || didWinGame;

      return {
        actions,
        board: didFinishGame
          ? board.map((cell) => ({
              ...cell,
              state:
                cell.type !== "mine"
                  ? cell.state
                  : didWinGame
                  ? "flag"
                  : "visible",
            }))
          : board,
        boardConfiguration: state.boardConfiguration,
        game: didFinishGame
          ? {
              actions: state.actions,
              boardConfiguration: state.boardConfiguration,
              startDate: state.startDate || new Date().toISOString(),
              startTime: state.startTime || Date.now(),
              finishTime: Date.now(),
            }
          : undefined,
        replayActionIndex: undefined,
        startDate: state.startDate,
        startTime: state.startTime || Date.now(),
        finishTime: didFinishGame ? Date.now() : undefined,
        state: didLoseGame ? "lose" : didWinGame ? "win" : "in-progress",
      };
    }
  }
}

export type UseBoard = ReturnType<typeof useBoard>;

export function useBoard() {
  const [
    {
      actions,
      board,
      boardConfiguration,
      game,
      replayActionIndex,
      startDate,
      startTime,
      finishTime,
      state,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (
      boardConfiguration?.type !== "daily" ||
      actions.filter(({ type }) => type === "revealCell").length > 0
    ) {
      return;
    }

    const initialCellId = board?.at(0)?.id;

    if (!initialCellId) {
      return;
    }

    dispatch({ type: "revealCell", payload: { id: initialCellId } });
  }, [actions, board, boardConfiguration?.type]);

  useEffect(() => {
    if (
      !boardConfiguration ||
      !startDate ||
      !startTime ||
      !finishTime ||
      boardConfiguration.type === "replay" ||
      state !== "win"
    ) {
      return;
    }

    addToLeaderboard({
      actions,
      boardConfiguration,
      startDate,
      startTime,
      finishTime,
    });
  }, [actions, boardConfiguration, finishTime, startDate, startTime, state]);

  useEffect(() => {
    if (typeof replayActionIndex !== "number") {
      return;
    }

    const action = actions.at(replayActionIndex);

    if (!action) {
      return;
    }

    const timeoutId = setTimeout(() => {
      switch (action.type) {
        case "flagCell": {
          dispatch({ type: "flagCell", payload: { id: action.payload.id } });

          break;
        }
        case "revealCell": {
          dispatch({ type: "revealCell", payload: { id: action.payload.id } });

          break;
        }
      }
    }, action.elapsedTime);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [actions, replayActionIndex]);

  return {
    board,
    boardConfiguration,
    game,
    startTime,
    finishTime,
    state,
    newGame() {
      dispatch({ type: "newGame" });
    },
    startGame(boardConfiguration: BoardConfiguration) {
      dispatch({
        type: "startGame",
        payload: { boardConfiguration },
      });
    },
    flagCell(id: string) {
      dispatch({ type: "flagCell", payload: { id } });
    },
    revealCell(id: string) {
      dispatch({ type: "revealCell", payload: { id } });
    },
    startReplay: useCallback((leaderboardItem: LeaderboardItem) => {
      dispatch({ type: "startReplay", payload: leaderboardItem });
    }, []),
    restartReplay() {
      dispatch({ type: "restartReplay" });
    },
  };
}
