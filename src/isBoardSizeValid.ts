export const minBoardSize = 8;
export const maxBoardSize = 24;

export function isBoardSizeValid(boardSize: number) {
  return (
    Number.isInteger(boardSize) &&
    boardSize >= minBoardSize &&
    boardSize <= maxBoardSize
  );
}
