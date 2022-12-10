import { useCallback, useEffect, useState } from "react";

type Cell = {
  id: string;
  directNeighbors: string[];
  neighbors: string[];
  state: "hidden" | "flag" | "visible";
  type: "bomb" | "safe";
  value: number;
  x: number;
  y: number;
};

function getGrid(gridSize: number): Cell[] {
  return Array.from(Array(gridSize * gridSize))
    .map((_, i) => {
      const x = i % gridSize;
      const y = Math.floor(i / gridSize);

      return {
        id: `${x},${y}`,
        directNeighbors: [
          [0, -1],
          [-1, 0],
          // [0, 0],
          [1, 0],
          [0, 1],
        ]
          .map(([nx, ny]) => [x + nx, y + ny])
          .filter(([nx, ny]) => nx >= 0 && ny >= 0)
          .map(([nx, ny]) => `${nx},${ny}`),
        neighbors: [
          [-1, -1],
          [0, -1],
          [1, -1],
          [-1, 0],
          // [0, 0],
          [1, 0],
          [-1, 1],
          [0, 1],
          [1, 1],
        ]
          .map(([nx, ny]) => [x + nx, y + ny])
          .filter(([nx, ny]) => nx >= 0 && ny >= 0)
          .map(([nx, ny]) => `${nx},${ny}`),
        state: "hidden" as const,
        type: Math.random() > 0.9 ? ("bomb" as const) : ("safe" as const),
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

function App() {
  const [gridSize, setGridSize] = useState(16);
  const [grid, setGrid] = useState(getGrid(gridSize));

  useEffect(() => {
    setGrid(getGrid(gridSize));
  }, [gridSize]);

  const revealCell = useCallback((id: string) => {
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

      const getSafeCellIds = (safeCellIds: string[]): string[] => {
        const cells = grid
          .filter(({ id, directNeighbors, type, value }) => {
            // ℹ️ Remove value > 0 to resolve the grid
            if (type === "bomb" || value > 0) {
              return false;
            }

            if (safeCellIds.includes(id)) {
              return false;
            }

            return directNeighbors.some((id) => safeCellIds.includes(id));
          })
          .map(({ id }) => id);

        if (cells.length === 0) {
          return safeCellIds;
        }

        return getSafeCellIds(safeCellIds.concat(cells));
      };

      const safeCellIds = getSafeCellIds([targetCell.id]);

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
  }, []);

  const flagCell = useCallback((id: string) => {
    setGrid((grid) => {
      return grid.map((cell) => {
        if (cell.id === id) {
          return {
            ...cell,
            state: "flag",
          };
        }

        return cell;
      });
    });
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
      <label className="flex items-center gap-2 text-gray-300">
        Grid size
        <input
          className="rounded px-2 py-1 text-gray-900"
          max={24}
          min={8}
          onChange={({ target: { value } }) => setGridSize(Number(value))}
          step={1}
          type="number"
          value={gridSize}
        />
      </label>
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
                : "bg-gray-300 text-gray-900",
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
              <span>{type === "bomb" ? "💣" : value}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
