import {
  isBoardSizeValid,
  maxBoardSize,
  minBoardSize,
} from "./isBoardSizeValid";
import { saveBoardSize } from "./saveBoardSize";

export function getDefaultBoardSize() {
  const boardSize = Number(localStorage.getItem("boardSize"));

  if (isBoardSizeValid(boardSize)) {
    return boardSize;
  }

  const medianBoardSize = minBoardSize + (maxBoardSize - minBoardSize) / 2;

  saveBoardSize(medianBoardSize);

  return medianBoardSize;
}
