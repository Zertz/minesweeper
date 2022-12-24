import { useEffect } from "react";
import { getSharedGame } from "./getSharedGame";
import { Home } from "./Home";
import { Play } from "./Play";
import { Replay } from "./Replay";
import { useBoard } from "./useBoard";

export function App() {
  const {
    board,
    boardConfiguration,
    startTime,
    finishTime,
    state,
    newGame,
    startGame,
    flagCell,
    revealCell,
    startReplay,
    restartReplay,
  } = useBoard();

  useEffect(() => {
    const sharedGame = getSharedGame();

    if (!sharedGame) {
      return;
    }

    startReplay(sharedGame);
  }, [startReplay]);

  if (state !== "idle") {
    return boardConfiguration?.type === "replay" ? (
      <Replay
        board={board}
        boardConfiguration={boardConfiguration}
        startTime={startTime}
        finishTime={finishTime}
        newGame={newGame}
        flagCell={flagCell}
        revealCell={revealCell}
        restartReplay={restartReplay}
      />
    ) : (
      <Play
        board={board}
        boardConfiguration={boardConfiguration}
        startGame={startGame}
        startTime={startTime}
        finishTime={finishTime}
        state={state}
        newGame={newGame}
        flagCell={flagCell}
        revealCell={revealCell}
      />
    );
  }

  return <Home startGame={startGame} startReplay={startReplay} />;
}
