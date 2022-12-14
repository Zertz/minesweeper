import { difficulties } from "./difficulties";
import { saveDifficulty } from "./saveDifficulty";

const defaultDifficulty = difficulties[0].id;

export function getSavedDifficulty() {
  const difficulty = localStorage.getItem("difficulty");

  if (difficulty && difficulties.find(({ id }) => id === difficulty)) {
    return difficulty;
  }

  saveDifficulty(defaultDifficulty);

  return defaultDifficulty;
}
