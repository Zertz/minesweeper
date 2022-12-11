import { useReducer, useRef } from "react";

type Cell = {
  id: string;
  neighbors: string[];
  state: "hidden" | "flag" | "visible";
  type: "bomb" | "safe";
  value: number;
  x: number;
  y: number;
};

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

const minBoardSize = 8;
const maxBoardSize = 24;
const safeRatio = 0.8;

function getBoard(boardSize: number): Cell[] {
  return Array.from(Array(boardSize * boardSize))
    .map((_, i) => {
      const x = i % boardSize;
      const y = Math.floor(i / boardSize);

      return {
        id: `${x},${y}`,
        neighbors: [
          [-1, -1],
          [0, -1],
          [1, -1],
          [1, 0],
          [1, 1],
          [0, 1],
          [-1, 1],
          [-1, 0],
        ]
          .map(([nx, ny]) => [x + nx, y + ny])
          .filter(([nx, ny]) => nx >= 0 && ny >= 0)
          .map(([nx, ny]) => `${nx},${ny}`),
        state: "hidden" as const,
        type: Math.random() > safeRatio ? ("bomb" as const) : ("safe" as const),
        x,
        y,
      };
    })
    .map((cell, _, board) => ({
      ...cell,
      value: board.filter(
        ({ id, type }) => type === "bomb" && cell.neighbors.includes(id)
      ).length,
    }));
}

function isBoardSizeValid(boardSize: number) {
  return (
    Number.isInteger(boardSize) &&
    boardSize >= minBoardSize &&
    boardSize <= maxBoardSize
  );
}

function saveBoardSize(boardSize: number) {
  try {
    localStorage.setItem("boardSize", `${boardSize}`);
  } catch {}
}

function flagCell(board: Cell[], id: string): Cell[] {
  return board.map((cell) => {
    if (cell.id === id) {
      return {
        ...cell,
        state:
          cell.state === "hidden"
            ? "flag"
            : cell.state === "flag"
            ? "hidden"
            : cell.state,
      };
    }

    return cell;
  });
}

function revealCell(board: Cell[], id: string): Cell[] {
  const targetCell = board.find((cell) => cell.id === id);

  if (!targetCell) {
    return board;
  }

  if (targetCell.state === "flag") {
    return board.map((cell) => {
      if (cell.id === id) {
        return {
          ...cell,
          state: "hidden",
        };
      }

      return cell;
    });
  }

  if (targetCell.type === "bomb" || targetCell.value > 0) {
    return board.map((cell) => {
      if (cell.id === id) {
        return {
          ...cell,
          state: "visible",
        };
      }

      return cell;
    });
  }

  const getSafeCellIds = (safeCells: Cell[]): string[] => {
    const safeCellIds = safeCells.map(({ id }) => id);

    const safeNeighborIds = safeCells
      // ℹ️ Remove this filter to instantly resolve the game
      .filter(({ value }) => value === 0)
      .map(({ id }) => id);

    const cells = board.filter(({ id, neighbors, type }) => {
      if (type === "bomb" || safeCellIds.includes(id)) {
        return false;
      }

      return neighbors.some((id) => safeNeighborIds.includes(id));
    });

    if (cells.length === 0) {
      return safeCellIds;
    }

    return getSafeCellIds(safeCells.concat(cells));
  };

  const safeCellIds = getSafeCellIds([targetCell]);

  return board.map((cell) => {
    if (safeCellIds.includes(cell.id)) {
      return {
        ...cell,
        state: "visible",
      };
    }

    return cell;
  });
}

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

const defaultBoardSize = (() => {
  const boardSize = Number(localStorage.getItem("boardSize"));

  if (isBoardSizeValid(boardSize)) {
    return boardSize;
  }

  const medianBoardSize = minBoardSize + (maxBoardSize - minBoardSize) / 2;

  saveBoardSize(medianBoardSize);

  return medianBoardSize;
})();

export default function App() {
  const boardSizeInputRef = useRef<HTMLInputElement>(null);

  const [{ board, boardSize, startTime, finishTime, state }, dispatch] =
    useReducer(reducer, initialState);

  if (!board) {
    return (
      <form
        className="m-auto flex items-center gap-2 px-4 text-gray-300"
        onSubmit={(e) => {
          e.preventDefault();

          const inputBoardSize = Number(boardSizeInputRef.current?.value);

          if (!isBoardSizeValid(inputBoardSize)) {
            return;
          }

          dispatch({
            type: "startGame",
            payload: {
              boardSize: inputBoardSize,
            },
          });

          saveBoardSize(inputBoardSize);
        }}
      >
        <label htmlFor="board-size">Board size</label>
        <input
          autoFocus
          className="rounded px-2 py-1 text-gray-900"
          defaultValue={defaultBoardSize}
          id="board-size"
          max={maxBoardSize}
          min={minBoardSize}
          ref={boardSizeInputRef}
          required
          step={1}
          type="number"
        />
        <button
          className="rounded border border-gray-300 bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
          type="submit"
        >
          Start
        </button>
      </form>
    );
  }

  return (
    <>
      {startTime && finishTime && (
        <div className="absolute inset-0 flex scale-150 flex-col items-center justify-center bg-gray-700/75 text-gray-300">
          <span className="mb-4 text-7xl">{state === "win" ? "🎉" : "💥"}</span>
          <span className="text-xl">
            {state === "win"
              ? "Awesome! You finished in"
              : "Oh no! You blew it in"}
          </span>
          <span className="text-xl">{`${Math.round(
            (finishTime - startTime) / 1000
          )} seconds!`}</span>
          <button
            className="mt-4 rounded border border-gray-300 bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
            onClick={() => dispatch({ type: "newGame" })}
            type="button"
          >
            New game
          </button>
        </div>
      )}
      <div
        className="m-auto grid w-min select-none gap-1 px-4 text-center"
        style={{
          gridTemplateRows: `repeat(${boardSize}, 1fr)`,
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
        }}
      >
        {board.map(({ id, state, type, value, x, y }, i) => (
          <button
            key={`${x},${y}`}
            className={[
              "cell",
              state !== "visible"
                ? "h"
                : type === "bomb"
                ? "bg-red-300"
                : value === 0
                ? "bg-gray-300"
                : value === 1
                ? "bg-orange-100"
                : value === 2
                ? "bg-orange-200"
                : value === 3
                ? "bg-orange-300"
                : "bg-orange-400",
            ].join(" ")}
            disabled={state === "visible"}
            onClick={() => dispatch({ type: "revealCell", payload: { id } })}
            onContextMenu={(e) => {
              e.preventDefault();

              dispatch({ type: "flagCell", payload: { id } });
            }}
          >
            {state === "hidden"
              ? null
              : state === "flag"
              ? "⛳️"
              : type === "bomb"
              ? "💣"
              : value || null}
          </button>
        ))}
      </div>
      <div className="sticky left-1/2 flex -translate-x-1/2 gap-4 self-center">
        <button
          className="rounded border border-gray-300 bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
          hidden={!!finishTime}
          onClick={() => dispatch({ type: "newGame" })}
          type="button"
        >
          New game
        </button>
      </div>
    </>
  );
}
