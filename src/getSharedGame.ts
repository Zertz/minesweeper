import { StoredGameResult } from "./types";

export function getSharedGame() {
  const searchParams = new URLSearchParams(window.location.search);

  const game = searchParams.get("game");

  window.history.pushState({}, document.title, window.location.pathname);

  if (!game) {
    return;
  }

  try {
    return StoredGameResult.parse(JSON.parse(decodeURIComponent(game)));
  } catch (e) {
    console.error(e);
  }
}
