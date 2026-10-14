// Shared token helpers (Tokens Studio legacy format): loading, flattening, per-configuration resolution.
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

export function flatten(obj, prefix = "", out = new Map()) {
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
export const isRef = (v) => typeof v === "string" && /^\{[^}]+\}$/.test(v);
export const refName = (v) => v.slice(1, -1);

export function parse(c) {
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
export const toHex = ({ r, g, b }) =>
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
export function modify(base, m) {
  const c = parse(base),
    [h, s, l] = hsl(c),
    v = parseFloat(m.value);
  if (m.type === "alpha")
    return `${toHex(c)}${Math.round(v * 255)
      .toString(16)
      .padStart(2, "0")}`;
  return toHex(unhsl(h, s, m.type === "lighten" ? l + (1 - l) * v : l * (1 - v)));
}

export const MODES = ["light", "dark"];

export function loadSets(root) {
  const T = resolve(root, "tokens");
  const read = (p) => JSON.parse(readFileSync(resolve(T, p), "utf8"));
  const BRANDS = readdirSync(resolve(T, "brand"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""))
    .sort();
  const sets = {
    core: flatten(read("core.json")),
    map: flatten(read("map.json")),
    typography: flatten(read("typography.json")),
    components: flatten(read("components.json")),
    brand: Object.fromEntries(BRANDS.map((b) => [b, flatten(read(`brand/${b}.json`))])),
    theme: Object.fromEntries(MODES.map((m) => [m, flatten(read(`theme/${m}.json`))])),
  };
  return { BRANDS, sets };
}

export function config(sets, brand, mode) {
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
    const resolveObj = (o) =>
      Object.fromEntries(
        Object.entries(o).map(([k, v]) => [k, isRef(v) ? res(refName(v), d + 1) : v]),
      );
    // arrays = multi-layer composites (e.g. layered boxShadow)
    if (Array.isArray(tk.value)) out = tk.value.map(resolveObj);
    else if (typeof tk.value === "object") out = resolveObj(tk.value);
    else if (isRef(tk.value)) {
      out = res(refName(tk.value), d + 1);
      if (tk.mod && tk.type === "color") out = modify(out, tk.mod);
    } else out = tk.value;
    cache.set(name, out);
    return out;
  };
  return { all, res };
}
