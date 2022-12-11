import { Board } from "./Board";
import { StartGame } from "./StartGame";
import { useBoard } from "./useBoard";

export default function App() {
  const { board, startGame, ...rest } = useBoard();

  if (!board) {
    return <StartGame startGame={startGame} />;
  }

  return <Board board={board} {...rest} />;
}
