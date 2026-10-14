import { Amount } from "../../components/Amount";
import { CategorySplit } from "../../components/CategorySplit";
import { MoneyFlowChart, TrendChart } from "../../components/charts";
import { Kpi } from "../../components/Kpi";
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
        <Kpi label="Income" icon="arrowDownLeft" tone="soft1" caption={formatMonth(`${month}-01`)}>
          <Amount minor={income} currency={cur} size="xl" />
        </Kpi>
        <Kpi label="Expenses" icon="arrowUpRight" tone="soft2" caption="Completed payments">
          <Amount minor={expenses} currency={cur} size="xl" />
        </Kpi>
        <Kpi label="Savings rate" icon="percent" tone="soft3" caption="of income kept">
          <span className="amt amt--xl">
            <span className="amt__int">{formatPercent(savings)}</span>
          </span>
        </Kpi>
        <Kpi label="Largest expense" icon="bag" tone="neutral" caption={big?.merchant ?? "—"}>
          {big ? (
            <Amount minor={-big.amountMinor} currency={cur} size="xl" />
          ) : (
            <span className="amt amt--xl">—</span>
          )}
        </Kpi>
      </div>
      <Tile
        className="a-flow"
        icon="chart"
        title="Money flow"
        subtitle={`Income vs expenses · ${flow.length} months`}
      >
        <MoneyFlowChart data={flow} currency={cur} />
      </Tile>
      <Tile
        className="a-cats"
        icon="sparkle"
        title="Spending by category"
        subtitle={formatMonth(`${month}-01`)}
      >
        <CategorySplit expenseTx={s.expenseTx} />
      </Tile>
      <Tile
        className="a-trend"
        icon="trendUp"
        title="Balance trend"
        subtitle="Last 30 days · derived from completed transactions"
      >
        <TrendChart data={trend} currency={cur} height={220} axes />
      </Tile>
    </div>
  );
}
