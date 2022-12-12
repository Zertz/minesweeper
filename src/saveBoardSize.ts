export function saveBoardSize(boardSize: number) {
  try {
    localStorage.setItem("boardSize", `${boardSize}`);
  } catch {
    // Some browsers throw in private mode
  }
}
