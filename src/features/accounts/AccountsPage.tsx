import { Amount } from "../../components/Amount";
import { Tile } from "../../components/Tile";
import { useDemo } from "../../data/store";
import { formatDay, formatHidden } from "../../lib/format";

export function AccountsPage() {
  const { state } = useDemo();
  return (
    <div className="accounts">
      {state.accounts.map((a) => (
        <Tile key={a.id} title={a.name} subtitle={`${a.type} · •••• ${a.last4}`}>
          <p className="balance">
            {state.prefs.hideBalances ? (
              <span className="amt amt--xl">{formatHidden(a.currency)}</span>
            ) : (
              <Amount minor={a.balanceMinor} currency={a.currency} size="xl" />
            )}
          </p>
          <dl className="details">
            <div>
              <dt>Account number</dt>
              <dd>{a.number}</dd>
            </div>
            <div>
              <dt>Bank code</dt>
              <dd>{a.bankCode}</dd>
            </div>
            <div>
              <dt>Currency</dt>
              <dd>{a.currency}</dd>
            </div>
            <div>
              <dt>Opened</dt>
              <dd>
                {formatDay(a.openedAt)} {new Date(a.openedAt).getFullYear()}
              </dd>
            </div>
          </dl>
          <a className="btn btn--primary" href="#/transfers">
            Transfer
          </a>
        </Tile>
      ))}
    </div>
  );
}
