import { BoardConfiguration, Cell } from "./types";

export function getEmptyBoard(boardConfiguration: BoardConfiguration): Cell[] {
  return Array.from(
    Array(boardConfiguration.x * boardConfiguration.y)
  ).map<Cell>((_, i) => {
    const x = i % boardConfiguration.x;
    const y = Math.floor(i / boardConfiguration.x);

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
      order: i,
      state: "hidden",
      type: "safe",
      value: 0,
      x,
      y,
    };
  });
}
