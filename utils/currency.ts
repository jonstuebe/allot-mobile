/**
 * Converts dollars to cents
 * @param dollars The amount in dollars (can be a decimal)
 * @returns The amount in cents as an integer
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Converts cents to a formatted dollar string
 * @param cents The amount in cents
 * @returns A formatted string with the dollar amount (e.g., "$1,234.56")
 */
export function centsToDollars(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

/**
 * Formats a number as a currency string
 * @param amount The amount in dollars
 * @returns A formatted string with the dollar amount (e.g., "$1,234.56")
 */
export function formatDollars(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
