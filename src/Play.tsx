import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { difficulties } from "./difficulties";
import { Game } from "./Game";
import { getSeed, seedLength } from "./getSeed";
import { UseBoard } from "./useBoard";

export function Play({
  game,
  startGame,
  state,
  ...params
}: { difficulty: string; seed: string | undefined } & Pick<
  UseBoard,
  "game" | "startGame" | "state"
>) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!params.seed) {
      setLocation(`/play/${params.difficulty}/${getSeed()}`);

      return;
    }

    const seed = Number(params.seed);

    if (!Number.isInteger(seed) || `${seed}`.length !== seedLength) {
      console.warn(`Invalid seed: ${params.seed}`);

      setLocation("/");

      return;
    }

    const boardConfiguration = difficulties.find(
      (config) => config.difficulty.toLowerCase() === params.difficulty
    );

    if (!boardConfiguration) {
      console.warn(`Invalid difficulty: ${params.difficulty}`);

      setLocation("/");

      return;
    }

    startGame({
      ...boardConfiguration,
      id: crypto.randomUUID(),
      seed,
      type: "random",
    });
  }, [params.difficulty, params.seed, setLocation, startGame]);

  return (
    <Game game={game} state={state}>
      <Link
        className="rounded border border-gray-300 bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
        hidden={state !== "lose"}
        href={`/play/${game?.boardConfiguration.difficulty.toLowerCase()}`}
      >
        &#8635; New game
      </Link>
    </Game>
  );
}
