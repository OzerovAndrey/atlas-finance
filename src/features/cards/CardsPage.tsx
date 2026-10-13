import { useState } from "react";
import { Icon } from "../../components/Icon";
import { Switch } from "../../components/Switch";
import { Tile } from "../../components/Tile";
import { accountName, cardUsedThisMonth } from "../../data/demo";
import { useDemo } from "../../data/store";
import type { Card } from "../../data/types";
import { formatMoney, formatPercent } from "../../lib/format";
import { useTheme } from "../../lib/theme";

const LIMITS = [50000, 100000, 200000, 500000];

function BankCard({ card }: { card: Card }) {
  const { brand } = useTheme();
  const frozen = card.status === "frozen";
  return (
    <div
      className={`bank-card ${frozen ? "bank-card--frozen" : ""}`}
      role="img"
      aria-label={`${card.name} ending ${card.last4}${frozen ? ", frozen" : ""}`}
    >
      <div className="bank-card__top">
        <span className="ts-label-overline">
          {card.kind === "virtual" ? "Virtual card" : "Your card"}
        </span>
        {frozen ? <Icon name="snow" /> : card.contactless && <Icon name="wifi" />}
      </div>
      <span className="bank-card__chip" />
      <p className="bank-card__number ts-numeric-amount-lg">•••• •••• •••• {card.last4}</p>
      <div className="bank-card__bottom ts-body-sm-strong">
        <span>ATLAS / {brand.toUpperCase()}</span>
        <span>{card.expires}</span>
      </div>
    </div>
  );
}

export function CardsPage() {
  const { state, dispatch } = useDemo();
  const [selectedId, setSelectedId] = useState(state.cards[0]?.id ?? "");
  const card = state.cards.find((c) => c.id === selectedId) ?? state.cards[0];
  if (!card) return null;
  const used = cardUsedThisMonth(state, card.id);
  const share = Math.min(1, used / card.monthlyLimitMinor);
  const cur = state.accounts.find((a) => a.id === card.accountId)?.currency ?? "EUR";

  return (
    <div className="cards-page">
      <div className="cards-page__list">
        {state.cards.map((c) => (
          <button
            key={c.id}
            type="button"
            className="card-pick"
            aria-pressed={c.id === card.id}
            onClick={() => setSelectedId(c.id)}
          >
            <BankCard card={c} />
            <span className="card-pick__name ts-body-md-strong">{c.name}</span>
          </button>
        ))}
      </div>

      <Tile title={card.name} subtitle={`${accountName(card.accountId)} · •••• ${card.last4}`}>
        <div className="row">
          <div>
            <p className="ts-body-md-strong">Freeze card</p>
            <p className="muted ts-body-sm-regular">
              {card.status === "frozen" ? "Payments are blocked" : "Block payments instantly"}
            </p>
          </div>
          <Switch
            checked={card.status === "frozen"}
            onChange={() => dispatch({ type: "toggleFreeze", cardId: card.id })}
            label="Freeze card"
            event="card_freeze"
          />
        </div>
        <div>
          <div className="progress__row ts-body-sm-regular">
            <span>Used this month</span>
            <span className="ts-numeric-amount-sm">
              {formatMoney(used, cur)} / {formatMoney(card.monthlyLimitMinor, cur)}
            </span>
          </div>
          <div
            className="progress"
            role="progressbar"
            aria-label="Monthly limit used"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(share * 100)}
          >
            <div className="progress__fill" style={{ width: `${share * 100}%` }} />
          </div>
          <p className="muted ts-body-sm-regular">{formatPercent(share * 100)} of limit</p>
        </div>
        <div>
          <p className="ts-body-md-strong">Monthly limit</p>
          <div className="segmented" role="group" aria-label="Monthly limit">
            {LIMITS.map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={l === card.monthlyLimitMinor}
                onClick={() => dispatch({ type: "setLimit", cardId: card.id, limitMinor: l })}
              >
                {formatMoney(l, cur).replace(/\.00$/, "")}
              </button>
            ))}
          </div>
        </div>
        <dl className="details">
          <div>
            <dt>Type</dt>
            <dd>{card.kind === "virtual" ? "Virtual" : "Physical"}</dd>
          </div>
          <div>
            <dt>Expires</dt>
            <dd>{card.expires}</dd>
          </div>
          <div>
            <dt>Contactless</dt>
            <dd>
              <span className={`badge ${card.contactless ? "badge--success" : "badge--neutral"}`}>
                {card.contactless ? "Enabled" : "Not available"}
              </span>
            </dd>
          </div>
        </dl>
      </Tile>
    </div>
  );
}
