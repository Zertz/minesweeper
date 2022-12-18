import { Board } from "./Board";
import { StartGame } from "./StartGame";
import { useBoard } from "./useBoard";

export function App() {
  const { startGame, ...rest } = useBoard();

  return rest.state === "idle" ? (
    <StartGame startGame={startGame} />
  ) : (
    <Board {...rest} />
  );
}
