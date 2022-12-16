import { MersenneTwister } from "./mersenne-twister";
import { BoardConfiguration, Cell } from "./types";

function shuffleArray<T>(array: T[], seed: number) {
  const ms = new MersenneTwister(seed);

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(ms.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export function mineBoard(
  boardConfiguration: BoardConfiguration,
  board: Cell[],
  initialCellId: string
): Cell[] {
  let mines = 0;

  // Because a set number of mines is required, Math.random() alone is not great
  // because it will most often create boards with mines heavily biased towards
  // the upper rows. By shuffling the board with a good enough algorith, the right
  // number of mines can be distributed linearly and then the board can be sorted
  // back to it's original state.
  return shuffleArray([...board], boardConfiguration.seed)
    .map<Cell>((cell) => {
      if (initialCellId === cell.id || mines === boardConfiguration.mines) {
        return {
          ...cell,
          type: "safe",
        };
      }

      mines += 1;

      return {
        ...cell,
        type: "mine",
      };
    })
    .map((cell, _, board) => ({
      ...cell,
      value: board.filter(
        ({ id, type }) => type === "mine" && cell.neighbors.includes(id)
      ).length,
    }))
    .sort((a, b) => a.order - b.order);
}
