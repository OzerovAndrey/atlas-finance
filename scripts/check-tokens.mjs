#!/usr/bin/env node
// ATLAS Finance token check: parity, layering, reserved names, reference resolution and WCAG contrast
// for every brand × theme configuration (4 × 2 = 8). Exit code 1 on any error.
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadSets, config as configFor, isRef, refName, parse, MODES } from "./lib/tokens.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { BRANDS, sets } = loadSets(ROOT);
const errors = [],
  warnings = [];
const keys = (m) => [...m.keys()].sort().join("\n");
const config = (brand, mode) => configFor(sets, brand, mode);

// 1. parity
for (const b of BRANDS)
  if (keys(sets.brand[b]) !== keys(sets.brand[BRANDS[0]]))
    errors.push(`brand/${b} keys differ from brand/${BRANDS[0]}`);
if (keys(sets.theme.light) !== keys(sets.theme.dark))
  errors.push("theme/light and theme/dark keys differ");

// 2. reserved group names
for (const [label, m] of Object.entries({
  core: sets.core,
  map: sets.map,
  typography: sets.typography,
  components: sets.components,
  ...Object.fromEntries(BRANDS.map((b) => [`brand/${b}`, sets.brand[b]])),
  ...Object.fromEntries(MODES.map((x) => [`theme/${x}`, sets.theme[x]])),
}))
  for (const n of m.keys())
    for (const r of ["value", "type", "description"])
      if (n.split(".").slice(0, -1).includes(r))
        errors.push(`${label}: ${n}: group name "${r}" is reserved (use amount / detail)`);

// 3. layering: components → theme | brand | typography only (never core / map)
const upper = (n) => sets.core.has(n) || sets.map.has(n);
for (const [n, tk] of sets.components) {
  const vals = typeof tk.value === "object" ? Object.values(tk.value) : [tk.value];
  for (const v of vals) {
    if (!isRef(v)) {
      errors.push(`components.${n}: raw value "${v}" (components must alias)`);
      continue;
    }
    if (upper(refName(v)))
      errors.push(`components.${n} → ${refName(v)}: components must not read core/map`);
  }
}
// brand and theme must not hold raw dimensions: brand dims alias core; theme colors alias (except rgba overlays/shadows)

