import { Switch } from "./Switch";
import { useDemo } from "../data/store";
import { BRANDS, useTheme } from "../lib/theme";

/** Floating demo control (bottom): brand pills + dark-mode switch. Same pattern as the first portfolio demo. */
export function DemoBar() {
  const { brand, mode, setBrand, setMode } = useTheme();
  const { dispatch } = useDemo();
  const dark = mode === "dark";
  return (
    <div className="demo-bar" role="region" aria-label="Demo controls">
      <div className="demo-bar__brands" role="group" aria-label="Brand">
        {BRANDS.map((b) => (
          <button
            key={b}
            type="button"
            aria-label={b.charAt(0).toUpperCase() + b.slice(1)}
            aria-pressed={b === brand}
            onClick={() => setBrand(b)}
            data-event={`brand_${b}`}
          >
            <i className="demo-bar__dot" data-brand={b} data-theme={mode} aria-hidden="true" />
            <span className="demo-bar__label">{b.charAt(0).toUpperCase() + b.slice(1)}</span>
          </button>
        ))}
      </div>
      <div className="demo-bar__theme">
        <Switch
          checked={dark}
          onChange={(v) => setMode(v ? "dark" : "light")}
          label="Dark theme"
          event={dark ? "theme_light" : "theme_dark"}
        />
        <span aria-hidden="true">Dark</span>
      </div>
      <button
        type="button"
        className="demo-bar__reset"
        onClick={() => dispatch({ type: "reset" })}
        data-event="demo_reset"
      >
        Reset demo
      </button>
    </div>
  );
}
