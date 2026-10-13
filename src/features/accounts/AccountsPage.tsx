import { Tile } from "../../components/Tile";
import { useDemo } from "../../data/store";
import { formatDay, formatHidden, formatMoney } from "../../lib/format";

export function AccountsPage() {
  const { state } = useDemo();
  return (
    <div className="accounts">
      {state.accounts.map((a) => (
        <Tile key={a.id} title={a.name} subtitle={`${a.type} · •••• ${a.last4}`}>
          <p className="balance ts-numeric-balance">
            {state.prefs.hideBalances
              ? formatHidden(a.currency)
              : formatMoney(a.balanceMinor, a.currency)}
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
          <a className="button button--primary" href="#/transfers">
            Transfer
          </a>
        </Tile>
      ))}
    </div>
  );
}
