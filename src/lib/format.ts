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

/** Masked amount for "Hide balances": keeps the currency symbol, hides digits. */
export function formatHidden(currency: string): string {
  const symbol = formatMoney(0, currency).replace(/[\d.,\s]/g, "");
  return `${symbol} ••••`;
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(iso),
  );
}

/** Parses user input like "1 250,50" or "1250.5" into integer minor units; null when invalid. */
export function parseAmountMinor(input: string): number | null {
  const s = input.trim().replace(/\s/g, "");
  if (!/^\d+([.,]\d{1,2})?$/.test(s)) return null;
  const [whole = "0", frac = ""] = s.replace(",", ".").split(".");
  return Number(whole) * 100 + Number(frac.padEnd(2, "0"));
}
