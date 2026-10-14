import { useState } from "react";
import { Icon } from "../../components/Icon";
import { Tile } from "../../components/Tile";
import { seed } from "../../data/demo";
import { useDemo } from "../../data/store";
import { formatMoney, parseAmountMinor } from "../../lib/format";
import { initials } from "../transactions/TransactionsPage";

const STEPS = ["Recipient", "Amount", "Review", "Result"] as const;

export function TransferPage() {
  const { state, dispatch } = useDemo();
  const [step, setStep] = useState(0);
  const [recipientId, setRecipientId] = useState("");
  const [accountId, setAccountId] = useState(state.accounts[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [touched, setTouched] = useState(false);
  const [result, setResult] = useState<{ ref: string; minor: number; balance: number } | null>(
    null,
  );

  const account = state.accounts.find((a) => a.id === accountId);
  const recipient = seed.recipients.find((r) => r.id === recipientId);
  const minor = parseAmountMinor(amount);
  const cur = account?.currency ?? seed.meta.currency;
  const validMinor =
    minor !== null && minor > 0 && (!account || minor <= account.balanceMinor) ? minor : null;

  const error = !touched
    ? ""
    : amount.trim() === ""
      ? "Enter an amount."
      : minor === null
        ? "Use a number with up to two decimals."
        : minor <= 0
          ? "Amount must be greater than zero."
          : account && minor > account.balanceMinor
            ? "Amount exceeds the available balance."
            : "";

  const reset = () => {
    setStep(0);
    setRecipientId("");
    setAmount("");
    setReference("");
    setTouched(false);
    setResult(null);
  };

  const toReview = () => {
    setTouched(true);
    if (minor !== null && minor > 0 && account && minor <= account.balanceMinor) setStep(2);
  };

  const confirm = () => {
    if (!account || !recipient || minor === null) return;
    const ref =
      reference.trim() ||
      `ATLAS-DEMO-TRF-${String(state.transactions.length + 1).padStart(4, "0")}`;
    dispatch({ type: "transfer", accountId, recipientId, amountMinor: minor, reference: ref });
    setResult({ ref, minor, balance: account.balanceMinor - minor });
    setStep(3);
  };

  return (
    <div className="transfer">
      <ol className="steps" aria-label="Transfer progress">
        {STEPS.map((s, i) => (
          <li key={s} aria-current={i === step ? "step" : undefined} data-done={i < step}>
            <span className="steps__num">
              {i < step ? <Icon name="check" size="var(--icon-size-sm)" /> : i + 1}
            </span>
            <span>{s}</span>
          </li>
        ))}
      </ol>

      <div className="transfer__layout">
        <div className="transfer__main">
          {step === 0 && (
            <Tile
              title="Who are you sending to?"
              subtitle="Pick a recipient from your demo contacts"
            >
              <div className="radio-list" role="radiogroup" aria-label="Recipient">
                {seed.recipients.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    role="radio"
                    aria-checked={r.id === recipientId}
                    onClick={() => setRecipientId(r.id)}
                    className="radio-card"
                  >
                    <span className="avatar" aria-hidden="true">
                      {initials(r.name)}
                    </span>
                    <span className="radio-card__text">
                      <span className="ts-body-md-strong">{r.name}</span>
                      <span className="muted ts-body-sm-regular">•••• {r.last4}</span>
                    </span>
                    <span className="radio-card__mark" aria-hidden="true" />
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn btn--primary"
                disabled={!recipientId}
                onClick={() => setStep(1)}
              >
                Continue
              </button>
            </Tile>
          )}

          {step === 1 && (
            <Tile title="How much?" subtitle={recipient ? `To ${recipient.name}` : undefined}>
              <div className="form">
                <label className="field">
                  <span className="field__label ts-label-md">From</span>
                  <select
                    className="input"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                  >
                    {state.accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} · {formatMoney(a.balanceMinor, a.currency)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span className="field__label ts-label-md">Amount ({cur})</span>
                  <input
                    className="input input--amount"
                    inputMode="decimal"
                    value={amount}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? "amount-error" : undefined}
                    placeholder="0.00"
                    onChange={(e) => setAmount(e.target.value)}
                    onBlur={() => setTouched(true)}
                  />
                  {error && (
                    <span
                      id="amount-error"
                      role="alert"
                      className="field__error ts-body-sm-regular"
                    >
                      <Icon name="alert" size="var(--icon-size-sm)" />
                      {error}
                    </span>
                  )}
                </label>
                <label className="field">
                  <span className="field__label ts-label-md">Reference (optional)</span>
                  <input
                    className="input"
                    value={reference}
                    maxLength={35}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="e.g. Rent"
                  />
                </label>
              </div>
              <div className="actions">
                <button type="button" className="btn btn--secondary" onClick={() => setStep(0)}>
                  Back
                </button>
                <button type="button" className="btn btn--primary" onClick={toReview}>
                  Review
                </button>
              </div>
            </Tile>
          )}

          {step === 2 && account && recipient && minor !== null && (
            <Tile title="Review transfer" subtitle="Nothing is sent until you confirm">
              <dl className="details">
                <div>
                  <dt>To</dt>
                  <dd>
                    {recipient.name} •••• {recipient.last4}
                  </dd>
                </div>
                <div>
                  <dt>From</dt>
                  <dd>{account.name}</dd>
                </div>
                <div>
                  <dt>Amount</dt>
                  <dd className="ts-numeric-amount-md">{formatMoney(minor, cur)}</dd>
                </div>
                <div>
                  <dt>Fee</dt>
                  <dd>{formatMoney(0, cur)}</dd>
                </div>
                <div>
                  <dt>Delivery</dt>
                  <dd>Instant (demo)</dd>
                </div>
                {reference.trim() && (
                  <div>
                    <dt>Reference</dt>
                    <dd>{reference.trim()}</dd>
                  </div>
                )}
              </dl>
              <div className="actions">
                <button type="button" className="btn btn--secondary" onClick={() => setStep(1)}>
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={confirm}
                  data-event="transfer_confirm"
                >
                  Confirm transfer
                </button>
              </div>
            </Tile>
          )}

          {step === 3 && result && recipient && (
            <Tile title="Transfer sent" subtitle="Simulated — no real money moved">
              <div className="alert alert--success" role="status">
                <Icon name="check" />
                <span>
                  {formatMoney(result.minor, cur)} sent to {recipient.name}.
                </span>
              </div>
              <dl className="details">
                <div>
                  <dt>Reference</dt>
                  <dd>{result.ref}</dd>
                </div>
                <div>
                  <dt>New balance</dt>
                  <dd>{formatMoney(result.balance, cur)}</dd>
                </div>
              </dl>
              <div className="actions">
                <button type="button" className="btn btn--secondary" onClick={reset}>
                  New transfer
                </button>
                <a className="btn btn--primary" href="#/transactions">
                  View transactions
                </a>
              </div>
            </Tile>
          )}
        </div>

        {step < 3 && (
          <Tile className="transfer-summary" title="Summary" subtitle="Updates as you go">
            <dl className="details">
              <div>
                <dt>To</dt>
                <dd className={recipient ? undefined : "muted"}>
                  {recipient ? `${recipient.name} •••• ${recipient.last4}` : "Not selected"}
                </dd>
              </div>
              <div>
                <dt>From</dt>
                <dd>{account?.name ?? "—"}</dd>
              </div>
              <div>
                <dt>Available</dt>
                <dd className="ts-numeric-amount-md">
                  {account ? formatMoney(account.balanceMinor, account.currency) : "—"}
                </dd>
              </div>
              <div>
                <dt>Amount</dt>
                <dd className={`ts-numeric-amount-md${validMinor === null ? " muted" : ""}`}>
                  {formatMoney(validMinor ?? 0, cur)}
                </dd>
              </div>
              <div>
                <dt>Balance after</dt>
                <dd className="ts-numeric-amount-md">
                  {account ? formatMoney(account.balanceMinor - (validMinor ?? 0), cur) : "—"}
                </dd>
              </div>
              <div>
                <dt>Fee</dt>
                <dd>{formatMoney(0, cur)}</dd>
              </div>
            </dl>
            <p className="muted ts-caption-regular">
              Simulated transfer. Nothing leaves this demo.
            </p>
          </Tile>
        )}
      </div>
    </div>
  );
}
