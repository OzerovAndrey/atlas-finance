import { useMemo, useState } from "react";
import { Tile } from "../../components/Tile";
import { categoryName, seed, sortedTransactions } from "../../data/demo";
import { formatDay, formatMoney } from "../../lib/format";

const TABS = [
  { id: "all", label: "All" },
  { id: "income", label: "Income" },
  { id: "expenses", label: "Expenses" },
  { id: "pending", label: "Pending" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const initials = (s: string) =>
  s
    .split(/[\s&·]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

export function TransactionsPage() {
  const [tab, setTab] = useState<TabId>("all");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortedTransactions.filter((t) => {
      if (tab === "income" && t.amountMinor <= 0) return false;
      if (tab === "expenses" && t.amountMinor >= 0) return false;
      if (tab === "pending" && t.status !== "pending") return false;
      if (category !== "all" && t.categoryId !== category) return false;
      return !q || t.merchant.toLowerCase().includes(q) || t.reference.toLowerCase().includes(q);
    });
  }, [tab, query, category]);

  return (
    <Tile title="All transactions" subtitle={`${rows.length} entries`}>
      <div className="tabs" role="tablist" aria-label="Transaction type">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === tab}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="filters">
        <label className="search-bar search-bar--wide">
          <input
            type="search"
            placeholder="Search transactions"
            aria-label="Search transactions"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="select">
          <span className="sr-only">Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            {seed.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {rows.length === 0 ? (
        <p className="empty muted ts-body-md-regular">No transactions match these filters.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Description</th>
              <th scope="col">Category</th>
              <th scope="col" className="num">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id}>
                <td className="muted">{formatDay(t.date)}</td>
                <td>
                  <span className="table__merchant">
                    <span className="avatar avatar--sm" aria-hidden="true">
                      {initials(t.merchant)}
                    </span>
                    <span className="ts-body-md-strong">{t.merchant}</span>
                    {t.status === "pending" && (
                      <span className="badge badge--warning">Pending</span>
                    )}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${t.categoryId === "income" ? "badge--success" : "badge--neutral"}`}
                  >
                    {categoryName(t.categoryId)}
                  </span>
                </td>
                <td
                  className={`num amount ts-numeric-amount-sm ${t.amountMinor > 0 ? "amount--positive" : "amount--negative"}`}
                >
                  {formatMoney(t.amountMinor, t.currency, true)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Tile>
  );
}
