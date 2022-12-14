import { Cell } from "./types";

export function revealCell(board: Cell[], id: string): Cell[] {
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

  if (targetCell.type === "mine" || targetCell.value > 0) {
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
      if (type === "mine" || safeCellIds.includes(id)) {
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
