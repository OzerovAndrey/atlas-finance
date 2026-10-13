import raw from "./seed.json";
import type { DemoSeed, Transaction } from "./types";

export const seed = raw as DemoSeed;

const month = seed.meta.today.slice(0, 7);
const inMonth = (t: Transaction) => t.date.startsWith(month);

export const categoryName = (id: string) => seed.categories.find((c) => c.id === id)?.name ?? id;

export const sortedTransactions = [...seed.transactions].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export function overviewStats() {
  const tx = seed.transactions.filter(inMonth);
  const income = tx
    .filter((t) => t.amountMinor > 0 && t.status === "completed")
    .reduce((s, t) => s + t.amountMinor, 0);
  const completed = tx.filter((t) => t.amountMinor < 0 && t.status === "completed");
  const expenses = -completed.reduce((s, t) => s + t.amountMinor, 0);
  const pending = tx.filter((t) => t.status === "pending");
  const pendingMinor = -pending.reduce((s, t) => s + t.amountMinor, 0);
  const balanceMinor = seed.accounts.reduce(
    (s, a) =>
      s +
      Math.round(
        a.balanceMinor * (a.currency === seed.meta.currency ? 1 : (seed.fx[a.currency] ?? 1)),
      ),
    0,
  );
  const byCategory = new Map<string, number>();
  for (const t of completed)
    byCategory.set(t.categoryId, (byCategory.get(t.categoryId) ?? 0) - t.amountMinor);
  const top = [...byCategory.entries()]
    .map(([id, minor]) => ({ id, name: categoryName(id), minor, share: minor / expenses }))
    .sort((a, b) => b.minor - a.minor);
  return { income, expenses, pending, pendingMinor, balanceMinor, top };
}
