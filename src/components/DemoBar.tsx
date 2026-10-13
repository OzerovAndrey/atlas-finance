import { BRANDS, useTheme } from "../lib/theme";

/** Floating demo control (bottom): brand pills + dark-mode switch. Same pattern as the first portfolio demo. */
export function DemoBar() {
  const { brand, mode, setBrand, setMode } = useTheme();
  const dark = mode === "dark";
  return (
    <div className="demo-bar" role="region" aria-label="Demo controls">
      <div className="demo-bar__brands" role="group" aria-label="Brand">
        {BRANDS.map((b) => (
          <button
            key={b}
            type="button"
            aria-pressed={b === brand}
            onClick={() => setBrand(b)}
            data-event={`brand_${b}`}
          >
            <i className="demo-bar__dot" data-brand={b} data-theme={mode} aria-hidden="true" />
            {b.charAt(0).toUpperCase() + b.slice(1)}
          </button>
        ))}
      </div>
      <div className="demo-bar__theme">
        <button
          type="button"
          role="switch"
          aria-checked={dark}
          aria-label="Dark theme"
          className="switch"
          onClick={() => setMode(dark ? "light" : "dark")}
          data-event={dark ? "theme_light" : "theme_dark"}
        >
          <span className="switch__thumb" />
        </button>
        <span aria-hidden="true">Dark</span>
      </div>
    </div>
  );
}
