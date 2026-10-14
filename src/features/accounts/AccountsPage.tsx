import { useState, type CSSProperties } from "react";
import { Amount } from "../../components/Amount";
import { TrendChart } from "../../components/charts";
import { Icon, type IconName } from "../../components/Icon";
import { Tile } from "../../components/Tile";
import { accountActivity, balanceTrend, seed, toBase } from "../../data/demo";
import { useDemo } from "../../data/store";
import type { Account } from "../../data/types";
import { formatDay, formatHidden, formatMoney, formatPercent } from "../../lib/format";

/** Per-account accent: tinted icon tone + a series colour for the share bar (all ≥ 3:1 on the card). */
const LOOK: Record<string, { icon: IconName; tone: "soft1" | "soft2" | "soft3"; mark: string }> = {
  "acc-everyday": { icon: "wallet", tone: "soft1", mark: "var(--bar-chart-series-income)" },
  "acc-savings": { icon: "vault", tone: "soft2", mark: "var(--bar-chart-series-expense)" },
  "acc-usd": { icon: "globe", tone: "soft3", mark: "var(--color-chart-category-4)" },
};
const look = (id: string) =>
  LOOK[id] ?? { icon: "wallet" as IconName, tone: "soft1" as const, mark: "var(--bar-chart-fill)" };

const year = (iso: string) =>
  new Intl.DateTimeFormat(seed.meta.locale, { year: "numeric" }).format(
    new Date(`${iso}T12:00:00`),
  );

function CopyNumber({ value }: { value: string }) {
  const [state, setState] = useState<"idle" | "done" | "fail">("idle");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState("done");
    } catch {
      setState("fail");
    }
    setTimeout(() => setState("idle"), 1800);
  };
  return (
    <button
      type="button"
      className={`copy-btn${state === "done" ? " is-done" : ""}`}
      onClick={copy}
      aria-label={`Copy account number ${value}`}
    >
      <Icon name={state === "done" ? "check" : "copy"} size="var(--icon-size-sm)" />
      <span aria-live="polite">
        {state === "done" ? "Copied" : state === "fail" ? "Copy failed" : "Copy"}
      </span>
    </button>
  );
}

