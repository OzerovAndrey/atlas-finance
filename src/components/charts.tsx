import { useId, useState } from "react";
import { seed, type FlowPoint, type TrendPoint } from "../data/demo";
import { formatMoney } from "../lib/format";
import { useWidth } from "../lib/useWidth";

const locale = seed.meta.locale;
const compact = (minor: number, currency: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(minor / 100);
const monthLong = (ym: string) =>
  new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
    new Date(`${ym}-01T12:00:00`),
  );
const monthShort = (ym: string) =>
  new Intl.DateTimeFormat(locale, { month: "short" }).format(new Date(`${ym}-01T12:00:00`));
const dayLong = (iso: string) =>
  new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00`));

function niceMax(v: number) {
  const raw = Math.max(v, 1) / 3;
  const unit = 10 ** Math.floor(Math.log10(raw));
  const step = ([1, 1.5, 2, 2.5, 3, 4, 5, 10].find((m) => m * unit >= raw) ?? 10) * unit;
  return step * 3;
}

/** Grouped income / expense bars per month. The incomplete current month is hatched and labelled. */
export function MoneyFlowChart({ data, currency }: { data: FlowPoint[]; currency: string }) {
  const [ref, width] = useWidth<HTMLDivElement>(560);
  const [active, setActive] = useState<number | null>(null);
  const uid = useId().replace(/:/g, "");
  const height = 248;
  const m = { l: 56, r: 8, t: 12, b: 32 };
  const iw = Math.max(40, width - m.l - m.r);
  const ih = height - m.t - m.b;
  const top = niceMax(Math.max(...data.flatMap((d) => [d.income, d.expenses]), 1));
  const ticks = [0, 1, 2, 3].map((i) => (top / 3) * i);
  const y = (v: number) => m.t + ih - (v / top) * ih;
  const band = iw / Math.max(data.length, 1);
  const bw = Math.min(28, Math.max(10, band * 0.22));
  const today = new Date(`${seed.meta.today}T12:00:00`);
  const partialLabel = `1–${today.getDate()} ${monthShort(seed.meta.today.slice(0, 7))}`;
  const a = active !== null ? data[active] : undefined;
  const tipLeft = a ? Math.min(Math.max(m.l + band * (active! + 0.5), 96), width - 96) : 0;

  return (
    <div ref={ref} className="chart" onMouseLeave={() => setActive(null)}>
      <svg
        width={width}
        height={height}
        role="group"
        aria-label="Money flow: income and expenses by month"
      >
        <defs>
          {(["income", "expense"] as const).map((k) => (
            <pattern
              key={k}
              id={`${uid}-${k}`}
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width="6" height="6" className={`chart__hatch-bg chart__hatch-bg--${k}`} />
              <rect width="3" height="6" className={`chart__hatch chart__hatch--${k}`} />
            </pattern>
          ))}
        </defs>
        {ticks.map((tv) => (
          <g key={tv}>
            <line x1={m.l} x2={width - m.r} y1={y(tv)} y2={y(tv)} className="chart__grid" />
            <text x={m.l - 10} y={y(tv)} dy="0.32em" textAnchor="end" className="chart__label">
              {tv === 0 ? "0" : compact(tv, currency)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = m.l + band * (i + 0.5);
          const label = `${monthLong(d.ym)}${d.partial ? ` (${partialLabel}, month to date)` : ""}: income ${formatMoney(d.income, currency)}, expenses ${formatMoney(d.expenses, currency)}`;
          return (
            <g
              key={d.ym}
              tabIndex={0}
              role="img"
              aria-label={label}
              className={`chart__col ${active === i ? "is-active" : ""}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              <rect x={m.l + band * i} y={m.t} width={band} height={ih} className="chart__hit" />
              <rect
                x={cx - bw - 3 - 6}
                y={m.t}
                width={bw * 2 + 6 + 12}
                height={ih}
                rx={Math.min(14, bw / 2 + 6)}
                className="chart__track"
              />
              <rect
                x={cx - bw - 3}
                y={y(d.income)}
                width={bw}
                height={Math.max(0, m.t + ih - y(d.income))}
                rx={bw / 2}
                className="chart__bar chart__bar--income"
                style={d.partial ? { fill: `url(#${uid}-income)` } : undefined}
              />
              <rect
                x={cx + 3}
                y={y(d.expenses)}
                width={bw}
                height={Math.max(0, m.t + ih - y(d.expenses))}
                rx={bw / 2}
                className="chart__bar chart__bar--expense"
                style={d.partial ? { fill: `url(#${uid}-expense)` } : undefined}
              />
              <text x={cx} y={height - 10} textAnchor="middle" className="chart__label">
                {monthShort(d.ym)}
                {d.partial ? "*" : ""}
              </text>
            </g>
          );
        })}
      </svg>
      {a && (
        <div className="tooltip" style={{ left: tipLeft }} role="status">
          <p className="tooltip__title">{monthLong(a.ym)}</p>
          {a.partial && <p className="tooltip__note">{partialLabel} · month to date</p>}
          <p className="tooltip__row">
            <i className="dot dot--income" /> Income <b>{formatMoney(a.income, currency)}</b>
          </p>
          <p className="tooltip__row">
            <i className="dot dot--expense" /> Expenses <b>{formatMoney(a.expenses, currency)}</b>
          </p>
          <p className="tooltip__row tooltip__row--net">
            Net <b>{formatMoney(a.income - a.expenses, currency, true)}</b>
          </p>
        </div>
      )}
      <p className="chart__legend ts-caption-regular">
        <span>
          <i className="dot dot--income" /> Income
        </span>
        <span>
          <i className="dot dot--expense" /> Expenses
        </span>
        <span className="muted">* {partialLabel}, month to date</span>
      </p>
    </div>
  );
}

