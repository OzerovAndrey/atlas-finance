import { StatCard } from "../../components/StatCard";
import { Tile } from "../../components/Tile";
import { byDateDesc, categoryName, overviewStats, seed } from "../../data/demo";
import { useDemo } from "../../data/store";
import { formatDay, formatHidden, formatMoney, formatMonth, formatPercent } from "../../lib/format";

const initials = (s: string) =>
  s
    .split(/[\s&·]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

export function OverviewPage() {
  const { state } = useDemo();
  const s = overviewStats(state);
  const cur = seed.meta.currency;
  const recent = byDateDesc(state.transactions).slice(0, 6);
  const first = s.pending[0];
  const savings = s.income > 0 ? ((s.income - s.expenses) / s.income) * 100 : 0;
  return (
    <div className="overview">
      <div className="kpis">
        <StatCard
          tone="primary"
          icon="trendUp"
          label="Income"
          value={formatMoney(s.income, cur)}
          footer={<span>{formatPercent(savings)} saved this month</span>}
        />
        <StatCard
          tone="inverse"
          icon="wallet"
          label="Expenses"
          value={formatMoney(s.expenses, cur)}
          footer={<span>{formatMonth(seed.meta.today)}</span>}
        />
        <StatCard
          tone="soft1"
          icon="wallet"
          label="Pending"
          value={formatMoney(s.pendingMinor, cur)}
          footer={
            <span>
              {first ? `${first.merchant} · ` : ""}
              {s.pending.length} {s.pending.length === 1 ? "item" : "items"}
            </span>
          }
        />
      </div>

      <Tile
        className="tile--balance"
        title="Total balance"
        subtitle={`${state.accounts.length} accounts`}
        action={{ href: "#/accounts", label: "Open accounts" }}
      >
        <p className="balance ts-numeric-balance">
          {state.prefs.hideBalances ? formatHidden(cur) : formatMoney(s.balanceMinor, cur)}
        </p>
        <p className="muted ts-body-sm-regular">
          {formatPercent(seed.meta.balanceChangePct, true)} vs last month
        </p>
      </Tile>

      <Tile
        className="tile--recent"
        title="Recent activity"
        subtitle="Latest transactions"
        action={{ href: "#/transactions", label: "Open transactions" }}
      >
        <ul className="tx-list">
          {recent.map((t) => (
            <li key={t.id} className="tx-row">
              <span className="avatar" aria-hidden="true">
                {initials(t.merchant)}
              </span>
              <span className="tx-row__main">
                <span className="tx-row__title ts-body-md-strong">
                  {t.merchant}
                  {t.status === "pending" ? " · pending" : ""}
                </span>
                <span className="tx-row__meta ts-body-sm-regular">
                  {formatDay(t.date)} · {categoryName(t.categoryId)}
                </span>
              </span>
              <span
                className={`amount ts-numeric-amount-sm ${t.amountMinor > 0 ? "amount--positive" : "amount--negative"}`}
              >
                {formatMoney(t.amountMinor, t.currency, true)}
              </span>
            </li>
          ))}
        </ul>
      </Tile>

      <Tile
        className="tile--categories"
        title="Top categories"
        subtitle={formatMonth(seed.meta.today)}
        action={{ href: "#/analytics", label: "Open analytics" }}
      >
        <ul className="cat-list">
          {s.top.slice(0, 5).map((c, i) => (
            <li key={c.id} className="cat">
              <div className="cat__row ts-body-sm-regular">
                <span>
                  <i
                    className="cat__swatch"
                    style={{ background: `var(--color-chart-category-${i + 1})` }}
                  />
                  {c.name} · {formatPercent(c.share * 100)}
                </span>
                <span className="ts-numeric-amount-sm">{formatMoney(c.minor, cur)}</span>
              </div>
              <div className="cat__track" role="presentation">
                <div
                  className="cat__fill"
                  style={{
                    width: `${c.share * 100}%`,
                    background: `var(--color-chart-category-${i + 1})`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Tile>
    </div>
  );
}