function AccountCard({ a, totalBase, hidden }: { a: Account; totalBase: number; hidden: boolean }) {
  const { state } = useDemo();
  const l = look(a.id);
  const act = accountActivity(state, a.id);
  const trend = balanceTrend(state, 30, a.id);
  const first = trend[0]?.balanceMinor ?? a.balanceMinor;
  const change = a.balanceMinor - first;
  const share = totalBase > 0 ? (toBase(a.balanceMinor, a.currency) / totalBase) * 100 : 0;
  const cards = state.cards.filter((c) => c.accountId === a.id);
  const monthName = new Intl.DateTimeFormat(seed.meta.locale, { month: "long" }).format(
    new Date(`${seed.meta.today}T12:00:00`),
  );

  return (
    <article className={`account-card kpi--${l.tone}`} aria-labelledby={`${a.id}-name`}>
      <header className="account-card__head">
        <span className="kpi__icon" aria-hidden="true">
          <Icon name={l.icon} size="var(--icon-size-md)" />
        </span>
        <div className="account-card__title">
          <h2 id={`${a.id}-name`} className="tile__title">
            {a.name}
          </h2>
          <p className="tile__subtitle">{a.type}</p>
        </div>
        <a
          className="icon-btn icon-btn--outline"
          href={`#/transactions?account=${a.id}`}
          aria-label={`Open ${a.name} transactions`}
        >
          <Icon name="arrowUpRight" size="var(--icon-size-md)" />
        </a>
      </header>

      <div className="account-card__balance">
        <p className="balance">
          {hidden ? (
            <span className="amt amt--xl">{formatHidden(a.currency)}</span>
          ) : (
            <Amount minor={a.balanceMinor} currency={a.currency} size="xl" />
          )}
        </p>
        <p className="account-card__chips">
          <span className="chip chip--neutral">{a.currency}</span>
          {!hidden && (
            <span
              className={`chip chip--${change > 0 ? "positive" : change < 0 ? "negative" : "neutral"}`}
            >
              {change === 0 ? "No change" : formatMoney(change, a.currency, true)} · 30 days
            </span>
          )}
          <span className="muted ts-caption-regular">{formatPercent(share)} of total</span>
        </p>
      </div>

      {!hidden && (
        <div className="account-card__trend">
          <TrendChart data={trend} currency={a.currency} height={64} />
        </div>
      )}

      <div className="account-card__month">
        <p className="account-card__month-head ts-label-sm">
          <span>{monthName}</span>
          <span className="muted">
            {act.count === 0
              ? "No activity yet"
              : `${act.count} ${act.count === 1 ? "payment" : "payments"}${act.pending ? ` · ${act.pending} pending` : ""}`}
          </span>
        </p>
        <div className="account-card__flows">
          <div className="flow-stat flow-stat--in">
            <span className="ts-caption-regular muted">Money in</span>
            {hidden ? (
              <span className="amt amt--sm">{formatHidden(a.currency)}</span>
            ) : (
              <Amount minor={act.income} currency={a.currency} size="sm" />
            )}
          </div>
          <div className="flow-stat flow-stat--out">
            <span className="ts-caption-regular muted">Money out</span>
            {hidden ? (
              <span className="amt amt--sm">{formatHidden(a.currency)}</span>
            ) : (
              <Amount minor={act.expenses} currency={a.currency} size="sm" />
            )}
          </div>
        </div>
      </div>

      <div className="account-card__number-row">
        <div className="account-card__number">
          <span className="ts-caption-regular muted">Account number</span>
          <span className="account-card__number-value">{a.number}</span>
        </div>
        <CopyNumber value={a.number} />
      </div>

      <dl className="details account-card__details">
        <div>
          <dt>Bank code</dt>
          <dd>{a.bankCode}</dd>
        </div>
        <div>
          <dt>Cards</dt>
          <dd className="account-card__cards">
            {cards.length === 0 ? (
              <span className="muted">None linked</span>
            ) : (
              cards.map((c) => (
                <span key={c.id} className="chip chip--neutral">
                  <Icon name="card" size="var(--icon-size-xs)" />
                  {c.kind === "virtual" ? "Virtual" : "Physical"} •••• {c.last4}
                </span>
              ))
            )}
          </dd>
        </div>
        <div>
          <dt>Opened</dt>
          <dd>
            {formatDay(a.openedAt)} {year(a.openedAt)}
          </dd>
        </div>
      </dl>

      <footer className="account-card__actions">
        <a className="btn btn--primary" href="#/transfers">
          <Icon name="send" size="var(--icon-size-sm)" /> Transfer
        </a>
        <a className="btn btn--secondary" href={`#/transactions?account=${a.id}`}>
          <Icon name="list" size="var(--icon-size-sm)" /> Transactions
        </a>
      </footer>
    </article>
  );
}

export function AccountsPage() {
  const { state } = useDemo();
  const hidden = state.prefs.hideBalances;
  const base = seed.meta.currency;
  const parts = state.accounts.map((a) => ({ a, base: toBase(a.balanceMinor, a.currency) }));
  const total = parts.reduce((s, p) => s + p.base, 0);
  const fxNote = state.accounts.some((a) => a.currency !== base);

  return (
    <div className="accounts-page">
      <Tile
        className="accounts-summary"
        icon="wallet"
        title="All accounts"
        subtitle={`${state.accounts.length} accounts · ${base} equivalent${fxNote ? " · USD at a fixed demo rate" : ""}`}
      >
        <div className="accounts-summary__row">
          <p className="balance">
            {hidden ? (
              <span className="amt amt--xl">{formatHidden(base)}</span>
            ) : (
              <Amount minor={total} currency={base} size="xl" />
            )}
          </p>
          <div className="accounts-summary__split">
            <div
              className="split-cats__bar"
              role="img"
              aria-label={`Share of total balance: ${parts.map((p) => `${p.a.name} ${formatPercent(total ? (p.base / total) * 100 : 0)}`).join(", ")}`}
            >
              {parts.map((p) => (
                <span
                  key={p.a.id}
                  style={{
                    width: `${total ? (p.base / total) * 100 : 0}%`,
                    background: look(p.a.id).mark,
                  }}
                />
              ))}
            </div>
            <ul className="accounts-summary__legend">
              {parts.map((p) => (
                <li key={p.a.id}>
                  <i className="dot" style={{ background: look(p.a.id).mark } as CSSProperties} />
                  <span className="ts-body-sm-regular">{p.a.name}</span>
                  <span className="muted ts-body-sm-regular">
                    {formatPercent(total ? (p.base / total) * 100 : 0)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Tile>
      <div className="accounts">
        {state.accounts.map((a) => (
          <AccountCard key={a.id} a={a} totalBase={total} hidden={hidden} />
        ))}
      </div>
    </div>
  );
}
