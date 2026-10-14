import raw from "./seed.json";
import type { Account, Card, DemoSeed, Transaction } from "./types";

export const seed = raw as DemoSeed;

export interface Prefs {
  hideBalances: boolean;
  notifyPayments: boolean;
  reduceMotion: boolean;
}
export interface DemoState {
  accounts: Account[];
  cards: Card[];
  transactions: Transaction[];
  prefs: Prefs;
}

export const initialState = (): DemoState => ({
  accounts: structuredClone(seed.accounts),
  cards: structuredClone(seed.cards),
  transactions: structuredClone(seed.transactions),
  prefs: { hideBalances: false, notifyPayments: true, reduceMotion: false },
});

export const month = seed.meta.today.slice(0, 7);
const inMonth = (t: Transaction, ym = month) => t.date.startsWith(ym);
const completed = (t: Transaction) => t.status === "completed";

export const categoryName = (id: string) => seed.categories.find((c) => c.id === id)?.name ?? id;
export const accountName = (id: string) => seed.accounts.find((a) => a.id === id)?.name ?? id;
export const byDateDesc = (list: Transaction[]) =>
  [...list].sort((a, b) => b.date.localeCompare(a.date));

export const toBase = (minor: number, currency: string) =>
  Math.round(minor * (currency === seed.meta.currency ? 1 : (seed.fx[currency] ?? 1)));

export function monthSums(list: Transaction[], ym = month) {
  const tx = list.filter((t) => inMonth(t, ym) && completed(t));
  const income = tx.filter((t) => t.amountMinor > 0).reduce((s, t) => s + t.amountMinor, 0);
  const expenses = -tx.filter((t) => t.amountMinor < 0).reduce((s, t) => s + t.amountMinor, 0);
  return { income, expenses, tx };
}

export function overviewStats(state: DemoState) {
  const { income, expenses, tx } = monthSums(state.transactions);
  const pending = state.transactions.filter((t) => inMonth(t) && t.status === "pending");
  const pendingMinor = -pending.reduce((s, t) => s + t.amountMinor, 0);
  const balanceMinor = state.accounts.reduce((s, a) => s + toBase(a.balanceMinor, a.currency), 0);
  const expenseTx = tx.filter((t) => t.amountMinor < 0);
  const top = categoryBreakdown(expenseTx);
  return { income, expenses, pending, pendingMinor, balanceMinor, top, expenseTx };
}

export function categoryBreakdown(expenseTx: Transaction[]) {
  const total = -expenseTx.reduce((s, t) => s + t.amountMinor, 0);
  const map = new Map<string, number>();
  for (const t of expenseTx) map.set(t.categoryId, (map.get(t.categoryId) ?? 0) - t.amountMinor);
  return [...map.entries()]
    .map(([id, minor]) => ({ id, name: categoryName(id), minor, share: total ? minor / total : 0 }))
    .sort((a, b) => b.minor - a.minor);
}

/** Monthly spending series: seed history where given, otherwise computed from transactions. */
export function monthlySeries(state: DemoState) {
  const months = new Set<string>([
    ...Object.keys(seed.monthlySpendingMinor),
    ...state.transactions.map((t) => t.date.slice(0, 7)),
  ]);
  return [...months].sort().map((ym) => ({
    ym,
    minor:
      ym === month
        ? monthSums(state.transactions, ym).expenses
        : (seed.monthlySpendingMinor[ym] ?? monthSums(state.transactions, ym).expenses),
  }));
}

export function cardUsedThisMonth(state: DemoState, cardId: string) {
  return -state.transactions
    .filter((t) => t.cardId === cardId && inMonth(t) && completed(t) && t.amountMinor < 0)
    .reduce((s, t) => s + t.amountMinor, 0);
}

export function largestExpense(state: DemoState) {
  const { tx } = monthSums(state.transactions);
  return tx.filter((t) => t.amountMinor < 0).sort((a, b) => a.amountMinor - b.amountMinor)[0];
}

export interface FlowPoint {
  ym: string;
  income: number;
  expenses: number;
  partial: boolean;
}

/** Income vs expenses for every month that has transactions (older months in the seed only carry expenses and are skipped). */
export function flowSeries(state: DemoState): FlowPoint[] {
  const months = [...new Set(state.transactions.map((t) => t.date.slice(0, 7)))].sort();
  return months.map((ym) => {
    const { income, expenses } = monthSums(state.transactions, ym);
    return { ym, income, expenses, partial: ym === month };
  });
}

export interface TrendPoint {
  date: string;
  balanceMinor: number;
}

const isoDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** End-of-day balance for the last `days` days, derived by rolling completed transactions back from today's balance.
 * Without `accountId`: total of all accounts in the base currency; with it: that account in its own currency. */
export function balanceTrend(state: DemoState, days = 30, accountId?: string): TrendPoint[] {
  const end = new Date(`${seed.meta.today}T12:00:00`);
  const acc = accountId ? state.accounts.find((a) => a.id === accountId) : undefined;
  let balance = acc
    ? acc.balanceMinor
    : state.accounts.reduce((s, a) => s + toBase(a.balanceMinor, a.currency), 0);
  const byDay = new Map<string, number>();
  for (const t of state.transactions)
    if (completed(t) && (!accountId || t.accountId === accountId))
      byDay.set(
        t.date.slice(0, 10),
        (byDay.get(t.date.slice(0, 10)) ?? 0) +
          (accountId ? t.amountMinor : toBase(t.amountMinor, t.currency)),
      );
  const out: TrendPoint[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    const key = isoDay(d);
    out.unshift({ date: key, balanceMinor: balance });
    balance -= byDay.get(key) ?? 0;
  }
  return out;
}

/** Top `n` categories plus a combined "Other" remainder, so the split always adds up to the total. */
export function categorySplit(expenseTx: Transaction[], n = 5) {
  const all = categoryBreakdown(expenseTx);
  const top = all.slice(0, n);
  const rest = all.slice(n);
  if (rest.length) {
    const minor = rest.reduce((s, c) => s + c.minor, 0);
    top.push({ id: "other", name: "Other", minor, share: rest.reduce((s, c) => s + c.share, 0) });
  }
  return top;
}

/** This month's activity of one account, in the account's own currency (completed payments only). */
export function accountActivity(state: DemoState, accountId: string, ym = month) {
  const list = state.transactions.filter((t) => t.accountId === accountId && t.date.startsWith(ym));
  const done = list.filter(completed);
  return {
    count: list.length,
    pending: list.length - done.length,
    income: done.filter((t) => t.amountMinor > 0).reduce((s, t) => s + t.amountMinor, 0),
    expenses: done.filter((t) => t.amountMinor < 0).reduce((s, t) => s - t.amountMinor, 0),
    lastDate: byDateDesc(list)[0]?.date ?? null,
  };
}
