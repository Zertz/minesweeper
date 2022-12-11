import { useReducer } from "react";
import { flagCell } from "./flagCell";
import { getBoard } from "./getBoard";
import { revealCell } from "./revealCell";
import { saveBoardSize } from "./saveBoardSize";
import { Cell } from "./types";

type Action =
  | {
      type: "newGame";
    }
  | {
      type: "startGame";
      payload: {
        boardSize: number;
      };
    }
  | {
      type: "restartGame";
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

type State = {
  board: Cell[] | undefined;
  boardSize: number | undefined;
  startTime: number | undefined;
  finishTime: number | undefined;
  state: "idle" | "in-progress" | "win" | "lose";
};

const initialState = {
  board: undefined,
  boardSize: undefined,
  startTime: undefined,
  finishTime: undefined,
  state: "idle" as const,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "newGame": {
      return initialState;
    }
    case "startGame": {
      return {
        board: getBoard(action.payload.boardSize),
        boardSize: action.payload.boardSize,
        startTime: Date.now(),
        finishTime: undefined,
        state: "in-progress",
      };
    }
    case "restartGame": {
      if (!state.board) {
        throw new Error("Game not started");
      }

      return {
        board: state.board.map((cell) => ({ ...cell, state: "hidden" })),
        boardSize: state.boardSize,
        startTime: undefined,
        finishTime: undefined,
        state: "in-progress",
      };
    }
    case "flagCell": {
      if (!state.board) {
        throw new Error("Game not started");
      }

      return {
        board: flagCell(state.board, action.payload.id),
        boardSize: state.boardSize,
        startTime: state.startTime,
        finishTime: undefined,
        state: "in-progress",
      };
    }
    case "revealCell": {
      if (!state.board) {
        throw new Error("Game not started");
      }

      const board = revealCell(state.board, action.payload.id);

      const didLoseGame = board.some(
        (cell) => cell.state === "visible" && cell.type === "bomb"
      );

      const didWinGame =
        !didLoseGame &&
        board
          .filter((cell) => cell.state === "hidden")
          .every((cell) => cell.type === "bomb");

      return {
        board: revealCell(state.board, action.payload.id),
        boardSize: state.boardSize,
        startTime: state.startTime || Date.now(),
        finishTime: didLoseGame || didWinGame ? Date.now() : undefined,
        state: didLoseGame ? "lose" : didWinGame ? "win" : "in-progress",
      };
    }
  }
}

export type UseBoard = ReturnType<typeof useBoard>;

export function useBoard() {
  const [{ board, boardSize, startTime, finishTime, state }, dispatch] =
    useReducer(reducer, initialState);

  return {
    board,
    boardSize,
    startTime,
    finishTime,
    state,
    newGame() {
      dispatch({ type: "newGame" });
    },
    startGame(boardSize: number) {
      dispatch({ type: "startGame", payload: { boardSize } });

      saveBoardSize(boardSize);
    },
    flagCell(id: string) {
      dispatch({ type: "flagCell", payload: { id } });
    },
    revealCell(id: string) {
      dispatch({ type: "revealCell", payload: { id } });
    },
  };
}
