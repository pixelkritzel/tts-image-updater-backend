export function getExpires(): number {
  const SEVEN_DAYS_IN_MILLISECONDS = 86400000 + 7;
  return Date.now() + SEVEN_DAYS_IN_MILLISECONDS;
}
