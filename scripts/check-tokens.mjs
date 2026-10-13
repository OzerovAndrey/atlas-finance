#!/usr/bin/env node
// ATLAS Finance token check: parity, layering, reserved names, reference resolution and WCAG contrast
// for every brand × theme configuration (4 × 2 = 8). Exit code 1 on any error.
import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const T = resolve(ROOT, "tokens");
const read = (p) => JSON.parse(readFileSync(resolve(T, p), "utf8"));
const BRANDS = readdirSync(resolve(T, "brand"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(".json", ""))
  .sort();
const MODES = ["light", "dark"];
const errors = [],
  warnings = [];

function flatten(obj, prefix = "", out = new Map()) {
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith("$")) continue;
    const name = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && "value" in v && "type" in v)
      out.set(name, {
        value: v.value,
        type: v.type,
        mod: v.$extensions?.["studio.tokens"]?.modify,
      });
    else if (v && typeof v === "object") flatten(v, name, out);
  }
  return out;
}
const sets = {
  core: flatten(read("core.json")),
  map: flatten(read("map.json")),
  typography: flatten(read("typography.json")),
  components: flatten(read("components.json")),
  brand: Object.fromEntries(BRANDS.map((b) => [b, flatten(read(`brand/${b}.json`))])),
  theme: Object.fromEntries(MODES.map((m) => [m, flatten(read(`theme/${m}.json`))])),
};
const isRef = (v) => typeof v === "string" && /^\{[^}]+\}$/.test(v);
const refName = (v) => v.slice(1, -1);
const keys = (m) => [...m.keys()].sort().join("\n");

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

// colour math (identical to Token Studio modify, hsl)
function parse(c) {
  c = c.trim();
  if (c.startsWith("#")) {
    const h = c.slice(1);
    const n = parseInt(h.slice(0, 6), 16);
    return {
      r: (n >> 16) & 255,
      g: (n >> 8) & 255,
      b: n & 255,
      a: h.length === 8 ? parseInt(h.slice(6), 16) / 255 : 1,
    };
  }
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) throw new Error("bad colour " + c);
  const [r, g, b, a = 1] = m[1].split(",").map(Number);
  return { r, g, b, a };
}
const toHex = ({ r, g, b }) =>
  "#" +
  [r, g, b]
    .map((x) => Math.round(x).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
function hsl({ r, g, b }) {
  r /= 255;
  g /= 255;
  b /= 255;
  const mx = Math.max(r, g, b),
    mn = Math.min(r, g, b),
    l = (mx + mn) / 2;
  let h = 0,
    s = 0;
  if (mx !== mn) {
    const d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h /= 6;
  }
  return [h, s, l];
}
function unhsl(h, s, l) {
  const f = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  let r, g, b;
  if (s === 0) r = g = b = l;
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s,
      p = 2 * l - q;
    r = f(p, q, h + 1 / 3);
    g = f(p, q, h);
    b = f(p, q, h - 1 / 3);
  }
  return { r: r * 255, g: g * 255, b: b * 255 };
}
function modify(base, m) {
  const c = parse(base),
    [h, s, l] = hsl(c),
    v = parseFloat(m.value);
  if (m.type === "alpha")
    return `${toHex(c)}${Math.round(v * 255)
      .toString(16)
      .padStart(2, "0")}`;
  return toHex(unhsl(h, s, m.type === "lighten" ? l + (1 - l) * v : l * (1 - v)));
}
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

// resolution per configuration: later sets override earlier (core → brand → map → theme → typography → components)
function config(brand, mode) {
  const all = new Map();
  for (const m of [
    sets.core,
    sets.brand[brand],
    sets.map,
    sets.theme[mode],
    sets.typography,
    sets.components,
  ])
    for (const [k, v] of m) all.set(k, v);
  const cache = new Map();
  const res = (name, d = 0) => {
    if (d > 20) throw new Error("reference cycle at " + name);
    if (cache.has(name)) return cache.get(name);
    const tk = all.get(name);
    if (!tk) throw new Error("unresolved reference: " + name);
    let out;
    if (typeof tk.value === "object")
      out = Object.fromEntries(
        Object.entries(tk.value).map(([k, v]) => [k, isRef(v) ? res(refName(v), d + 1) : v]),
      );
    else if (isRef(tk.value)) {
      out = res(refName(tk.value), d + 1);
      if (tk.mod && tk.type === "color") out = modify(out, tk.mod);
    } else out = tk.value;
    cache.set(name, out);
    return out;
  };
  return { all, res };
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
