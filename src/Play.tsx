import { BackToMainMenu } from "./BackToMainMenu";
import { formatMilliseconds } from "./formatMilliseconds";
import { getSeed } from "./getSeed";
import { share } from "./share";
import { UseBoard } from "./useBoard";
import { useTranslation } from "./useTranslation";

export function Play({
  game,
  startGame,
  state,
  newGame,
}: Pick<UseBoard, "game" | "startGame" | "state" | "newGame">) {
  const t = useTranslation();

  return (
    <>
      <div className="flex gap-4 p-4 pb-2" hidden={state !== "in-progress"}>
        <BackToMainMenu hideLabel newGame={newGame} />
      </div>
      {game && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-700/75 text-gray-300">
          <span className="text-7xl">{state === "win" ? "🎉" : "💥"}</span>
          <span className="text-center text-2xl">
            {t(state === "win" ? "You won in" : "You lost in")}
            <br />
            {formatMilliseconds(game.finishTime - game.startTime)}
          </span>
          <button
            className="rounded border border-gray-300 bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
            hidden={state !== "win"}
            onClick={() => share(game)}
            type="button"
          >
            {t("Share replay")}
          </button>
          <button
            className="rounded border border-gray-300 bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
            hidden={state !== "lose"}
            onClick={() => {
              if (game.boardConfiguration.type === "daily") {
                startGame(game.boardConfiguration);

                return;
              }

              startGame({
                ...game.boardConfiguration,
                id: crypto.randomUUID(),
                seed: getSeed(),
                type: "random",
              });
            }}
            type="button"
          >
            &#8635;{" "}
            {t(
              game.boardConfiguration.type === "daily"
                ? "Try again"
                : "New game"
            )}
          </button>
          <BackToMainMenu newGame={newGame} />
        </div>
      )}
    </>
  );
}
