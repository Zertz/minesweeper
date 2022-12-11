import { useRef } from "react";
import { getDefaultBoardSize } from "./getDefaultBoardSize";
import {
  isBoardSizeValid,
  maxBoardSize,
  minBoardSize,
} from "./isBoardSizeValid";
import { UseBoard } from "./useBoard";

const defaultBoardSize = getDefaultBoardSize();

export function StartGame({ startGame }: Pick<UseBoard, "startGame">) {
  const boardSizeInputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      className="m-auto flex items-center gap-2 px-4 text-gray-300"
      onSubmit={(e) => {
        e.preventDefault();

        const inputBoardSize = Number(boardSizeInputRef.current?.value);

        if (!isBoardSizeValid(inputBoardSize)) {
          return;
        }

        startGame(inputBoardSize);
      }}
    >
      <label htmlFor="board-size">Board size</label>
      <input
        autoFocus
        className="rounded px-2 py-1 text-gray-900"
        defaultValue={defaultBoardSize}
        id="board-size"
        max={maxBoardSize}
        min={minBoardSize}
        ref={boardSizeInputRef}
        required
        step={1}
        type="number"
      />
      <button
        className="rounded border border-gray-300 bg-gray-700 px-2 py-1 text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-600"
        type="submit"
      >
        Start
      </button>
    </form>
  );
}
