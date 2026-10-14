import { useMemo, useState } from "react";
import { Amount } from "../../components/Amount";
import { CategoryAvatar, categoryColor } from "../../components/CategoryAvatar";
import { Tile } from "../../components/Tile";
import { accountName, byDateDesc, categoryName, seed } from "../../data/demo";
import { useDemo } from "../../data/store";
import type { Transaction } from "../../data/types";
import { formatDateTime, formatDay } from "../../lib/format";
import { useRouteQuery } from "../../lib/router";

const TABS = [
  { id: "all", label: "All" },
  { id: "income", label: "Income" },
  { id: "expenses", label: "Expenses" },
  { id: "pending", label: "Pending" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export const initials = (s: string) =>
  s
    .split(/[\s&·]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

function Detail({ tx, onClose }: { tx: Transaction; onClose: () => void }) {
  const { state } = useDemo();
  const card = state.cards.find((c) => c.id === tx.cardId);
  return (
    <aside className="drawer" aria-label="Transaction details">
      <header className="drawer__head">
        <CategoryAvatar categoryId={tx.categoryId} />
        <div>
          <h2 className="ts-title-t4">{tx.merchant}</h2>
          <Amount
            minor={tx.amountMinor}
            currency={tx.currency}
            signed
            size="lg"
            tone={tx.amountMinor > 0 ? "positive" : undefined}
          />
        </div>
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          Close
        </button>
      </header>
      <dl className="details">
        <div>
          <dt>Status</dt>
          <dd>
            <span
              className={`badge ${tx.status === "pending" ? "badge--warning" : "badge--success"}`}
            >
              {tx.status === "pending" ? "Pending" : "Completed"}
            </span>
          </dd>
        </div>
        <div>
          <dt>Category</dt>
          <dd>{categoryName(tx.categoryId)}</dd>
        </div>
        <div>
          <dt>Date</dt>
          <dd>{formatDateTime(tx.date)}</dd>
        </div>
        <div>
          <dt>Account</dt>
          <dd>{accountName(tx.accountId)}</dd>
        </div>
        <div>
          <dt>Card</dt>
          <dd>{card ? `${card.name} •••• ${card.last4}` : "—"}</dd>
        </div>
        <div>
          <dt>Reference</dt>
          <dd>{tx.reference}</dd>
        </div>
      </dl>
    </aside>
  );
}

function TransactionsView({
  initialTab,
  initialQuery,
}: {
  initialTab: TabId;
  initialQuery: string;
}) {
  const { state } = useDemo();
  const [tab, setTab] = useState<TabId>(initialTab);
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return byDateDesc(state.transactions).filter((t) => {
      if (tab === "income" && t.amountMinor <= 0) return false;
      if (tab === "expenses" && t.amountMinor >= 0) return false;
      if (tab === "pending" && t.status !== "pending") return false;
      if (category !== "all" && t.categoryId !== category) return false;
      return !q || t.merchant.toLowerCase().includes(q) || t.reference.toLowerCase().includes(q);
    });
  }, [state.transactions, tab, query, category]);

  const open = state.transactions.find((t) => t.id === selected);

  return (
    <div className={`split ${open ? "split--open" : ""}`}>
      <Tile icon="list" title="All transactions" subtitle={`${rows.length} entries`}>
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
          <label className="search-field">
            <input
              className="input"
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
          <div className="empty">
            <p className="ts-title-t4">No transactions found</p>
            <p className="muted ts-body-md-regular">Try another filter or clear the search.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" className="col-date">
                    Date
                  </th>
                  <th scope="col">Description</th>
                  <th scope="col" className="col-cat">
                    Category
                  </th>
                  <th scope="col" className="num">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.id} aria-selected={t.id === selected}>
                    <td className="muted col-date">{formatDay(t.date)}</td>
                    <td>
                      <button
                        type="button"
                        className="table__merchant table__open"
                        onClick={() => setSelected(t.id)}
                        aria-label={`Open ${t.merchant}`}
                      >
                        <CategoryAvatar categoryId={t.categoryId} size="sm" />
                        <span className="table__name">
                          <span className="ts-body-md-strong">{t.merchant}</span>
                          <span className="table__sub ts-caption-regular">
                            {formatDay(t.date)} · {categoryName(t.categoryId)}
                          </span>
                        </span>
                        {t.status === "pending" && (
                          <span className="badge badge--warning">Pending</span>
                        )}
                      </button>
                    </td>
                    <td className="col-cat">
                      <span
                        className={`badge ${t.categoryId === "income" ? "badge--success" : "badge--neutral"}`}
                      >
                        <i
                          className="dot"
                          style={{ background: categoryColor(t.categoryId) }}
                          aria-hidden="true"
                        />
                        {categoryName(t.categoryId)}
                      </span>
                    </td>
                    <td className="num">
                      <Amount
                        minor={t.amountMinor}
                        currency={t.currency}
                        signed
                        size="sm"
                        tone={t.amountMinor > 0 ? "positive" : undefined}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Tile>
      {open && <Detail tx={open} onClose={() => setSelected(null)} />}
    </div>
  );
}

/** Filters come from the URL (#/transactions?q=…&status=pending); the view remounts when they change. */
export function TransactionsPage() {
  const params = useRouteQuery();
  const st = params.get("status");
  const tab: TabId = TABS.some((t) => t.id === st) ? (st as TabId) : "all";
  return (
    <TransactionsView
      key={params.toString()}
      initialTab={tab}
      initialQuery={params.get("q") ?? ""}
    />
  );
}
