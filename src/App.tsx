import { Board } from "./Board";
import { Home } from "./Home";
import { useBoard } from "./useBoard";

export function App() {
  const { startGame, startReplay, ...rest } = useBoard();

  if (rest.state !== "idle") {
    return <Board startReplay={startReplay} {...rest} />;
  }

  return (
    <div className="m-auto flex w-full max-w-xs flex-col gap-6">
      <Home startGame={startGame} startReplay={startReplay} />
    </div>
  );
}
