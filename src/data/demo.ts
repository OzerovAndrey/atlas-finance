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
  const top = categoryBreakdown(tx.filter((t) => t.amountMinor < 0));
  return { income, expenses, pending, pendingMinor, balanceMinor, top };
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
