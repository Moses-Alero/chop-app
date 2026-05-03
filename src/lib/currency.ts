import type { Money } from "../types/domain";

export function formatMoney(value: Money): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: value.currency,
    maximumFractionDigits: 0,
  }).format(value.amount);
}

export function money(amount: number): Money {
  return { currency: "NGN", amount };
}
