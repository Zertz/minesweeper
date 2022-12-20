export function formatMilliseconds(ms: number) {
  const m = `${Math.floor(ms / 1000 / 60)}`.padStart(2, "0");
  const s = `${Math.floor(ms / 1000) % 60}`.padStart(2, "0");

  return `${m}:${s}.${`${ms % 1000}`.padEnd(3, "0")}`;
}
