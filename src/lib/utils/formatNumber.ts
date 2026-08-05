/** Compact number display: 3400 -> "3.4k", 240 -> "240". */
export function formatCompact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
}
