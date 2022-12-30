export function isTruthy<T>(argument: T | null | undefined): argument is T {
  return !!argument;
}
