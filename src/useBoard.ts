import { useEffect, useReducer } from "react";
import { flagCell } from "./flagCell";
import { getEmptyBoard } from "./getEmptyBoard";
import { addToLeaderboard } from "./leaderboard";
import { mineBoard } from "./mineBoard";
import { revealCell } from "./revealCell";
import { BoardConfiguration, Cell } from "./types";

type Action =
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
  actions: (Action & { elapsedTime: number })[];
  board: Cell[] | undefined;
  boardConfiguration: BoardConfiguration | undefined;
  revealedCells: number;
  startDate: string | undefined;
  startTime: number | undefined;
  finishTime: number | undefined;
  state: "idle" | "in-progress" | "win" | "lose";
};

const initialState: State = {
  actions: [],
  board: undefined,
  boardConfiguration: undefined,
  revealedCells: 0,
  startDate: undefined,
  startTime: undefined,
  finishTime: undefined,
  state: "idle",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "newGame": {
      return initialState;
    }
    case "startGame": {
      return {
        actions: [],
        board: getEmptyBoard(action.payload.boardConfiguration),
        boardConfiguration: action.payload.boardConfiguration,
        revealedCells: 0,
        startDate: new Date().toISOString(),
        startTime: undefined,
        finishTime: undefined,
        state: "in-progress",
      };
    }
  }

  const actions = ["flagCell", "revealCell"].includes(action.type)
    ? state.actions.concat({
        ...action,
        elapsedTime: state.startTime ? Date.now() - state.startTime : 0,
      })
    : state.actions;

  switch (action.type) {
    case "flagCell": {
      if (!state.board) {
        throw new Error("Game not started");
      }

      return {
        actions,
        board: flagCell(state.board, action.payload.id),
        boardConfiguration: state.boardConfiguration,
        revealedCells: state.revealedCells,
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

      const board =
        state.revealedCells === 0
          ? revealCell(
              mineBoard(
                state.boardConfiguration,
                state.board,
                action.payload.id
              ),
              action.payload.id
            )
          : revealCell(state.board, action.payload.id);

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
        revealedCells: state.revealedCells + 1,
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
      revealedCells,
      startDate,
      startTime,
      finishTime,
      state,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (boardConfiguration?.type !== "daily" || revealedCells > 0) {
      return;
    }

    const initialCellId = board?.at(0)?.id;

    if (!initialCellId) {
      return;
    }

    dispatch({ type: "revealCell", payload: { id: initialCellId } });
  }, [board, boardConfiguration?.type, revealedCells]);

  useEffect(() => {
    if (
      !boardConfiguration ||
      !startDate ||
      !startTime ||
      !finishTime ||
      state !== "win"
    ) {
      return;
    }

    addToLeaderboard({
      actions,
      boardConfiguration,
      revealedCells,
      startDate,
      startTime,
      finishTime,
    });
  }, [
    actions,
    boardConfiguration,
    finishTime,
    revealedCells,
    startDate,
    startTime,
    state,
  ]);

  return {
    board,
    boardConfiguration,
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
  };
}
