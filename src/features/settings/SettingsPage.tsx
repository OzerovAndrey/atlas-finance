import { Switch } from "../../components/Switch";
import { Tile } from "../../components/Tile";
import type { Prefs } from "../../data/demo";
import { useDemo } from "../../data/store";
import { BRANDS, useTheme } from "../../lib/theme";

const PREFS: { key: keyof Prefs; title: string; detail: string }[] = [
  {
    key: "notifyPayments",
    title: "Payment notifications",
    detail: "Show a message after every payment",
  },
  {
    key: "hideBalances",
    title: "Hide balances on Overview",
    detail: "Mask the total balance and account balances",
  },
  { key: "reduceMotion", title: "Reduce motion", detail: "Turn off transitions and animations" },
];

export function SettingsPage() {
  const { brand, mode, setBrand, setMode } = useTheme();
  const { state, dispatch } = useDemo();
  return (
    <div className="settings">
      <Tile icon="sparkle" title="Appearance" subtitle="Brand and theme of this demo">
        <div className="brand-grid" role="radiogroup" aria-label="Brand">
          {BRANDS.map((b) => (
            <button
              key={b}
              type="button"
              role="radio"
              aria-checked={b === brand}
              className="radio-card"
              onClick={() => setBrand(b)}
            >
              <i className="dot-brand" data-brand={b} data-theme={mode} aria-hidden="true" />
              <span className="radio-card__text ts-body-md-strong">
                {b.charAt(0).toUpperCase() + b.slice(1)}
              </span>
              <span className="radio-card__mark" aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className="row">
          <div>
            <p className="ts-body-md-strong">Dark theme</p>
            <p className="muted ts-body-sm-regular">Follows your system until you change it</p>
          </div>
          <Switch
            checked={mode === "dark"}
            onChange={(v) => setMode(v ? "dark" : "light")}
            label="Dark theme"
          />
        </div>
      </Tile>

      <Tile icon="sliders" title="Preferences" subtitle="Saved for this visit only">
        <ul className="pref-list">
          {PREFS.map((p) => (
            <li key={p.key} className="row">
              <div>
                <p className="ts-body-md-strong">{p.title}</p>
                <p className="muted ts-body-sm-regular">{p.detail}</p>
              </div>
              <Switch
                checked={state.prefs[p.key]}
                onChange={(v) => dispatch({ type: "pref", key: p.key, value: v })}
                label={p.title}
              />
            </li>
          ))}
        </ul>
      </Tile>

      <Tile icon="reset" title="Demo data" subtitle="Everything here is fictional">
        <p className="muted ts-body-md-regular">
          Transfers, frozen cards and limits change only this browser session. Brand and theme
          changes never reset your data.
        </p>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => dispatch({ type: "reset" })}
          data-event="demo_reset"
        >
          Reset demo
        </button>
      </Tile>
    </div>
  );
}
