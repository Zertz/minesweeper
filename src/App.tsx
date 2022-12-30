import { useEffect } from "react";
import { Board } from "./Board";
import { getSharedGame } from "./getSharedGame";
import { Home } from "./Home";
import { Language, languages, t } from "./i18n";
import { Play } from "./Play";
import { Replay } from "./Replay";
import { useBoard } from "./useBoard";
import { useLanguage } from "./useLanguage";
import { TranslationProvider } from "./useTranslation";

export function App() {
  const [language, setLanguage] = useLanguage();

  const {
    board,
    boardConfiguration,
    game,
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

  const isReplay = boardConfiguration?.type === "replay";

  return (
    <>
      <TranslationProvider language={language}>
        {state === "idle" ? (
          <Home startGame={startGame} startReplay={startReplay} />
        ) : (
          <>
            {isReplay ? (
              <Replay
                board={board}
                startTime={startTime}
                finishTime={finishTime}
                newGame={newGame}
                restartReplay={restartReplay}
              />
            ) : (
              <Play
                game={game}
                startGame={startGame}
                state={state}
                newGame={newGame}
              />
            )}
            <Board
              board={board}
              boardConfiguration={boardConfiguration}
              disabled={isReplay}
              flagCell={flagCell}
              revealCell={revealCell}
            />
          </>
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
