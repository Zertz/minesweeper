import { getDefaultBoardSize } from "./getDefaultBoardSize";
import {
  isBoardSizeValid,
  maxBoardSize,
  minBoardSize,
} from "./isBoardSizeValid";
import { UseBoard } from "./useBoard";

export function StartGame({ startGame }: Pick<UseBoard, "startGame">) {
  const defaultBoardSize = getDefaultBoardSize();

  return (
    <form
      className="m-auto flex flex-col gap-4 px-4 text-gray-300"
      onSubmit={(e) => {
        e.preventDefault();

        const { customSize, size } = Object.fromEntries(
          new FormData(e.currentTarget).entries()
        );

        const inputBoardSize = Number(size || customSize);

        if (!isBoardSizeValid(inputBoardSize)) {
          return;
        }

        startGame(inputBoardSize);
      }}
    >
      <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:grid-cols-4 sm:grid-rows-1">
        <input
          className="hidden"
          defaultChecked={defaultBoardSize === 8}
          id="size-sm"
          name="size"
          type="radio"
          value="8"
        />
        <label
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 bg-gray-700 p-4 text-gray-300 hover:border-gray-200 hover:bg-gray-600"
          htmlFor="size-sm"
        >
          <strong>Small</strong>
          <span>8x8</span>
        </label>
        <input
          className="hidden"
          defaultChecked={defaultBoardSize === 16}
          id="size-md"
          name="size"
          type="radio"
          value="16"
        />
        <label
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 bg-gray-700 p-4 text-gray-300 hover:border-gray-200 hover:bg-gray-600"
          htmlFor="size-md"
        >
          <strong>Medium</strong>
          <span>16x16</span>
        </label>
        <input
          className="hidden"
          defaultChecked={defaultBoardSize === 24}
          id="size-lg"
          name="size"
          type="radio"
          value="24"
        />
        <label
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 bg-gray-700 p-4 text-gray-300 hover:border-gray-200 hover:bg-gray-600"
          htmlFor="size-lg"
        >
          <strong>Large</strong>
          <span>24x24</span>
        </label>
        <label className="sr-only" htmlFor="size-custom-input">
          Custom board size
        </label>
        <input
          className="hidden"
          defaultChecked={![8, 16, 24].includes(defaultBoardSize)}
          id="size-custom"
          name="size"
          type="radio"
          value=""
        />
        <label
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 bg-gray-700 p-4 text-gray-300 hover:border-gray-200 hover:bg-gray-600"
          htmlFor="size-custom"
        >
          <strong>Custom</strong>
          <input
            className="rounded px-2 py-1 text-gray-900"
            defaultValue={defaultBoardSize}
            id="size-custom-input"
            max={maxBoardSize}
            min={minBoardSize}
            name="customSize"
            required
            step={1}
            type="number"
          />
        </label>
      </div>
      <button
        className="rounded border border-gray-300 bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
        type="submit"
      >
        Start
      </button>
    </form>
  );
}
