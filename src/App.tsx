import { Board } from "./Board";
import { StartGame } from "./StartGame";
import { useBoard } from "./useBoard";

export function App() {
  const { startGame, ...rest } = useBoard();

  return (
    <>
      <Board {...rest} />
      <StartGame startGame={startGame} state={rest.state} />
    </>
  );
}
