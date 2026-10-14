import { Amount } from "../../components/Amount";
import { CategorySplit } from "../../components/CategorySplit";
import { MoneyFlowChart, TrendChart } from "../../components/charts";
import { TxAvatar } from "../../components/CategoryAvatar";
import { Icon } from "../../components/Icon";
import { Kpi } from "../../components/Kpi";
import { Tile } from "../../components/Tile";
import {
  balanceTrend,
  byDateDesc,
  categoryName,
  flowSeries,
  monthSums,
  overviewStats,
  seed,
} from "../../data/demo";
import { useDemo } from "../../data/store";
import { formatDay, formatHidden, formatMonth, formatPercent } from "../../lib/format";

const prevMonth = (ym: string) => {
  const d = new Date(`${ym}-01T12:00:00`);
  d.setMonth(d.getMonth() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export function OverviewPage() {
  const { state } = useDemo();
  const s = overviewStats(state);
  const cur = seed.meta.currency;
  const hidden = state.prefs.hideBalances;
  const recent = byDateDesc(state.transactions).slice(0, 5);
  const trend = balanceTrend(state, 30);
  const flow = flowSeries(state);
  const month = seed.meta.today.slice(0, 7);
  const prev = monthSums(state.transactions, prevMonth(month));
  const savings = s.income > 0 ? ((s.income - s.expenses) / s.income) * 100 : 0;
  const prevSavings = prev.income > 0 ? ((prev.income - prev.expenses) / prev.income) * 100 : null;
  const pct = (a: number, b: number) => (b > 0 ? ((a - b) / b) * 100 : null);
  const incDelta = pct(s.income, prev.income);
  const expDelta = pct(s.expenses, prev.expenses);
  const mtd = `1–${new Date(`${seed.meta.today}T12:00:00`).getDate()} ${new Intl.DateTimeFormat(seed.meta.locale, { month: "short" }).format(new Date(`${seed.meta.today}T12:00:00`))}`;
  const pend = s.pending[0];
  const prevShort = new Intl.DateTimeFormat(seed.meta.locale, { month: "short" }).format(
    new Date(`${prevMonth(month)}-01T12:00:00`),
  );

  return (
    <div className="bento">
      <section className="hero" aria-labelledby="hero-title">
        <span className="hero__deco" aria-hidden="true" />
        <header className="hero__head">
          <h2 id="hero-title" className="hero__title ts-label-md">
            <span className="hero__badge" aria-hidden="true">
              <Icon name="wallet" size="var(--icon-size-sm)" />
            </span>
            Total balance
          </h2>
          <span className="hero__chip ts-label-sm">
            <Icon name="trendUp" size="var(--icon-size-sm)" />{" "}
            {formatPercent(seed.meta.balanceChangePct, true)} vs last month
          </span>
        </header>
        <p className="hero__value">
          {hidden ? (
            <span className="amt amt--hero">{formatHidden(cur)}</span>
          ) : (
            <Amount minor={s.balanceMinor} currency={cur} size="hero" />
          )}
        </p>
        <p className="hero__sub ts-body-sm-regular">
          {state.accounts.length} accounts · {cur} equivalent
        </p>
        {!hidden && (
          <div className="hero__trend">
            <TrendChart data={trend} currency={cur} height={88} />
            <p className="ts-caption-regular hero__caption">
              Last 30 days · derived from completed transactions
            </p>
          </div>
        )}
        <div className="hero__actions">
          <a className="btn btn--cta" href="#/transfers" data-event="cta_transfer">
            <Icon name="send" size="var(--icon-size-sm)" /> Transfer
          </a>
          <a className="btn btn--hero-ghost" href="#/accounts">
            Accounts
          </a>
        </div>
      </section>

      <Tile
        className="b-flow"
        icon="chart"
        title="Money flow"
        subtitle={`Income vs expenses · ${flow.length} months`}
        action={{ href: "#/analytics", label: "Open analytics" }}
      >
        <MoneyFlowChart data={flow} currency={cur} />
      </Tile>

      <div className="b-kpis">
        <Kpi
          label="Income"
          icon="arrowDownLeft"
          tone="soft1"
          caption={`${mtd} vs ${prevShort}`}
          delta={
            incDelta === null
              ? undefined
              : {
                  text: formatPercent(incDelta, true),
                  tone: incDelta >= 0 ? "positive" : "negative",
                }
          }
        >
          <Amount minor={s.income} currency={cur} size="xl" />
        </Kpi>
        <Kpi
          label="Expenses"
          icon="arrowUpRight"
          tone="soft2"
          caption={`${mtd} vs ${prevShort}`}
          delta={
            expDelta === null
              ? undefined
              : {
                  text: formatPercent(expDelta, true),
                  tone: expDelta <= 0 ? "positive" : "negative",
                }
          }
        >
          <Amount minor={s.expenses} currency={cur} size="xl" />
        </Kpi>
        <Kpi
          label="Savings rate"
          icon="percent"
          tone="soft3"
          caption="of income kept"
          delta={
            prevSavings === null
              ? undefined
              : {
                  text: `${savings - prevSavings >= 0 ? "+" : ""}${(savings - prevSavings).toFixed(1)} pts`,
                  tone: savings >= prevSavings ? "positive" : "negative",
                }
          }
        >
          <span className="amt amt--xl">
            <span className="amt__int">{formatPercent(savings)}</span>
          </span>
        </Kpi>
        <a
          className="pending"
          href="#/transactions?status=pending"
          aria-label="Open pending transactions"
        >
          <span className="pending__icon">
            <Icon name="clock" size="var(--icon-size-md)" />
          </span>
          <span className="pending__text">
            <span className="ts-label-md">Pending</span>
            <span className="ts-caption-regular">
              {s.pending.length} {s.pending.length === 1 ? "payment" : "payments"}
              {pend ? ` · ${pend.merchant}` : ""}
            </span>
          </span>
          <Amount minor={s.pendingMinor} currency={cur} size="sm" />
        </a>
      </div>

      <Tile
        className="b-recent"
        icon="list"
        title="Recent activity"
        subtitle="Latest transactions"
        action={{ href: "#/transactions", label: "Open transactions" }}
      >
        <ul className="tx-list">
          {recent.map((t) => (
            <li key={t.id} className="tx-row">
              <TxAvatar categoryId={t.categoryId} merchant={t.merchant} />
              <span className="tx-row__main">
                <span className="tx-row__title ts-body-md-strong">
                  {t.merchant}
                  {t.status === "pending" && <span className="badge badge--warning">Pending</span>}
                </span>
                <span className="tx-row__meta ts-body-sm-regular">
                  {formatDay(t.date)} · {categoryName(t.categoryId)}
                </span>
              </span>
              <Amount
                minor={t.amountMinor}
                currency={t.currency}
                signed
                size="sm"
                tone={t.amountMinor > 0 ? "positive" : undefined}
              />
            </li>
          ))}
        </ul>
      </Tile>

      <Tile
        className="b-cats"
        icon="sparkle"
        title="Spending by category"
        subtitle={`${formatMonth(seed.meta.today)} · ${mtd}`}
        action={{ href: "#/analytics", label: "Open analytics" }}
      >
        <CategorySplit expenseTx={s.expenseTx} />
      </Tile>
    </div>
  );
}
