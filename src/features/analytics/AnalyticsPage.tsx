import { Amount } from "../../components/Amount";
import { CategorySplit } from "../../components/CategorySplit";
import { MoneyFlowChart, TrendChart } from "../../components/charts";
import { Tile } from "../../components/Tile";
import {
  balanceTrend,
  flowSeries,
  largestExpense,
  month,
  monthSums,
  overviewStats,
  seed,
} from "../../data/demo";
import { useDemo } from "../../data/store";
import { formatMonth, formatPercent } from "../../lib/format";

function Kpi(props: { label: string; caption: string; children: React.ReactNode }) {
  return (
    <article className="kpi">
      <p className="kpi__label ts-label-md">{props.label}</p>
      <div className="kpi__value">{props.children}</div>
      <p className="kpi__foot ts-caption-regular">
        <span className="muted">{props.caption}</span>
      </p>
    </article>
  );
}

export function AnalyticsPage() {
  const { state } = useDemo();
  const cur = seed.meta.currency;
  const { income, expenses } = monthSums(state.transactions);
  const s = overviewStats(state);
  const savings = income > 0 ? ((income - expenses) / income) * 100 : 0;
  const big = largestExpense(state);
  const flow = flowSeries(state);
  const trend = balanceTrend(state, 30);

  return (
    <div className="bento bento--analytics">
      <div className="b-kpis b-kpis--wide">
        <Kpi label="Income" caption={formatMonth(`${month}-01`)}>
          <Amount minor={income} currency={cur} size="xl" />
        </Kpi>
        <Kpi label="Expenses" caption="Completed payments">
          <Amount minor={expenses} currency={cur} size="xl" />
        </Kpi>
        <Kpi label="Savings rate" caption="of income kept">
          <span className="amt amt--xl">
            <span className="amt__int">{formatPercent(savings)}</span>
          </span>
        </Kpi>
        <Kpi label="Largest expense" caption={big?.merchant ?? "—"}>
          {big ? (
            <Amount minor={-big.amountMinor} currency={cur} size="xl" />
          ) : (
            <span className="amt amt--xl">—</span>
          )}
        </Kpi>
      </div>
      <Tile
        className="a-flow"
        title="Money flow"
        subtitle={`Income vs expenses · ${flow.length} months`}
      >
        <MoneyFlowChart data={flow} currency={cur} />
      </Tile>
      <Tile className="a-cats" title="Spending by category" subtitle={formatMonth(`${month}-01`)}>
        <CategorySplit expenseTx={s.expenseTx} />
      </Tile>
      <Tile
        className="a-trend"
        title="Balance trend"
        subtitle="Last 30 days · derived from completed transactions"
      >
        <TrendChart data={trend} currency={cur} height={220} axes />
      </Tile>
    </div>
  );
}
