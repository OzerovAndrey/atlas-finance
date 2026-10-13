import seed from "../data/seed.json";

const locale = seed.meta.locale;

/** Amounts are integer minor units; format only through Intl. */
export function formatMoney(minor: number, currency: string, signed = false): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    signDisplay: signed ? "exceptZero" : "auto",
  }).format(minor / 100);
}

export function formatPercent(value: number, signed = false): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 1,
    signDisplay: signed ? "exceptZero" : "auto",
  }).format(value / 100);
}

export function formatDay(iso: string): string {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(new Date(iso));
}

export function formatMonth(iso: string): string {
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(new Date(iso));
}
