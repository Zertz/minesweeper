import { useEffect, useState } from "react";
import { getSharedGame } from "./getSharedGame";
import { Home } from "./Home";
import { defaultLanguage, Language, languages, t } from "./i18n";
import { Play } from "./Play";
import { Replay } from "./Replay";
import { useBoard } from "./useBoard";
import { TranslationProvider } from "./useTranslation";

export function App() {
  const [language, setLanguage] = useState(defaultLanguage);

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

  return (
    <>
      <TranslationProvider language={language}>
        {state === "idle" ? (
          <Home startGame={startGame} startReplay={startReplay} />
        ) : boardConfiguration?.type === "replay" ? (
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
        )}
      </TranslationProvider>
      <label className="sr-only" htmlFor="language">
        {t("Language", language)}
      </label>
      <select
        id="language"
        className="my-4 mx-auto rounded border border-gray-300 bg-gray-700 p-1 text-sm text-gray-300"
        hidden={state !== "idle"}
        onChange={({ target: { value } }) => setLanguage(value as Language)}
        value={language}
      >
        {languages.map(({ k, v }) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>
    </>
  );
}
