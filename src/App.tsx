import { Board } from "./Board";
import { Home } from "./Home";
import { useBoard } from "./useBoard";

export function App() {
  const { startGame, ...rest } = useBoard();

  if (rest.state !== "idle") {
    return <Board {...rest} />;
  }

  return (
    <div className="m-auto flex w-full max-w-xs flex-col gap-4">
      <Home startGame={startGame} />
    </div>
  );
}
