import { Cell } from "./types";

const safeRatio = 0.8;

export function getBoard(boardSize: number): Cell[] {
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
