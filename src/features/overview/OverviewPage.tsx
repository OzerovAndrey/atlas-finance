import { Amount } from "../../components/Amount";
import { CategorySplit } from "../../components/CategorySplit";
import { MoneyFlowChart, TrendChart } from "../../components/charts";
import { Icon } from "../../components/Icon";
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

const initials = (s: string) =>
  s
    .split(/[\s&·]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

const prevMonth = (ym: string) => {
  const d = new Date(`${ym}-01T12:00:00`);
  d.setMonth(d.getMonth() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

function Kpi(props: {
  label: string;
  children: React.ReactNode;
  delta?: { text: string; tone: "positive" | "negative" | "neutral" };
  caption: string;
}) {
  return (
    <article className="kpi">
      <p className="kpi__label ts-label-md">{props.label}</p>
      <div className="kpi__value">{props.children}</div>
      <p className="kpi__foot ts-caption-regular">
        {props.delta && (
          <span className={`chip chip--${props.delta.tone}`}>{props.delta.text}</span>
        )}
        <span className="muted">{props.caption}</span>
      </p>
    </article>
  );
}

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

  return (
    <div className="bento">
      <section className="hero" aria-labelledby="hero-title">
        <header className="hero__head">
          <h2 id="hero-title" className="ts-label-md">
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
        title="Money flow"
        subtitle={`Income vs expenses · ${flow.length} months`}
        action={{ href: "#/analytics", label: "Open analytics" }}
      >
        <MoneyFlowChart data={flow} currency={cur} />
      </Tile>

      <div className="b-kpis">
        <Kpi
          label="Income"
          caption={`${mtd} vs Sep`}
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
          caption={`${mtd} vs Sep`}
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
        title="Spending by category"
        subtitle={`${formatMonth(seed.meta.today)} · ${mtd}`}
        action={{ href: "#/analytics", label: "Open analytics" }}
      >
        <CategorySplit expenseTx={s.expenseTx} />
      </Tile>
    </div>
  );
}
