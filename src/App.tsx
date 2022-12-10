import { useEffect, useState } from "react";

type Cell = {
  id: string;
  neighbors: string[];
  state: "hidden" | "flag" | "visible";
  type: "bomb" | "safe";
  value: number;
  x: number;
  y: number;
};

const minGridSize = 8;
const maxGridSize = 24;
const safeRatio = 0.8;

function getGrid(gridSize: number): Cell[] {
  return Array.from(Array(gridSize * gridSize))
    .map((_, i) => {
      const x = i % gridSize;
      const y = Math.floor(i / gridSize);

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
    .map((cell, _, grid) => ({
      ...cell,
      value: grid.filter(
        ({ id, type }) => type === "bomb" && cell.neighbors.includes(id)
      ).length,
    }));
}

export default function App() {
  const [gridSize, setGridSize] = useState(() => {
    const gridSize = Number(localStorage.getItem("gridSize"));

    if (
      Number.isInteger(gridSize) &&
      gridSize >= minGridSize &&
      gridSize <= maxGridSize
    ) {
      return gridSize;
    }

    return minGridSize + (maxGridSize - minGridSize) / 2;
  });

  const [grid, setGrid] = useState<Cell[]>([]);

  useEffect(() => {
    localStorage.setItem("gridSize", `${gridSize}`);

    setGrid(getGrid(gridSize));
  }, [gridSize]);

  const revealCell = (id: string) => {
    setGrid((grid) => {
      const targetCell = grid.find((cell) => cell.id === id);

      if (!targetCell) {
        return grid;
      }

      if (targetCell.type === "bomb" || targetCell.value > 0) {
        return grid.map((cell) => {
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

        const cells = grid.filter(({ id, neighbors, type }) => {
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

      return grid.map((cell) => {
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
    setGrid((grid) => {
      return grid.map((cell) => {
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
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
      {grid.some(({ state }) => state !== "hidden") ? (
        <button
          className="rounded border border-gray-300 bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
          onClick={() => setGrid(getGrid(gridSize))}
        >
          Restart
        </button>
      ) : (
        <label className="flex items-center gap-2 text-gray-300">
          Grid size
          <input
            className="rounded px-2 py-1 text-gray-900"
            max={maxGridSize}
            min={minGridSize}
            onChange={({ target: { value } }) => setGridSize(Number(value))}
            step={1}
            type="number"
            value={gridSize}
          />
        </label>
      )}
      <div
        className="grid w-min items-center justify-center gap-1 text-center"
        style={{
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {grid.map(({ id, state, type, value, x, y }, i) => (
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
    </div>
  );
}
