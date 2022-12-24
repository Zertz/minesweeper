import { UseBoard } from "./useBoard";

export function Board({
  board,
  boardConfiguration,
  disabled,
  flagCell,
  revealCell,
}: { disabled?: boolean } & Pick<
  UseBoard,
  "board" | "boardConfiguration" | "flagCell" | "revealCell"
>) {
  return (
    <fieldset
      className="m-auto grid w-min select-none gap-1 p-4 pt-2 text-center"
      disabled={disabled}
      style={{
        gridTemplateRows: `repeat(${boardConfiguration?.y}, 1fr)`,
        gridTemplateColumns: `repeat(${boardConfiguration?.x}, 1fr)`,
      }}
    >
      {board?.map(({ id, state, type, value }) => (
        <button
          key={id}
          className={[
            "cell",
            state !== "visible"
              ? "h"
              : type === "mine"
              ? "bg-red-300"
              : value === 0
              ? "bg-gray-300"
              : value === 1
              ? "bg-orange-100"
              : value === 2
              ? "bg-orange-200"
              : value === 3
              ? "bg-orange-300"
              : "bg-orange-400",
          ].join(" ")}
          disabled={state === "visible"}
          onClick={() => revealCell(id)}
          onContextMenu={(e) => {
            e.preventDefault();

            flagCell(id);
          }}
        >
          {state === "hidden"
            ? null
            : state === "flag"
            ? "⛳️"
            : type === "mine"
            ? "💣"
            : value || null}
        </button>
      ))}
    </fieldset>
  );
}
