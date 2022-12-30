import { encodeActions, LeaderboardItem } from "./leaderboard";

export function getShareURL({ actions, ...rest }: LeaderboardItem) {
  return `/?game=${encodeURIComponent(
    JSON.stringify({ actions: encodeActions(actions), ...rest })
  )}`;
}

export function share(game: LeaderboardItem) {
  const shareUrl = `${window.location.origin}${getShareURL(game)}`;

  if (navigator.share) {
    navigator.share({
      url: shareUrl,
    });
  } else {
    navigator.clipboard
      .writeText(shareUrl)
      .then(console.info)
      .catch(console.error);
  }
}
