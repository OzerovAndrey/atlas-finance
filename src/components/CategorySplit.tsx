import { categorySplit, seed, type DemoState } from "../data/demo";
import { formatMoney, formatPercent } from "../lib/format";
import { categoryColor } from "./CategoryAvatar";

/** Stacked share bar + full legend (top categories and an "Other" remainder). */
export function CategorySplit({
  state,
  expenseTx,
}: {
  state?: DemoState;
  expenseTx: import("../data/types").Transaction[];
}) {
  void state;
  const cur = seed.meta.currency;
  const rows = categorySplit(expenseTx, 5);
  const color = (_i: number, id: string) => categoryColor(id);
  return (
    <div className="split-cats">
      <div
        className="split-cats__bar"
        role="img"
        aria-label={`Spending by category: ${rows.map((r) => `${r.name} ${formatPercent(r.share * 100)}`).join(", ")}`}
      >
        {rows.map((r, i) => (
          <span
            key={r.id}
            style={{ width: `${r.share * 100}%`, background: color(i, r.id) }}
            title={`${r.name} · ${formatMoney(r.minor, cur)}`}
          />
        ))}
      </div>
      <ul className="split-cats__list">
        {rows.map((r, i) => (
          <li key={r.id}>
            <i className="swatch" style={{ background: color(i, r.id) }} />
            <span className="split-cats__name ts-body-sm-regular">{r.name}</span>
            <span className="muted ts-body-sm-regular">{formatPercent(r.share * 100)}</span>
            <span className="split-cats__value ts-numeric-amount-sm">
              {formatMoney(r.minor, cur)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