/** Balance line. Derived from completed transactions; the y axis is not forced to zero, so min and max are labelled. */
export function TrendChart({
  data,
  currency,
  height = 96,
  axes = false,
}: {
  data: TrendPoint[];
  currency: string;
  height?: number;
  axes?: boolean;
}) {
  const [ref, width] = useWidth<HTMLDivElement>(320);
  const [idx, setIdx] = useState<number | null>(null);
  const m = axes ? { l: 56, r: 8, t: 14, b: 26 } : { l: 4, r: 4, t: 8, b: 8 };
  const iw = Math.max(40, width - m.l - m.r);
  const ih = height - m.t - m.b;
  const vals = data.map((d) => d.balanceMinor);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const span = hi - lo || 1;
  const x = (i: number) => m.l + (iw * i) / Math.max(data.length - 1, 1);
  const y = (v: number) => m.t + ih - ((v - lo) / span) * ih;
  const line = data
    .map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(d.balanceMinor).toFixed(1)}`)
    .join(" ");
  const area = `${line} L${x(data.length - 1).toFixed(1)} ${m.t + ih} L${x(0).toFixed(1)} ${m.t + ih} Z`;
  const first = data[0];
  const last = data[data.length - 1];
  const sel = idx !== null ? data[idx] : undefined;
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left - m.l) / iw) * (data.length - 1));
    setIdx(Math.min(data.length - 1, Math.max(0, i)));
  };
  if (!first || !last) return null;
  return (
    <div ref={ref} className="chart chart--trend" onPointerLeave={() => setIdx(null)}>
      <svg
        width={width}
        height={height}
        onPointerMove={onMove}
        role="img"
        aria-label={`Balance trend, ${dayLong(first.date)} to ${dayLong(last.date)}: from ${formatMoney(first.balanceMinor, currency)} to ${formatMoney(last.balanceMinor, currency)}. Lowest ${formatMoney(lo, currency)}, highest ${formatMoney(hi, currency)}.`}
      >
        {axes &&
          [lo, (lo + hi) / 2, hi].map((v) => (
            <g key={v}>
              <line x1={m.l} x2={width - m.r} y1={y(v)} y2={y(v)} className="chart__grid" />
              <text x={m.l - 10} y={y(v)} dy="0.32em" textAnchor="end" className="chart__label">
                {compact(v, currency)}
              </text>
            </g>
          ))}
        <path d={area} className="trend__area" />
        <path d={line} className="trend__line" />
        {axes && (
          <>
            <text x={m.l} y={height - 6} className="chart__label">
              {new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(
                new Date(`${first.date}T12:00:00`),
              )}
            </text>
            <text x={width - m.r} y={height - 6} textAnchor="end" className="chart__label">
              {new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(
                new Date(`${last.date}T12:00:00`),
              )}
            </text>
          </>
        )}
        <circle cx={x(data.length - 1)} cy={y(last.balanceMinor)} r={4} className="trend__dot" />
        {sel && idx !== null && (
          <>
            <line x1={x(idx)} x2={x(idx)} y1={m.t} y2={m.t + ih} className="trend__cursor" />
            <circle
              cx={x(idx)}
              cy={y(sel.balanceMinor)}
              r={5}
              className="trend__dot trend__dot--sel"
            />
          </>
        )}
      </svg>
      {sel && idx !== null && (
        <div
          className="tooltip"
          style={{ left: Math.min(Math.max(x(idx), 80), width - 80) }}
          role="status"
        >
          <p className="tooltip__title">{dayLong(sel.date)}</p>
          <p className="tooltip__row">
            Balance <b>{formatMoney(sel.balanceMinor, currency)}</b>
          </p>
        </div>
      )}
    </div>
  );
}
