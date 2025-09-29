/**
 * Format a with thousand K starting from 10000
 */
export function formatNumberWithKForThousands(number: number) {
  if (number >= 10000) {
    return `${(number / 1000).toFixed(1)}k`.replace(".0", "");
  }
  return number.toString();
}
