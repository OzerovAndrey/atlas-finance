import { useEffect, useState } from "react";
import { useDemo } from "../data/store";
import { BRANDS, useTheme } from "../lib/theme";
import { Icon } from "./Icon";
import { Switch } from "./Switch";

const KEY = "atlas.panel";
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Compact, collapsible demo control (bottom right): brand dots, dark theme, reset. Collapsed it is a small pill. */
export function DemoPanel() {
  const { brand, mode, setBrand, setMode } = useTheme();
  const { dispatch } = useDemo();
  const [open, setOpen] = useState(() => {
    try {
      const v = sessionStorage.getItem(KEY);
      if (v) return v === "open";
    } catch {
      /* ignore */
    }
    return matchMedia("(min-width: 1101px)").matches;
  });
  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, open ? "open" : "closed");
    } catch {
      /* ignore */
    }
  }, [open]);

  if (!open)
    return (
      <button
        type="button"
        className="demo-pill"
        onClick={() => setOpen(true)}
        aria-expanded="false"
        aria-controls="demo-panel"
        data-event="demo_open"
      >
        <i className="dot-brand" data-brand={brand} data-theme={mode} aria-hidden="true" />
        <span>Demo</span>
        <Icon name="chevronUp" size="var(--icon-size-sm)" />
      </button>
    );

  return (
    <section id="demo-panel" className="demo-panel" aria-label="Demo controls">
      <div className="demo-panel__brands" role="group" aria-label="Brand">
        {BRANDS.map((b) => (
          <button
            key={b}
            type="button"
            aria-pressed={b === brand}
            aria-label={cap(b)}
            title={cap(b)}
            onClick={() => setBrand(b)}
            data-event={`brand_${b}`}
          >
            <i className="dot-brand" data-brand={b} data-theme={mode} aria-hidden="true" />
          </button>
        ))}
      </div>
      <span className="demo-panel__name ts-label-md">{cap(brand)}</span>
      <span className="demo-panel__sep" aria-hidden="true" />
      <div className="demo-panel__theme">
        <span className="ts-label-sm">Dark</span>
        <Switch
          checked={mode === "dark"}
          onChange={(v) => setMode(v ? "dark" : "light")}
          label="Dark theme"
          event={mode === "dark" ? "theme_light" : "theme_dark"}
        />
      </div>
      <button
        type="button"
        className="icon-btn"
        onClick={() => dispatch({ type: "reset" })}
        aria-label="Reset demo data"
        title="Reset demo data"
        data-event="demo_reset"
      >
        <Icon name="reset" size="var(--icon-size-md)" />
      </button>
      <button
        type="button"
        className="icon-btn"
        onClick={() => setOpen(false)}
        aria-label="Collapse demo panel"
        aria-expanded="true"
        aria-controls="demo-panel"
      >
        <Icon name="chevronDown" size="var(--icon-size-md)" />
      </button>
    </section>
  );
}
