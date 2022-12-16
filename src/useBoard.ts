import { useEffect, useReducer } from "react";
import { addToLeaderboard } from "./addToLeaderboard";
import { flagCell } from "./flagCell";
import { getEmptyBoard } from "./getEmptyBoard";
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

type State = {
  board: Cell[] | undefined;
  boardConfiguration: BoardConfiguration | undefined;
  revealedCells: number;
  startDate: string | undefined;
  startTime: number | undefined;
  finishTime: number | undefined;
  state: "idle" | "in-progress" | "win" | "lose";
};

const initialState: State = {
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
        board: getEmptyBoard(action.payload.boardConfiguration),
        boardConfiguration: action.payload.boardConfiguration,
        revealedCells: 0,
        startDate: new Date().toISOString(),
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

      const nextState: State = {
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

      if (
        didWinGame &&
        nextState.boardConfiguration &&
        nextState.startDate &&
        nextState.startTime &&
        nextState.finishTime
      ) {
        addToLeaderboard({
          boardConfiguration: nextState.boardConfiguration,
          revealedCells: nextState.revealedCells,
          startDate: nextState.startDate,
          startTime: nextState.startTime,
          finishTime: nextState.finishTime,
        });
      }

      return nextState;
    }
  }
}

export type UseBoard = ReturnType<typeof useBoard>;

export function useBoard() {
  const [
    { board, boardConfiguration, revealedCells, startTime, finishTime, state },
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