const lum = ({ r, g, b }) => {
  const f = (x) => {
    x /= 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrast = (a, b) => {
  const A = lum(parse(a)),
    B = lum(parse(b));
  return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05);
};
function oklab({ r, g, b }) {
  const lin = (x) => {
    x /= 255;
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  const [R, G, B] = [lin(r), lin(g), lin(b)];
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B),
    m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B),
    s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

const PAIRS = [
  // [fg, bg, min ratio, label]
  ...["text.primary", "text.secondary", "text.tertiary"].flatMap((f) =>
    ["bg.primary", "bg.secondary", "bg.tertiary"].map((b) => [
      `color.${f}`,
      `color.${b}`,
      4.5,
      "text",
    ]),
  ),
  ["color.text.primary", "color.bg.sidebar", 4.5, "text"],
  ["color.text.secondary", "color.bg.sidebar", 4.5, "text"],
  ["color.text.onPrimary", "color.fill.primary.default", 4.5, "button"],
  ["color.text.onPrimary", "color.fill.primary.hover", 4.5, "button"],
  ["color.text.onPrimary", "color.fill.primary.active", 4.5, "button"],
  ["color.text.onAccent", "color.fill.accent.default", 4.5, "button"],
  ["color.text.onDanger", "color.fill.danger.default", 4.5, "button"],
  ["color.text.onDanger", "color.fill.danger.hover", 4.5, "button"],
  ["color.text.primary", "color.fill.secondary.default", 4.5, "button"],
  ["color.text.primary", "color.fill.secondary.hover", 4.5, "button"],
  ["color.text.primary", "color.fill.secondary.active", 4.5, "button"],
  ["color.text.primary", "color.fill.ghost.hover", 4.5, "button"],
  ["color.text.primary", "color.fill.ghost.active", 4.5, "button"],
  ...["accent", "success", "warning", "danger", "info"].flatMap((f) =>
    ["bg.primary", "bg.secondary"].map((b) => [`color.text.${f}`, `color.${b}`, 4.5, "text"]),
  ),
  ["color.text.accent", "color.fill.primary.subtle", 4.5, "nav selected"],
  ...["success", "warning", "danger", "info"].map((k) => [
    `color.status.${k}.fg`,
    `color.status.${k}.bg`,
    4.5,
    "status",
  ]),
  ...["positive", "negative", "neutral"].flatMap((a) =>
    ["bg.primary", "bg.secondary"].map((b) => [`color.amount.${a}`, `color.${b}`, 4.5, "amount"]),
  ),
  ["color.card.faceText", "color.card.face", 4.5, "bank card"],
  ["color.card.faceMuted", "color.card.face", 4.5, "bank card"],
  ["color.border.primary", "color.bg.primary", 3, "UI boundary"],
  ["color.border.primary", "color.bg.secondary", 3, "UI boundary"],
  ["color.border.accent", "color.bg.secondary", 3, "UI boundary"],
  ["color.border.danger", "color.bg.secondary", 3, "UI boundary"],
  ["color.outline.focus", "color.bg.primary", 3, "focus ring"],
  ["color.outline.focus", "color.bg.secondary", 3, "focus ring"],
  ["color.outline.focus", "color.fill.primary.subtle", 3, "focus ring"],
  ...Array.from({ length: 8 }, (_, i) => [
    `color.chart.category.${i + 1}`,
    "color.bg.secondary",
    3,
    "chart series",
  ]),
  ["color.chart.axis", "color.bg.secondary", 4.5, "chart text"],
  ["color.chart.series.income", "color.bg.secondary", 3, "chart series"],
  ["color.chart.series.expense", "color.bg.secondary", 3, "chart series"],
  ["color.text.tertiary", "color.bg.tertiary", 4.5, "text"],
  ...["primary", "inverse", "soft1", "soft2", "soft3"].flatMap((n) => [
    [`color.tone.${n}.fg`, `color.tone.${n}.bg`, 4.5, `tone ${n}`],
    [`color.tone.${n}.muted`, `color.tone.${n}.bg`, 4.5, `tone ${n} muted`],
    [`color.tone.${n}.icon`, `color.tone.${n}.iconBg`, 3, `tone ${n} icon`],
  ]),
  ["color.chart.bar.fill", "color.bg.secondary", 3, "bar chart"],
  ["color.chart.accent", "color.bg.secondary", 3, "chart accent"],
  ["color.chart.accent", "color.bg.primary", 3, "chart accent"],
  ["color.chart.accent", "color.fill.secondary.default", 3, "nav icon on selected"],
  ["color.chart.series.income", "color.bg.secondary", 3, "money flow income"],
  ["color.chart.series.expense", "color.bg.secondary", 3, "money flow expense"],
  ["color.tone.primary.ctaFg", "color.tone.primary.cta", 4.5, "hero CTA"],
  ["color.tone.primary.cta", "color.tone.primary.bg", 3, "hero CTA vs card"],
  ["color.chart.bar.highlight", "color.bg.secondary", 3, "bar chart highlight"],
  ["color.chart.bar.fill", "color.chart.bar.track", 1.5, "bar fill vs track"],
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((i) => [
    `color.chart.category.${i}`,
    "color.chart.bar.track",
    3,
    `category ${i} vs track`,
  ]),
  ...["positive", "negative"].map((a) => [
    `color.amount.${a}`,
    "color.bg.tertiary",
    4.5,
    "amount on row",
  ]),
  ["color.text.accent", "color.bg.tertiary", 4.5, "accent on row"],
  ["color.text.secondary", "color.fill.secondary.default", 3, "switch thumb off"],
  ["color.text.onPrimary", "color.fill.primary.default", 3, "switch thumb on / checkmark"],
  ["color.text.primary", "color.bg.tertiary", 4.5, "table"],
  ["color.text.secondary", "color.bg.tertiary", 4.5, "table header"],
  ["color.text.accent", "color.bg.secondary", 4.5, "link"],
  ["color.text.primary", "color.fill.ghost.hover", 4.5, "tab / row hover"],
  ["color.text.accent", "color.fill.ghost.hover", 4.5, "link hover row"],
];

let configs = 0,
  checked = 0;
for (const brand of BRANDS)
  for (const mode of MODES) {
    const id = `${brand}/${mode}`;
    configs++;
    const { all, res } = config(brand, mode);
    for (const name of all.keys()) {
      try {
        res(name);
      } catch (e) {
        errors.push(`${id}: ${name}: ${e.message}`);
      }
    }
    for (const [f, b, min, label] of PAIRS) {
      try {
        const r = contrast(res(f), res(b));
        checked++;
        if (r < min) errors.push(`${id}: ${label}: ${f} on ${b} = ${r.toFixed(2)} (< ${min})`);
      } catch (e) {
        errors.push(`${id}: ${f} on ${b}: ${e.message}`);
      }
    }
    // chart series must be mutually distinguishable (OKLab distance)
    const cats = Array.from({ length: 8 }, (_, i) =>
      oklab(parse(res(`color.chart.category.${i + 1}`))),
    );
    for (let i = 0; i < 8; i++)
      for (let j = i + 1; j < 8; j++) {
        const d = Math.hypot(...cats[i].map((v, k) => v - cats[j][k]));
        if (d < 0.06)
          errors.push(`${id}: chart.category.${i + 1} vs ${j + 1} too close (ΔOK=${d.toFixed(3)})`);
      }
  }
for (const w of warnings) console.warn("warn:", w);
if (errors.length) {
  console.error(`✗ ${errors.length} token error(s):\n` + errors.map((e) => "  " + e).join("\n"));
  process.exit(1);
}
console.log(
  `✓ tokens ok: ${configs} configurations (${BRANDS.join(", ")} × ${MODES.join(", ")}), ${checked} contrast checks`,
);
