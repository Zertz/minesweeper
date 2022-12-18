import { difficulties } from "./difficulties";
import { UseBoard } from "./useBoard";

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function StartGame({ startGame }: Pick<UseBoard, "startGame">) {
  return (
    <div className="m-auto flex w-full max-w-xs flex-col gap-4 text-gray-300">
      <button
        className="mb-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 bg-gray-700 p-4 text-gray-300 hover:border-gray-200 hover:bg-gray-600"
        onClick={() => {
          const now = new Date();

          startGame({
            ...difficulties[1],
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
        }}
        type="button"
      >
        <strong className="text-lg">Daily challenge</strong>
      </button>
      {difficulties.map((boardConfiguration) => (
        <button
          key={boardConfiguration.id}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 bg-gray-700 p-4 text-gray-300 hover:border-gray-200 hover:bg-gray-600"
          onClick={() => {
            startGame({
              ...boardConfiguration,
              seed: Date.now() + getRandomInt(-1000, 1000),
              type: "random",
            });
          }}
          type="button"
        >
          <strong className="text-lg">{boardConfiguration.id}</strong>
          <span className="text-sm">{`${boardConfiguration.x}x${boardConfiguration.y} · ${boardConfiguration.mines} mines`}</span>
        </button>
      ))}
    </div>
  );
}
