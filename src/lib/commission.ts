// Commission rate — override via env var (default 15%)
const RATE = parseFloat(process.env.COMMISSION_RATE ?? "0.15");

export function calcCommission(totalPrice: number, rate = RATE): number {
  return Math.round(totalPrice * rate);
}

export function calcProviderPayout(totalPrice: number, rate = RATE): number {
  return totalPrice - calcCommission(totalPrice, rate);
}
