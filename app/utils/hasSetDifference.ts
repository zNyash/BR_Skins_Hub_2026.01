export function hasSetDifference<T>(left: readonly T[], right: readonly T[]): boolean {
  const leftSet = new Set(left);
  const rightSet = new Set(right);

  if (leftSet.size !== rightSet.size) return true;

  for (const value of leftSet) {
    if (!rightSet.has(value)) return true;
  }

  return false;
}
