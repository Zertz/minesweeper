import { Route, Switch } from "wouter";
import { Board } from "./Board";
import { Daily } from "./Daily";
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

  return (
    <TranslationProvider language={language}>
      <Switch>
        <Route path="/">
          <Home newGame={newGame} />
          <label className="sr-only" htmlFor="language">
            {t("Language", language)}
          </label>
          <select
            id="language"
            className="my-4 mx-auto rounded border border-gray-300 bg-gray-700 p-1 text-sm text-gray-300"
            onChange={({ target: { value } }) => setLanguage(value as Language)}
            value={language}
          >
            {languages.map(({ k, v }) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Route>
        <Route path="/daily">
          <Daily game={game} startGame={startGame} state={state} />
          <Board
            board={board}
            boardConfiguration={boardConfiguration}
            flagCell={flagCell}
            revealCell={revealCell}
          />
        </Route>
        <Route path="/replay">
          <Replay
            board={board}
            startTime={startTime}
            finishTime={finishTime}
            restartReplay={restartReplay}
            startReplay={startReplay}
          />
          <Board
            board={board}
            boardConfiguration={boardConfiguration}
            disabled
            flagCell={flagCell}
            revealCell={revealCell}
          />
        </Route>
        <Route path="/play/:difficulty/:seed?">
          {(params) => (
            <>
              <Play
                game={game}
                startGame={startGame}
                state={state}
                {...params}
              />
              <Board
                board={board}
                boardConfiguration={boardConfiguration}
                flagCell={flagCell}
                revealCell={revealCell}
              />
            </>
          )}
        </Route>
      </Switch>
    </TranslationProvider>
  );
}
