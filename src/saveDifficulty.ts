export function saveDifficulty(difficulty: string) {
  try {
    localStorage.setItem("difficulty", difficulty);
  } catch {
    // Some browsers throw in private mode
  }
}
