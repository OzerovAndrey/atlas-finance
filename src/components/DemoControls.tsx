import { useDemo } from "../data/store";
import { BRANDS, useTheme } from "../lib/theme";
import { Icon } from "./Icon";
import { Switch } from "./Switch";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Brand / theme / reset controls laid out for a sheet (mobile). Same actions as DemoPanel. */
export function DemoControls() {
  const { brand, mode, setBrand, setMode } = useTheme();
  const { dispatch } = useDemo();
  return (
    <section className="demo-controls" aria-label="Demo controls">
      <p className="ts-label-sm muted">ATLAS demo · one product, four brands</p>
      <div className="demo-controls__brands" role="group" aria-label="Brand">
        {BRANDS.map((b) => (
          <button
            key={b}
            type="button"
            aria-pressed={b === brand}
            onClick={() => setBrand(b)}
            data-event={`brand_${b}`}
          >
            <i className="dot-brand" data-brand={b} data-theme={mode} aria-hidden="true" />
            <span className="ts-label-sm">{cap(b)}</span>
          </button>
        ))}
      </div>
      <div className="demo-controls__row">
        <span className="ts-body-sm-regular">Dark theme</span>
        <Switch
          checked={mode === "dark"}
          onChange={(v) => setMode(v ? "dark" : "light")}
          label="Dark theme"
          event={mode === "dark" ? "theme_light" : "theme_dark"}
        />
        <button
          type="button"
          className="btn btn--secondary demo-controls__reset"
          onClick={() => dispatch({ type: "reset" })}
          data-event="demo_reset"
        >
          <Icon name="reset" size="var(--icon-size-sm)" /> Reset demo
        </button>
      </div>
    </section>
  );
}
