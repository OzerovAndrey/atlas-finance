import { StatCard } from "../../components/StatCard";
import { Tile } from "../../components/Tile";
import {
  categoryBreakdown,
  largestExpense,
  monthSums,
  monthlySeries,
  month,
} from "../../data/demo";
import { useDemo } from "../../data/store";
import { formatMoney, formatMonth, formatPercent } from "../../lib/format";

const shortMonth = (ym: string) =>
  new Intl.DateTimeFormat("en-IE", { month: "short" }).format(new Date(`${ym}-01`));

export function AnalyticsPage() {
  const { state } = useDemo();
  const { income, expenses, tx } = monthSums(state.transactions);
  const series = monthlySeries(state).slice(-6);
  const max = Math.max(...series.map((s) => s.minor), 1);
  const cats = categoryBreakdown(tx.filter((t) => t.amountMinor < 0));
  const savings = income > 0 ? ((income - expenses) / income) * 100 : 0;
  const big = largestExpense(state);
  const cur = "EUR";

  const top = cats.slice(0, 5);
  const ends = top.map((_, i) => top.slice(0, i + 1).reduce((sum, c) => sum + c.share * 100, 0));
  const stops = top.map(
    (_, i) => `var(--color-chart-category-${i + 1}) ${i === 0 ? 0 : ends[i - 1]}% ${ends[i]}%`,
  );
  const covered = ends[ends.length - 1] ?? 0;
  if (covered < 99.99) stops.push(`var(--donut-track) ${covered}% 100%`);

  return (
    <div className="analytics">
      <div className="kpis kpis--4">
        <StatCard
          tone="primary"
          icon="trendUp"
          label="Income"
          value={formatMoney(income, cur)}
          footer={<span>{formatMonth(`${month}-01`)}</span>}
        />
        <StatCard
          tone="inverse"
          icon="wallet"
          label="Expenses"
          value={formatMoney(expenses, cur)}
          footer={<span>Completed payments</span>}
        />
        <StatCard
          tone="soft2"
          icon="chart"
          label="Savings rate"
          value={formatPercent(savings)}
          footer={<span>of income kept</span>}
        />
        <StatCard
          tone="soft3"
          icon="wallet"
          label="Largest expense"
          value={big ? formatMoney(-big.amountMinor, cur) : "—"}
          footer={<span>{big?.merchant ?? ""}</span>}
        />
      </div>

      <Tile title="Monthly spending" subtitle="Last 6 months" className="tile--chart">
        <div
          className="bars"
          role="img"
          aria-label={`Monthly spending: ${series.map((s) => `${shortMonth(s.ym)} ${formatMoney(s.minor, cur)}`).join(", ")}`}
        >
          {series.map((s) => (
            <div key={s.ym} className="bars__col">
              <span className="bars__value ts-caption-regular">
                {formatMoney(s.minor, cur).replace(/\.\d\d$/, "")}
              </span>
              <div className="bars__track">
                <div
                  className={`bars__fill ${s.ym === month ? "bars__fill--now" : ""}`}
                  style={{ height: `${(s.minor / max) * 100}%` }}
                />
              </div>
              <span className="muted ts-caption-regular">{shortMonth(s.ym)}</span>
            </div>
          ))}
        </div>
      </Tile>

      <Tile
        title="Spending by category"
        subtitle={formatMonth(`${month}-01`)}
        className="tile--split"
      >
        <div className="donut-wrap">
          <div
            className="donut"
            style={{ background: `conic-gradient(${stops.join(", ")})` }}
            role="img"
            aria-label="Spending split by category"
          >
            <div className="donut__hole">
              <span className="ts-numeric-amount-md">{formatMoney(expenses, cur)}</span>
              <span className="muted ts-caption-regular">spent</span>
            </div>
          </div>
          <ul className="legend">
            {cats.slice(0, 5).map((c, i) => (
              <li key={c.id} className="ts-body-sm-regular">
                <i
                  className="cat__swatch"
                  style={{ background: `var(--color-chart-category-${i + 1})` }}
                />
                <span>{c.name}</span>
                <span className="muted">{formatPercent(c.share * 100)}</span>
              </li>
            ))}
          </ul>
        </div>
      </Tile>
    </div>
  );
}
