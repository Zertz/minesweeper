import { useRef, useState } from "react";

type Cell = {
  id: string;
  neighbors: string[];
  state: "hidden" | "flag" | "visible";
  type: "bomb" | "safe";
  value: number;
  x: number;
  y: number;
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

export default function App() {
  const boardSizeInputRef = useRef<HTMLInputElement>(null);

  const [boardSize, setBoardSize] = useState(() => {
    const boardSize = Number(localStorage.getItem("boardSize"));

    if (isBoardSizeValid(boardSize)) {
      return boardSize;
    }

    const medianBoardSize = minBoardSize + (maxBoardSize - minBoardSize) / 2;

    saveBoardSize(medianBoardSize);

    return medianBoardSize;
  });

  const [board, setBoard] = useState<Cell[]>();

  if (!board) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 py-4">
        <form
          className="flex items-center gap-2 px-4 text-gray-300"
          onSubmit={(e) => {
            e.preventDefault();

            const inputBoardSize = Number(boardSizeInputRef.current?.value);

            if (!isBoardSizeValid(inputBoardSize)) {
              return;
            }

            setBoardSize(inputBoardSize);
            setBoard(getBoard(inputBoardSize));

            saveBoardSize(inputBoardSize);
          }}
        >
          <label htmlFor="board-size">Board size</label>
          <input
            autoFocus
            className="rounded px-2 py-1 text-gray-900"
            defaultValue={boardSize}
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
      </div>
    );
  }

  const revealCell = (id: string) => {
    setBoard((board) => {
      if (!board) {
        return;
      }

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
    });
  };

  const flagCell = (id: string) => {
    setBoard((board) => {
      if (!board) {
        return;
      }

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
    });
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <div
        className="mx-auto grid w-min select-none gap-1 px-4 text-center"
        style={{
          gridTemplateRows: `repeat(${boardSize}, 1fr)`,
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
        }}
      >
        {board.map(({ id, state, type, value, x, y }, i) => (
          <button
            key={`${x},${y}`}
            className={[
              "flex aspect-square w-8 items-center justify-center rounded border border-gray-300 p-1 transition-colors",
              state !== "visible"
                ? "bg-gray-700 hover:border-gray-200 hover:bg-gray-600"
                : type === "bomb"
                ? "bg-red-300"
                : [
                    "text-gray-900",
                    value === 0
                      ? "bg-gray-300"
                      : value === 1
                      ? "bg-orange-100"
                      : value === 2
                      ? "bg-orange-200"
                      : value === 3
                      ? "bg-orange-300"
                      : "bg-orange-400",
                  ].join(" "),
            ].join(" ")}
            disabled={state === "visible"}
            onClick={() => revealCell(id)}
            onContextMenu={(e) => {
              e.preventDefault();

              flagCell(id);
            }}
            type="button"
          >
            {state === "hidden" ? (
              <span className="invisible">💣</span>
            ) : state === "flag" ? (
              <span>⛳️</span>
            ) : (
              <span>{type === "bomb" ? "💣" : value || null}</span>
            )}
          </button>
        ))}
      </div>
      <button
        className="self-center rounded border border-gray-300 bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
        onClick={() => setBoard(undefined)}
        type="button"
      >
        Restart
      </button>
    </div>
  );
}
