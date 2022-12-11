import { Cell } from "./types";

export function flagCell(board: Cell[], id: string): Cell[] {
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
