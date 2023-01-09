import { useCallback, useEffect } from "react";
import { difficulties } from "./difficulties";
import { Game } from "./Game";
import { UseBoard } from "./useBoard";

export function Daily({
  game,
  startGame,
  state,
}: Pick<UseBoard, "game" | "startGame" | "state">) {
  const startDaily = useCallback(() => {
    const now = new Date();

    startGame({
      ...difficulties[1],
      id: crypto.randomUUID(),
      seed: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0
      ).getTime(),
      type: "daily",
    });
  }, [startGame]);

  useEffect(() => {
    startDaily();
  }, [startDaily]);

  return (
    <Game game={game} state={state}>
      <button
        className="rounded border border-gray-300 bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
        hidden={state !== "lose"}
        onClick={startDaily}
        type="button"
      >
        &#8635; Try again
      </button>
    </Game>
  );
}
