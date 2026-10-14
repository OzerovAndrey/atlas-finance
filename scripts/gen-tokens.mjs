// Token generator for ATLAS Finance (Tokens Studio legacy format). Output = source of truth in tokens/. Run: node scripts/gen-tokens.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUT = new URL("../tokens", import.meta.url).pathname;
const W = (p, o) => {
  mkdirSync(dirname(`${OUT}/${p}`), { recursive: true });
  writeFileSync(`${OUT}/${p}`, JSON.stringify(o, null, 2) + "\n");
};
const t = (value, type, description) =>
  description ? { value, type, description } : { value, type };
const ref = (p) => `{${p}}`;

// ---------- core ----------
const dim = [0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 72, 80, 96];
const radii = [0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 999];
const sizes = [10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 56, 64];
const lines = [14, 16, 20, 24, 26, 28, 32, 36, 40, 48, 56, 64, 72];
const core = {
  dimension: Object.fromEntries(dim.map((d) => [d, t(String(d), "sizing")])),
  borderRadius: Object.fromEntries(radii.map((d) => [d, t(String(d), "borderRadius")])),
  borderWidth: { 0: t("0", "borderWidth"), 1: t("1", "borderWidth"), 2: t("2", "borderWidth") },
  fontWeight: {
    regular: t("400", "fontWeights"),
    medium: t("500", "fontWeights"),
    semibold: t("600", "fontWeights"),
    bold: t("700", "fontWeights"),
  },
  fontSize: Object.fromEntries(sizes.map((d) => [d, t(String(d), "fontSizes")])),
  lineHeight: Object.fromEntries(lines.map((d) => [d, t(String(d), "lineHeights")])),
  letterSpacing: {
    none: t("0%", "letterSpacing"),
    tight: t("-1%", "letterSpacing"),
    tighter: t("-2%", "letterSpacing"),
    wide: t("8%", "letterSpacing"),
  },
  textCase: { none: t("none", "textCase"), uppercase: t("uppercase", "textCase") },
  duration: {
    fast: t("120ms", "duration", "hover, focus"),
    base: t("200ms", "duration", "state change, brand/theme switch"),
    slow: t("320ms", "duration", "dialogs, toasts"),
  },
  curve: {
    standard: t("cubic-bezier(0.2, 0, 0, 1)", "cubicBezier"),
    out: t("cubic-bezier(0, 0, 0.58, 1)", "cubicBezier"),
  },
  color: {
    white: t("#FFFFFF", "color"),
    black: t("#000000", "color"),
    transparent: t("rgba(0, 0, 0, 0)", "color"),
    chart: {}, // filled below (primitive hues, two tones: 300 for dark theme, 600 for light theme)
  },
};
// chart hues: OKLCH L/C/H -> sRGB hex (gamut-clamped by chroma reduction)
function oklch2hex(L, C, H) {
  const lin = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
  const conv = (c) => {
    const h = (H * Math.PI) / 180,
      a = c * Math.cos(h),
      b = c * Math.sin(h);
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b,
      m_ = L - 0.1055613458 * a - 0.0638541728 * b,
      s_ = L - 0.0894841775 * a - 1.291485548 * b;
    const l = l_ ** 3,
      m = m_ ** 3,
      s = s_ ** 3;
    return [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ];
  };
  let c = C,
    rgb = conv(c);
  while (rgb.some((v) => v < -0.0005 || v > 1.0005) && c > 0) {
    c -= 0.002;
    rgb = conv(c);
  }
  return (
    "#" +
    rgb
      .map((v) =>
        Math.round(Math.min(1, Math.max(0, lin(Math.min(1, Math.max(0, v))))) * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
      .toUpperCase()
  );
}
// order = category slot 1–8; neighbours alternate warm / cool so adjacent segments stay distinct
const hues = [
  ["blue", 258],
  ["teal", 190],
  ["violet", 295],
  ["orange", 45],
  ["pink", 355],
  ["green", 150],
  ["amber", 78],
  ["lime", 125],
];
for (const [name, h] of hues)
  core.color.chart[name] = {
    300: t(oklch2hex(0.8, 0.14, h), "color"),
    600: t(oklch2hex(0.58, 0.17, h), "color"),
  };
W("core.json", core);

// One neutral ramp for every brand (shared neutral base; brands differ by accent, logo and shape tokens).
const NEUTRAL = {
  0: "#FFFFFF",
  50: "#F5F6F8",
  100: "#F0F2F5",
  200: "#E3E6EA",
  300: "#CBD0D6",
  400: "#9AA1AB",
  500: "#646C77",
  600: "#4A525C",
  700: "#363D45",
  800: "#22262C",
  900: "#151719",
  950: "#0B0D0F",
};
const neutralRamp = () =>
  Object.fromEntries(Object.entries(NEUTRAL).map(([k, v]) => [k, t(v, "color")]));

const sh = (x, y, blur, spread, color) => ({
  x: String(x),
  y: String(y),
  blur: String(blur),
  spread: String(spread),
  color,
  type: "dropShadow",
});

// ---------- brands ----------
const B = {
  vanta: {
    on1: "color.neutral.900",
    on1m: "#3F3724",
    on2: "color.white",
    p1: "#C8A96A",
    p1h: "#D6BC85",
    p1a: "#B8964F",
    p2: "#3A3F46",
    p3: "#8B96A5",
    chart: "#A8843C",
    chart2: "#2E3238",
    chart2d: "#8E99A8",
    paper: "#F3F1EC",
    backdrop: "#E2DDD2",
    frame: 32,
    ink: "#17181B",
    ctl: 12,
    srf: 16,
    tile: 24,
    rnd: 999,
    pad: [8, 12, 16, 20, 24],
    gap: [4, 6, 8, 12, 16],
  },
  pulse: {
    on1: "color.neutral.900",
    on1m: "#2E3A0C",
    on2: "color.white",
    p1: "#C6F432",
    p1h: "#D4F85A",
    p1a: "#B2DD1C",
    p2: "#6E56F0",
    p3: "#4DB6E8",
    chart: "#6E56F0",
    chart2: "#1E2210",
    chart2d: "#B3A6FF",
    paper: "#F1F0F7",
    backdrop: "#DDDAEC",
    frame: 32,
    ink: "#171C0B",
    ctl: 999,
    srf: 20,
    tile: 28,
    rnd: 999,
    pad: [12, 16, 20, 24, 32],
    gap: [6, 8, 10, 12, 16],
  },
  north: {
    on1: "color.white",
    on1m: "#F3F6FF",
    on2: "color.white",
    p1: "#2A5FEA",
    p1h: "#1C4FD4",
    p1a: "#1640B0",
    p2: "#0F2A66",
    p3: "#7FA8FF",
    chart: "#2A5FEA",
    chart2: "#0F2A66",
    chart2d: "#4F6FD8",
    paper: "#EDF2FA",
    backdrop: "#D5E0F0",
    frame: 24,
    ink: "#0E1D3F",
    ctl: 10,
    srf: 12,
    tile: 20,
    rnd: 12,
    pad: [8, 12, 16, 20, 24],
    gap: [4, 6, 8, 12, 16],
  },
  flow: {
    on1: "color.white",
    on1m: "#F0FAF8",
    on2: "color.neutral.900",
    p1: "#087A6F",
    p1h: "#076A60",
    p1a: "#055750",
    p2: "#FF7A5C",
    p3: "#F4B860",
    chart: "#087A6F",
    chart2: "#D9573A",
    chart2d: "#FF9E85",
    paper: "#EDF4F2",
    backdrop: "#D3E4DE",
    frame: 32,
    ink: "#0B2E2B",
    ctl: 16,
    srf: 20,
    tile: 28,
    rnd: 999,
    pad: [12, 16, 20, 24, 28],
    gap: [6, 8, 10, 12, 16],
  },
};
const xs = ["xs", "sm", "md", "lg", "xl"];
for (const [k, b] of Object.entries(B)) {
  const o = {
    color: {
      product1: t(b.p1, "color", "signature accent"),
      product2: t(b.p2, "color"),
      product3: t(b.p3, "color"),
      product1Hover: t(b.p1h, "color", "primary fill, hover state (keeps text contrast)"),
      product1Active: t(b.p1a, "color", "primary fill, pressed state"),
      chartAccent: t(
        b.chart,
        "color",
        "accent usable as a mark on white (>= 3:1); dark theme uses product1",
      ),
      chartAccent2: t(
        b.chart2,
        "color",
        "second series colour (expenses) usable as a mark on white (>= 3:1)",
      ),
      chartAccent2Dark: t(b.chart2d, "color", "second series colour on dark surfaces"),
      onProduct1: t(ref(b.on1), "color"),
      onProduct1Muted: t(b.on1m, "color", "secondary text on the product1 surface"),
      onProduct2: t(ref(b.on2), "color"),
      success: t("#1F9D5B", "color"),
      warning: t("#E69A12", "color"),
      danger: t("#D23B34", "color"),
      info: t(
        "#3B82C4",
        "color",
        "informational blue — identical in every brand (never a brand colour, so it cannot read as warning)",
      ),
      ink: t(
        b.ink,
        "color",
        "bank card face (dark tone) and inverse surfaces; brand-tinted graphite",
      ),
      surface: t("#1B1F24", "color", "dark-theme elevated surface (shared)"),
      paper: t(b.paper, "color", "light-theme page canvas, lightly brand-tinted"),
      backdrop: t(b.backdrop, "color", "light-theme area around the app frame"),
      cardFace: t(NEUTRAL[50], "color", "bank card face (light tone)"),
      neutral: neutralRamp(),
    },
    fontFamily: { display: t("Inter", "fontFamilies"), base: t("Inter", "fontFamilies") },
    logo: Object.fromEntries(
      Object.keys(B).map((x) => [
        x,
        t(
          String(x === k),
          "boolean",
          "visibility switch: the layer for this brand's logo is shown only in its own Brand mode",
        ),
      ]),
    ),
    space: {
      padding: Object.fromEntries(
        xs.map((s, i) => [s, t(ref(`dimension.${b.pad[i]}`), "spacing")]),
      ),
      gap: Object.fromEntries(xs.map((s, i) => [s, t(ref(`dimension.${b.gap[i]}`), "spacing")])),
    },
    borderRadius: {
      control: t(ref(`borderRadius.${b.ctl}`), "borderRadius"),
      surface: t(ref(`borderRadius.${b.srf}`), "borderRadius"),
      tile: t(ref(`borderRadius.${b.tile}`), "borderRadius", "bento tile / large card (20–28)"),
      round: t(
        ref(`borderRadius.${b.rnd}`),
        "borderRadius",
        "icon buttons: circle or rounded square, shape differs per brand",
      ),
      frame: t(ref(`borderRadius.${b.frame}`), "borderRadius", "outer app frame"),
      full: t(ref("borderRadius.999"), "borderRadius", "pills, chips, avatars"),
    },
    borderWidth: {
      none: t(ref("borderWidth.0"), "borderWidth"),
      control: t(ref("borderWidth.1"), "borderWidth"),
      strong: t(ref("borderWidth.2"), "borderWidth"),
    },
    size: {
      control: Object.fromEntries(
        xs.map((s, i) => [s, t(ref(`dimension.${[24, 32, 40, 48, 56][i]}`), "sizing")]),
      ),
    },
    iconSize: Object.fromEntries(
      xs.map((s, i) => [s, t(ref(`dimension.${[12, 16, 20, 24, 32][i]}`), "sizing")]),
    ),
  };
  W(`brand/${k}.json`, o);
}

// ---------- map (ramps; identical maths to the demo) ----------
const mod = (base, type, value) => ({
  value: ref(base),
  type: "color",
  $extensions: { "studio.tokens": { modify: { type, value: String(value), space: "hsl" } } },
});
const raw = (base) => ({ value: ref(base), type: "color" });
const ramp5 = (c, d9 = 0.55) => ({
  100: mod(c, "lighten", 0.85),
  200: mod(c, "lighten", 0.7),
  300: mod(c, "lighten", 0.5),
  500: raw(c),
  700: mod(c, "darken", 0.25),
  900: mod(c, "darken", d9),
});
W("map.json", {
  color: {
    product1: ramp5("color.product1", 0.7),
    product2: ramp5("color.product2", 0.7),
    product3: ramp5("color.product3", 0.7),
    success: ramp5("color.success"),
    warning: ramp5("color.warning"),
    danger: ramp5("color.danger"),
    info: ramp5("color.info"),
  },
});

// ---------- theme ----------
const c = (p) => t(ref(p), "color");
const rgba = (s) => t(s, "color");
function theme(m) {
  const L = m === "light";
  const fills = {
    primary: {
      default: "color.product1.500",
      hover: "color.product1Hover",
      active: "color.product1Active",
      disabled: L ? "color.neutral.200" : "color.neutral.700",
      subtle: L ? "color.product1.100" : "color.product1.900",
    },
    secondary: {
      default: L ? "color.neutral.100" : "color.neutral.800",
      hover: L ? "color.neutral.200" : "color.neutral.700",
      active: L ? "color.neutral.200" : "color.neutral.700",
      disabled: L ? "color.neutral.100" : "color.neutral.800",
    },
    ghost: {
      default: "color.transparent",
      hover: L ? "color.neutral.100" : "color.neutral.800",
      active: L ? "color.neutral.200" : "color.neutral.700",
      disabled: "color.transparent",
    },
    accent: {
      default: "color.product2.500",
      disabled: L ? "color.neutral.200" : "color.neutral.700",
      subtle: L ? "color.product2.100" : "color.product2.900",
    },
    success: {
      default: "color.success.500",
      subtle: L ? "color.success.100" : "color.success.900",
    },
    warning: {
      default: "color.warning.500",
      subtle: L ? "color.warning.100" : "color.warning.900",
    },
    danger: {
      default: "color.danger.500",
      hover: "color.danger.700",
      active: "color.danger.900",
      disabled: L ? "color.neutral.200" : "color.neutral.700",
      subtle: L ? "color.danger.100" : "color.danger.900",
    },
    info: { default: "color.info.500", subtle: L ? "color.info.100" : "color.info.900" },
  };
  const grp = (o) =>
    Object.fromEntries(
      Object.entries(o).map(([k, v]) => [k, typeof v === "string" ? c(v) : grp(v)]),
    );
  const cat = {};
  hues.forEach(([name], i) => (cat[i + 1] = c(`color.chart.${name}.${L ? 600 : 300}`)));

  const T = (bg, fg, muted, iconBg, icon) => ({
    bg: c(bg),
    fg: c(fg),
    muted: c(muted),
    iconBg: c(iconBg),
    icon: c(icon),
  });
  const tones = {
    primary: {
      ...T(
        "color.product1.500",
        "color.onProduct1",
        "color.onProduct1Muted",
        "color.neutral.900",
        "color.product1.500",
      ),
      cta: c("color.neutral.900"),
      ctaFg: c("color.neutral.0"),
    },
    inverse: L
      ? T(
          "color.neutral.900",
          "color.neutral.0",
          "color.neutral.300",
          "color.product1.500",
          "color.onProduct1",
        )
      : T(
          "color.neutral.50",
          "color.neutral.900",
          "color.neutral.600",
          "color.product1.500",
          "color.onProduct1",
        ),
    soft1: L
      ? T(
          "color.product1.100",
          "color.neutral.900",
          "color.neutral.700",
          "color.neutral.0",
          "color.product1.900",
        )
      : T(
          "color.product1.900",
          "color.neutral.0",
          "color.neutral.100",
          "color.neutral.900",
          "color.product1.200",
        ),
    soft2: L
      ? T(
          "color.product2.100",
          "color.neutral.900",
          "color.neutral.700",
          "color.neutral.0",
          "color.product2.900",
        )
      : T(
          "color.product2.900",
          "color.neutral.0",
          "color.neutral.100",
          "color.neutral.900",
          "color.product2.200",
        ),
    soft3: L
      ? T(
          "color.product3.100",
          "color.neutral.900",
          "color.neutral.700",
          "color.neutral.0",
          "color.product3.900",
        )
      : T(
          "color.product3.900",
          "color.neutral.0",
          "color.neutral.100",
          "color.neutral.900",
          "color.product3.200",
        ),
  };
  const sem = (k, lightStep, darkStep) => `color.${k}.${L ? lightStep : darkStep}`;
  return {
    color: {
      bg: {
        backdrop: c(L ? "color.backdrop" : "color.black"),
        primary: c(L ? "color.paper" : "color.neutral.950"),
        secondary: c(L ? "color.neutral.0" : "color.neutral.900"),
        tertiary: c(L ? "color.neutral.100" : "color.neutral.800"),
        sidebar: c(L ? "color.paper" : "color.neutral.950"),
        overlay: rgba(L ? "rgba(21, 23, 25, 0.5)" : "rgba(0, 0, 0, 0.6)"),
      },
      fill: grp(fills),
      text: grp({
        primary: L ? "color.neutral.900" : "color.neutral.50",
        secondary: L ? "color.neutral.600" : "color.neutral.300",
        tertiary: L ? "color.neutral.500" : "color.neutral.400",
        quaternary: L ? "color.neutral.400" : "color.neutral.500",
        onPrimary: "color.onProduct1",
        onAccent: "color.onProduct2",
        accent: L ? "color.product1.900" : "color.product1.200",
        success: sem("success", 700, 200),
        warning: sem("warning", 900, 200),
        danger: sem("danger", 700, 300),
        info: sem("info", 900, 100),
        onDanger: "color.white",
        onSuccess: "color.white",
        onOverlay: "color.white",
      }),
      border: grp({
        none: "color.transparent",
        surface: L ? "color.neutral.100" : "color.neutral.800",
        tertiary: L ? "color.neutral.200" : "color.neutral.800",
        secondary: L ? "color.neutral.300" : "color.neutral.700",
        primary: L ? "color.neutral.500" : "color.neutral.400",
        accent: L ? "color.chartAccent" : "color.product1.300",
        danger: L ? "color.danger.700" : "color.danger.300",
      }),
      outline: grp({ focus: L ? "color.chartAccent" : "color.product1.300" }),
      amount: grp({
        positive: sem("success", 700, 200),
        negative: sem("danger", 700, 100),
        neutral: L ? "color.neutral.900" : "color.neutral.0",
      }),
      status: grp({
        success: {
          fg: sem("success", 700, 200),
          bg: L ? "color.success.100" : "color.success.900",
          border: "color.success.500",
        },
        warning: {
          fg: sem("warning", 900, 200),
          bg: L ? "color.warning.100" : "color.warning.900",
          border: "color.warning.500",
        },
        danger: {
          fg: sem("danger", 700, 100),
          bg: L ? "color.danger.100" : "color.danger.900",
          border: "color.danger.500",
        },
        info: {
          fg: sem("info", 900, 100),
          bg: L ? "color.info.100" : "color.info.900",
          border: "color.info.500",
        },
      }),
      card: {
        face: c("color.ink"),
        faceText: c("color.neutral.0"),
        faceMuted: c("color.neutral.300"),
      },
      tone: tones,
      chart: {
        bar: {
          track: c(L ? "color.neutral.100" : "color.neutral.800"),
          fill: c(L ? "color.neutral.500" : "color.neutral.400"),
          highlight: c(L ? "color.chartAccent" : "color.product1.300"),
        },
        accent: c(L ? "color.chartAccent" : "color.product1.300"),
        series: {
          income: c(L ? "color.chartAccent" : "color.product1.300"),
          expense: c(L ? "color.chartAccent2" : "color.chartAccent2Dark"),
        },
        category: cat,
        grid: c(L ? "color.neutral.200" : "color.neutral.800"),
        axis: c(L ? "color.neutral.500" : "color.neutral.400"),
      },
    },
    boxShadow: {
      sm: t(
        L
          ? [sh(0, 1, 2, 0, "rgba(16, 24, 40, 0.03)"), sh(0, 4, 16, 0, "rgba(16, 24, 40, 0.04)")]
          : [sh(0, 1, 2, 0, "rgba(0, 0, 0, 0.3)")],
        "boxShadow",
      ),
      md: t(
        L
          ? [sh(0, 2, 4, 0, "rgba(16, 24, 40, 0.04)"), sh(0, 12, 32, 0, "rgba(16, 24, 40, 0.06)")]
          : [sh(0, 4, 12, 0, "rgba(0, 0, 0, 0.4)")],
        "boxShadow",
      ),
      lg: t(
        L
          ? [sh(0, 4, 8, 0, "rgba(16, 24, 40, 0.04)"), sh(0, 24, 48, -8, "rgba(16, 24, 40, 0.14)")]
          : [sh(0, 12, 32, 0, "rgba(0, 0, 0, 0.5)")],
        "boxShadow",
      ),
    },
  };
}
W("theme/light.json", theme("light"));
W("theme/dark.json", theme("dark"));

// ---------- typography ----------
const ty = (fam, wt, sz, lh, ls = "none", cs = "none", description) =>
  t(
    {
      fontFamily: ref(`fontFamily.${fam}`),
      fontWeight: ref(`fontWeight.${wt}`),
      fontSize: ref(`fontSize.${sz}`),
      lineHeight: ref(`lineHeight.${lh}`),
      letterSpacing: ref(`letterSpacing.${ls}`),
      textCase: ref(`textCase.${cs}`),
    },
    "typography",
    description,
  );
W("typography.json", {
  typography: {
    display: {
      d1: ty("display", "medium", 56, 64, "tighter"),
      d2: ty("display", "medium", 48, 56, "tighter"),
      d3: ty("display", "medium", 40, 48, "tighter"),
    },
    title: {
      t1: ty("display", "semibold", 32, 40, "tight"),
      t2: ty("display", "semibold", 28, 36, "tight"),
      t3: ty("display", "semibold", 24, 32),
      t4: ty("display", "semibold", 20, 28),
      t5: ty("display", "semibold", 18, 26),
    },
    body: {
      lg: { regular: ty("base", "regular", 18, 28), strong: ty("base", "semibold", 18, 28) },
      md: {
        regular: ty("base", "regular", 16, 24, "none", "none", "default text"),
        strong: ty("base", "semibold", 16, 24),
      },
      sm: { regular: ty("base", "regular", 14, 20), strong: ty("base", "semibold", 14, 20) },
    },
    label: {
      md: ty("base", "semibold", 14, 20),
      sm: ty("base", "semibold", 12, 16),
      overline: ty("base", "semibold", 12, 16, "wide", "uppercase"),
    },
    caption: { regular: ty("base", "regular", 12, 16) },
    numeric: {
      balance: ty(
        "display",
        "medium",
        48,
        56,
        "tighter",
        "none",
        "tabular-nums (font-variant-numeric) — set in CSS",
      ),
      amountXl: ty("display", "medium", 28, 36, "tight", "none", "tabular-nums; compact KPI value"),
      amountLg: ty("base", "medium", 24, 32, "none", "none", "tabular-nums"),
      amountMd: ty("base", "semibold", 16, 24, "none", "none", "tabular-nums"),
      amountSm: ty("base", "medium", 14, 20, "none", "none", "tabular-nums"),
    },
  },
});

// ---------- components ----------
const col = (p) => t(ref(p), "color");
const sp = (p) => t(ref(p), "spacing");
const sz = (p) => t(ref(p), "sizing");
const states = ["default", "hover", "active", "disabled"];
const stateMap = (fn) => Object.fromEntries(states.map((s) => [s, col(fn(s))]));
const sizeMap = (kind, f) => Object.fromEntries(xs.map((s) => [s, t(ref(f(s)), kind)]));
const comp = {};
// Button
const variants = {
  primary: {
    bg: (s) => `color.fill.primary.${s}`,
    color: (s) => (s === "disabled" ? "color.text.tertiary" : "color.text.onPrimary"),
    br: (s) => (s === "disabled" ? "color.border.tertiary" : "color.border.accent"),
  },
  secondary: {
    bg: (s) => `color.fill.secondary.${s}`,
    color: (s) => (s === "disabled" ? "color.text.tertiary" : "color.text.primary"),
    br: (s) => (s === "disabled" ? "color.border.tertiary" : "color.border.secondary"),
  },
  text: {
    bg: (s) => `color.fill.ghost.${s}`,
    color: (s) => (s === "disabled" ? "color.text.tertiary" : "color.text.primary"),
    br: () => "color.border.none",
  },
  danger: {
    bg: (s) => `color.fill.danger.${s}`,
    color: (s) => (s === "disabled" ? "color.text.tertiary" : "color.text.onDanger"),
    br: () => "color.border.none",
  },
};
comp.button = Object.fromEntries(
  Object.entries(variants).map(([v, f]) => [
    v,
    { bg: stateMap(f.bg), color: stateMap(f.color), br: stateMap(f.br) },
  ]),
);
Object.assign(comp.button, {
  text: { ...comp.button.text },
  size: sizeMap("sizing", (s) => `size.control.${s}`),
  paddingH: sizeMap("spacing", (s) => `space.padding.${s}`),
  gap: sizeMap("spacing", (s) => `space.gap.${s}`),
  iconSize: sizeMap("sizing", (s) => `iconSize.${s}`),
  borderRadius: t(ref("borderRadius.control"), "borderRadius"),
  borderWidth: t(ref("borderWidth.control"), "borderWidth"),
  label: {
    md: t(ref("typography.label.md"), "typography"),
    sm: t(ref("typography.label.sm"), "typography"),
  },
});
// fix: text variant must not be overwritten by ts text group — keep variant "text" under button.text
comp.button.text = { ...comp.button.text };
// Icon button
comp.iconButton = {
  bg: stateMap((s) => `color.fill.ghost.${s}`),
  color: stateMap((s) => (s === "disabled" ? "color.text.tertiary" : "color.text.primary")),
  size: sizeMap("sizing", (s) => `size.control.${s}`),
  iconSize: sizeMap("sizing", (s) => `iconSize.${s}`),
  borderRadius: t(ref("borderRadius.control"), "borderRadius"),
};
// Focus ring (shared)
comp.focus = {
  color: col("color.outline.focus"),
  width: t(ref("borderWidth.strong"), "borderWidth"),
  offset: sp("space.gap.xs"),
};
// Input
const inStates = ["default", "hover", "focus", "error", "disabled"];
const inMap = (fn) => Object.fromEntries(inStates.map((s) => [s, col(fn(s))]));
comp.input = {
  bg: inMap((s) =>
    s === "disabled"
      ? "color.fill.secondary.disabled"
      : s === "default"
        ? "color.bg.tertiary"
        : s === "hover"
          ? "color.fill.secondary.default"
          : "color.bg.secondary",
  ),
  br: inMap(
    (s) =>
      ({
        default: "color.border.primary",
        hover: "color.text.secondary",
        focus: "color.border.accent",
        error: "color.border.danger",
        disabled: "color.border.tertiary",
      })[s],
  ),
  color: inMap((s) => (s === "disabled" ? "color.text.tertiary" : "color.text.primary")),
  placeholder: col("color.text.tertiary"),
  helper: { default: col("color.text.secondary"), error: col("color.text.danger") },
  size: sizeMap("sizing", (s) => `size.control.${s}`),
  paddingH: sizeMap("spacing", (s) => `space.padding.${s}`),
  gap: sizeMap("spacing", (s) => `space.gap.${s}`),
  borderRadius: t(ref("borderRadius.control"), "borderRadius"),
  borderWidth: t(ref("borderWidth.control"), "borderWidth"),
  label: t(ref("typography.label.md"), "typography"),
  text: t(ref("typography.body.md.regular"), "typography"),
};
// Card / panel
comp.card = {
  bg: col("color.bg.secondary"),
  br: col("color.border.tertiary"),
  borderRadius: t(ref("borderRadius.surface"), "borderRadius"),
  borderWidth: t(ref("borderWidth.control"), "borderWidth"),
  paddingH: sizeMap("spacing", (s) => `space.padding.${s}`),
  paddingV: sizeMap("spacing", (s) => `space.padding.${s}`),
  gap: sizeMap("spacing", (s) => `space.gap.${s}`),
  shadow: t(ref("boxShadow.sm"), "boxShadow"),
};
// Balance
comp.balance = {
  bg: col("color.bg.secondary"),
  br: col("color.border.tertiary"),
  label: col("color.text.secondary"),
  value: col("color.text.primary"),
  delta: { positive: col("color.amount.positive"), negative: col("color.amount.negative") },
  borderRadius: t(ref("borderRadius.surface"), "borderRadius"),
  paddingH: sp("space.padding.lg"),
  paddingV: sp("space.padding.lg"),
  gap: sp("space.gap.md"),
  valueText: t(ref("typography.numeric.balance"), "typography"),
  labelText: t(ref("typography.label.sm"), "typography"),
};
// Amount
comp.amount = {
  positive: col("color.amount.positive"),
  negative: col("color.amount.negative"),
  neutral: col("color.amount.neutral"),
  text: {
    lg: t(ref("typography.numeric.amountLg"), "typography"),
    md: t(ref("typography.numeric.amountMd"), "typography"),
    sm: t(ref("typography.numeric.amountSm"), "typography"),
  },
};
// Bank card
comp.bankCard = {
  bg: col("color.card.face"),
  color: col("color.card.faceText"),
  muted: col("color.card.faceMuted"),
  borderRadius: t(ref("borderRadius.surface"), "borderRadius"),
  paddingH: sp("space.padding.lg"),
  paddingV: sp("space.padding.lg"),
  gap: sp("space.gap.md"),
  shadow: t(ref("boxShadow.md"), "boxShadow"),
  frozen: { bg: col("color.fill.secondary.disabled"), color: col("color.text.tertiary") },
};
// Transaction row
comp.transactionRow = {
  bg: {
    default: col("color.bg.secondary"),
    hover: col("color.fill.ghost.hover"),
    active: col("color.fill.ghost.active"),
  },
  title: col("color.text.primary"),
  meta: col("color.text.secondary"),
  divider: col("color.border.tertiary"),
  avatar: {
    bg: col("color.fill.primary.subtle"),
    color: col("color.text.accent"),
    size: sz("size.control.md"),
  },
  paddingH: sp("space.padding.md"),
  paddingV: sp("space.padding.sm"),
  gap: sp("space.gap.md"),
  borderRadius: t(ref("borderRadius.control"), "borderRadius"),
  titleText: t(ref("typography.body.md.strong"), "typography"),
  metaText: t(ref("typography.caption.regular"), "typography"),
};
// Nav item (sidebar)
comp.navItem = {
  bg: stateMap((s) => `color.fill.ghost.${s}`),
  color: stateMap((s) => (s === "disabled" ? "color.text.tertiary" : "color.text.secondary")),
  selected: {
    bg: col("color.bg.secondary"),
    color: col("color.text.primary"),
    icon: col("color.chart.accent"),
  },
  sidebar: { bg: col("color.bg.sidebar"), br: col("color.border.none") },
  paddingH: sp("space.padding.md"),
  paddingV: sp("space.padding.sm"),
  gap: sp("space.gap.md"),
  iconSize: sz("iconSize.md"),
  borderRadius: t(ref("borderRadius.control"), "borderRadius"),
  text: t(ref("typography.label.md"), "typography"),
};
// Badge
const badgeKinds = ["neutral", "success", "warning", "danger", "info"];
comp.badge = Object.fromEntries(
  badgeKinds.map((k) => [
    k,
    k === "neutral"
      ? {
          bg: col("color.fill.secondary.default"),
          color: col("color.text.secondary"),
          br: col("color.border.secondary"),
        }
      : {
          bg: col(`color.status.${k}.bg`),
          color: col(`color.status.${k}.fg`),
          br: col(`color.status.${k}.border`),
        },
  ]),
);
Object.assign(comp.badge, {
  paddingH: sp("space.padding.xs"),
  gap: sp("space.gap.xs"),
  borderRadius: t(ref("borderRadius.full"), "borderRadius"),
  borderWidth: t(ref("borderWidth.control"), "borderWidth"),
  text: t(ref("typography.label.sm"), "typography"),
});
// Alert
comp.alert = Object.fromEntries(
  ["info", "success", "warning", "danger"].map((k) => [
    k,
    {
      bg: col(`color.status.${k}.bg`),
      br: col(`color.status.${k}.border`),
      color: col(`color.status.${k}.fg`),
      text: col("color.text.primary"),
    },
  ]),
);
Object.assign(comp.alert, {
  paddingH: sp("space.padding.md"),
  paddingV: sp("space.padding.md"),
  gap: sp("space.gap.md"),
  iconSize: sz("iconSize.md"),
  borderRadius: t(ref("borderRadius.surface"), "borderRadius"),
  borderWidth: t(ref("borderWidth.control"), "borderWidth"),
  title: t(ref("typography.body.sm.strong"), "typography"),
  body: t(ref("typography.body.sm.regular"), "typography"),
});
// Segmented (brand / theme switcher)
comp.segmented = {
  bg: col("color.fill.secondary.default"),
  br: col("color.border.secondary"),
  item: {
    color: col("color.text.secondary"),
    selected: { bg: col("color.bg.secondary"), color: col("color.text.primary") },
    hover: { bg: col("color.fill.secondary.hover") },
  },
  paddingH: sp("space.padding.sm"),
  gap: sp("space.gap.xs"),
  size: sz("size.control.md"),
  borderRadius: t(ref("borderRadius.control"), "borderRadius"),
  text: t(ref("typography.label.md"), "typography"),
};
// Chart
comp.chart = {
  surface: col("color.bg.secondary"),
  grid: col("color.chart.grid"),
  axis: col("color.chart.axis"),
  strokeWidth: t(ref("borderWidth.strong"), "borderWidth"),
  text: t(ref("typography.caption.regular"), "typography"),
  category: Object.fromEntries(hues.map((_, i) => [i + 1, col(`color.chart.category.${i + 1}`)])),
};

// ===== wave 2 components =====
const T2 = (p) => t(ref(p), "typography");
// Link
comp.link = {
  color: stateMap((s) =>
    s === "default"
      ? "color.text.accent"
      : s === "hover"
        ? "color.text.primary"
        : s === "active"
          ? "color.text.secondary"
          : "color.text.tertiary",
  ),
  text: T2("typography.label.md"),
};
// Select (closed field + menu)
comp.select = {
  bg: inMap((s) =>
    s === "disabled"
      ? "color.fill.secondary.disabled"
      : s === "default"
        ? "color.bg.tertiary"
        : s === "hover"
          ? "color.fill.secondary.default"
          : "color.bg.secondary",
  ),
  br: inMap(
    (s) =>
      ({
        default: "color.border.primary",
        hover: "color.text.secondary",
        focus: "color.border.accent",
        error: "color.border.danger",
        disabled: "color.border.tertiary",
      })[s],
  ),
  color: inMap((s) => (s === "disabled" ? "color.text.tertiary" : "color.text.primary")),
  chevron: col("color.text.secondary"),
  size: sizeMap("sizing", (s) => `size.control.${s}`),
  paddingH: sizeMap("spacing", (s) => `space.padding.${s}`),
  gap: sizeMap("spacing", (s) => `space.gap.${s}`),
  borderRadius: t(ref("borderRadius.control"), "borderRadius"),
  borderWidth: t(ref("borderWidth.control"), "borderWidth"),
  menu: {
    bg: col("color.bg.secondary"),
    br: col("color.border.secondary"),
    shadow: t(ref("boxShadow.md"), "boxShadow"),
  },
  option: {
    color: col("color.text.primary"),
    hover: { bg: col("color.fill.ghost.hover") },
    selected: { bg: col("color.fill.primary.subtle"), color: col("color.text.accent") },
  },
};
// Checkbox / Radio / Switch
const cStates = ["default", "hover", "checked", "disabled"];
const cMap = (fn) => Object.fromEntries(cStates.map((s) => [s, col(fn(s))]));
comp.checkbox = {
  bg: cMap(
    (s) =>
      ({
        default: "color.bg.secondary",
        hover: "color.fill.ghost.hover",
        checked: "color.fill.primary.default",
        disabled: "color.fill.secondary.disabled",
      })[s],
  ),
  br: cMap(
    (s) =>
      ({
        default: "color.border.primary",
        hover: "color.text.secondary",
        checked: "color.border.accent",
        disabled: "color.border.tertiary",
      })[s],
  ),
  mark: col("color.text.onPrimary"),
  label: col("color.text.primary"),
  labelDisabled: col("color.text.tertiary"),
  size: sz("iconSize.md"),
  gap: sp("space.gap.md"),
  borderRadius: t(ref("borderRadius.control"), "borderRadius"),
  borderWidth: t(ref("borderWidth.control"), "borderWidth"),
  text: T2("typography.body.md.regular"),
};
comp.radio = {
  bg: cMap(
    (s) =>
      ({
        default: "color.bg.secondary",
        hover: "color.fill.ghost.hover",
        checked: "color.fill.primary.default",
        disabled: "color.fill.secondary.disabled",
      })[s],
  ),
  br: cMap(
    (s) =>
      ({
        default: "color.border.primary",
        hover: "color.text.secondary",
        checked: "color.border.accent",
        disabled: "color.border.tertiary",
      })[s],
  ),
  dot: col("color.text.onPrimary"),
  label: col("color.text.primary"),
  labelDisabled: col("color.text.tertiary"),
  size: sz("iconSize.md"),
  gap: sp("space.gap.md"),
  borderWidth: t(ref("borderWidth.control"), "borderWidth"),
  text: T2("typography.body.md.regular"),
};
comp.switch = {
  track: {
    off: col("color.fill.secondary.default"),
    on: col("color.fill.primary.default"),
    disabled: col("color.fill.secondary.disabled"),
  },
  br: {
    off: col("color.border.primary"),
    on: col("color.border.accent"),
    disabled: col("color.border.tertiary"),
  },
  thumb: {
    off: col("color.text.secondary"),
    on: col("color.text.onPrimary"),
    disabled: col("color.text.tertiary"),
  },
  width: sz("size.control.lg"),
  height: sz("size.control.xs"),
  borderWidth: t(ref("borderWidth.control"), "borderWidth"),
};
// Tabs
comp.tabs = {
  color: {
    default: col("color.text.secondary"),
    hover: col("color.text.primary"),
    selected: col("color.text.primary"),
    disabled: col("color.text.tertiary"),
  },
  bg: { default: col("color.fill.ghost.default"), hover: col("color.fill.ghost.hover") },
  indicator: col("color.border.accent"),
  divider: col("color.border.tertiary"),
  indicatorWidth: t(ref("borderWidth.strong"), "borderWidth"),
  paddingH: sp("space.padding.md"),
  paddingV: sp("space.padding.sm"),
  gap: sp("space.gap.xs"),
  borderRadius: t(ref("borderRadius.control"), "borderRadius"),
  text: T2("typography.label.md"),
};
// Breadcrumbs
comp.breadcrumbs = {
  color: { default: col("color.text.secondary"), current: col("color.text.primary") },
  separator: col("color.text.tertiary"),
  gap: sp("space.gap.sm"),
  text: T2("typography.body.sm.regular"),
  textCurrent: T2("typography.body.sm.strong"),
};
// Table
comp.table = {
  header: {
    bg: col("color.bg.tertiary"),
    color: col("color.text.secondary"),
    text: T2("typography.label.sm"),
  },
  row: {
    bg: { default: col("color.bg.secondary"), hover: col("color.fill.ghost.hover") },
    color: col("color.text.primary"),
    secondary: col("color.text.secondary"),
    text: T2("typography.body.sm.regular"),
  },
  divider: col("color.border.tertiary"),
  br: col("color.border.tertiary"),
  paddingH: sp("space.padding.md"),
  paddingV: sp("space.padding.sm"),
  gap: sp("space.gap.md"),
  borderRadius: t(ref("borderRadius.surface"), "borderRadius"),
  borderWidth: t(ref("borderWidth.control"), "borderWidth"),
};
// Toast
comp.toast = {
  bg: col("color.bg.secondary"),
  br: col("color.border.secondary"),
  color: col("color.text.primary"),
  icon: {
    success: col("color.status.success.fg"),
    danger: col("color.status.danger.fg"),
    info: col("color.status.info.fg"),
  },
  paddingH: sp("space.padding.md"),
  paddingV: sp("space.padding.md"),
  gap: sp("space.gap.md"),
  iconSize: sz("iconSize.md"),
  borderRadius: t(ref("borderRadius.surface"), "borderRadius"),
  borderWidth: t(ref("borderWidth.control"), "borderWidth"),
  shadow: t(ref("boxShadow.lg"), "boxShadow"),
  text: T2("typography.body.sm.strong"),
};
// Dialog
comp.dialog = {
  bg: col("color.bg.secondary"),
  br: col("color.border.tertiary"),
  overlay: col("color.bg.overlay"),
  title: col("color.text.primary"),
  text: col("color.text.secondary"),
  paddingH: sp("space.padding.xl"),
  paddingV: sp("space.padding.xl"),
  gap: sp("space.gap.lg"),
  borderRadius: t(ref("borderRadius.surface"), "borderRadius"),
  borderWidth: t(ref("borderWidth.control"), "borderWidth"),
  shadow: t(ref("boxShadow.lg"), "boxShadow"),
  titleText: T2("typography.title.t4"),
  bodyText: T2("typography.body.md.regular"),
};
// Skeleton
comp.skeleton = {
  bg: col("color.fill.secondary.default"),
  highlight: col("color.fill.secondary.hover"),
  borderRadius: t(ref("borderRadius.control"), "borderRadius"),
};
// Account card
comp.accountCard = {
  bg: col("color.bg.secondary"),
  br: { default: col("color.border.tertiary"), selected: col("color.border.accent") },
  label: col("color.text.secondary"),
  balance: col("color.text.primary"),
  detail: col("color.text.tertiary"),
  icon: {
    bg: col("color.fill.primary.subtle"),
    color: col("color.text.accent"),
    size: sz("size.control.md"),
  },
  paddingH: sp("space.padding.lg"),
  paddingV: sp("space.padding.lg"),
  gap: sp("space.gap.md"),
  borderRadius: t(ref("borderRadius.surface"), "borderRadius"),
  borderWidth: t(ref("borderWidth.control"), "borderWidth"),
  labelText: T2("typography.label.md"),
  balanceText: T2("typography.numeric.amountLg"),
  detailText: T2("typography.caption.regular"),
};
// Section header
comp.sectionHeader = {
  title: col("color.text.primary"),
  subtitle: col("color.text.secondary"),
  action: col("color.text.accent"),
  gap: sp("space.gap.md"),
  titleText: T2("typography.title.t4"),
  subtitleText: T2("typography.body.sm.regular"),
};
// Category chart (legend + bars)
comp.categoryChart = {
  legend: col("color.text.secondary"),
  value: col("color.text.primary"),
  track: col("color.chart.bar.track"),
  gap: sp("space.gap.md"),
  barSize: sz("iconSize.sm"),
  borderRadius: t(ref("borderRadius.control"), "borderRadius"),
  text: T2("typography.body.sm.regular"),
  valueText: T2("typography.numeric.amountSm"),
};

// ===== visual refresh v2 =====
const tonesList = ["primary", "inverse", "soft1", "soft2", "soft3"];
comp.statCard = Object.fromEntries(
  [...tonesList, "neutral"].map((n) => [
    n,
    n === "neutral"
      ? {
          bg: col("color.bg.secondary"),
          color: col("color.text.primary"),
          muted: col("color.text.secondary"),
          iconBg: col("color.fill.secondary.default"),
          icon: col("color.text.primary"),
        }
      : {
          bg: col(`color.tone.${n}.bg`),
          color: col(`color.tone.${n}.fg`),
          muted: col(`color.tone.${n}.muted`),
          iconBg: col(`color.tone.${n}.iconBg`),
          icon: col(`color.tone.${n}.icon`),
        },
  ]),
);
Object.assign(comp.statCard, {
  paddingH: sp("space.padding.lg"),
  paddingV: sp("space.padding.lg"),
  gap: sp("space.gap.md"),
  borderRadius: t(ref("borderRadius.tile"), "borderRadius"),
  iconChip: sz("size.control.md"),
  iconSize: sz("iconSize.md"),
  label: T2("typography.label.md"),
  value: T2("typography.numeric.amountXl"),
  delta: T2("typography.numeric.amountSm"),
});
comp.chip = {
  positive: {
    bg: col("color.status.success.bg"),
    color: col("color.status.success.fg"),
    br: col("color.status.success.border"),
  },
  negative: {
    bg: col("color.status.danger.bg"),
    color: col("color.status.danger.fg"),
    br: col("color.status.danger.border"),
  },
  neutral: {
    bg: col("color.fill.secondary.default"),
    color: col("color.text.secondary"),
    br: col("color.border.secondary"),
  },
  paddingH: sp("space.padding.xs"),
  gap: sp("space.gap.xs"),
  borderRadius: t(ref("borderRadius.full"), "borderRadius"),
  borderWidth: t(ref("borderWidth.control"), "borderWidth"),
  text: T2("typography.label.sm"),
};
comp.avatar = {
  bg: col("color.fill.secondary.default"),
  color: col("color.text.secondary"),
  ring: col("color.bg.secondary"),
  size: sizeMap("sizing", (s) => `size.control.${s}`),
  borderRadius: t(ref("borderRadius.full"), "borderRadius"),
  text: T2("typography.label.md"),
};
comp.searchBar = {
  bg: col("color.bg.secondary"),
  br: {
    default: col("color.border.secondary"),
    hover: col("color.border.primary"),
    focus: col("color.border.accent"),
  },
  color: col("color.text.primary"),
  placeholder: col("color.text.tertiary"),
  icon: col("color.text.secondary"),
  kbd: { bg: col("color.fill.secondary.default"), color: col("color.text.secondary") },
  size: sz("size.control.md"),
  paddingH: sp("space.padding.md"),
  gap: sp("space.gap.sm"),
  borderRadius: t(ref("borderRadius.control"), "borderRadius"),
  borderWidth: t(ref("borderWidth.control"), "borderWidth"),
  text: T2("typography.body.md.regular"),
};
comp.roundButton = {
  bg: stateMap((s) =>
    s === "disabled"
      ? "color.fill.secondary.disabled"
      : s === "default"
        ? "color.bg.secondary"
        : `color.fill.secondary.${s}`,
  ),
  br: stateMap((s) => (s === "disabled" ? "color.border.tertiary" : "color.border.secondary")),
  color: stateMap((s) => (s === "disabled" ? "color.text.tertiary" : "color.text.primary")),
  size: sizeMap("sizing", (s) => `size.control.${s}`),
  iconSize: sizeMap("sizing", (s) => `iconSize.${s}`),
  borderRadius: t(ref("borderRadius.round"), "borderRadius"),
  borderWidth: t(ref("borderWidth.control"), "borderWidth"),
};
comp.appFrame = {
  bg: col("color.bg.primary"),
  backdrop: col("color.bg.backdrop"),
  br: col("color.border.surface"),
  borderRadius: t(ref("borderRadius.frame"), "borderRadius"),
  borderWidth: t(ref("borderWidth.control"), "borderWidth"),
  shadow: t(ref("boxShadow.lg"), "boxShadow"),
  margin: sp("space.padding.lg"),
};
comp.tile = {
  bg: col("color.bg.secondary"),
  br: col("color.border.surface"),
  title: col("color.text.primary"),
  subtitle: col("color.text.secondary"),
  icon: { bg: col("color.fill.secondary.default"), color: col("color.text.primary") },
  paddingH: sp("space.padding.lg"),
  paddingV: sp("space.padding.lg"),
  gap: sp("space.gap.md"),
  borderRadius: t(ref("borderRadius.tile"), "borderRadius"),
  borderWidth: t(ref("borderWidth.control"), "borderWidth"),
  shadow: t(ref("boxShadow.sm"), "boxShadow"),
  titleText: T2("typography.title.t5"),
  subtitleText: T2("typography.body.sm.regular"),
};
comp.barChart = {
  track: col("color.chart.bar.track"),
  fill: col("color.chart.bar.fill"),
  highlight: col("color.chart.bar.highlight"),
  label: col("color.chart.axis"),
  grid: col("color.chart.grid"),
  tooltip: { bg: col("color.tone.inverse.bg"), color: col("color.tone.inverse.fg") },
  barWidth: sz("size.control.md"),
  gap: sp("space.gap.md"),
  borderRadius: t(ref("borderRadius.full"), "borderRadius"),
  text: T2("typography.caption.regular"),
  tooltipText: T2("typography.numeric.amountSm"),
};
comp.donut = {
  track: col("color.chart.bar.track"),
  label: col("color.text.secondary"),
  value: col("color.text.primary"),
  segment: Object.fromEntries([1, 2, 3, 4].map((i) => [i, col(`color.chart.category.${i}`)])),
  progressTrack: col("color.chart.bar.track"),
  gap: sp("space.gap.md"),
  text: T2("typography.body.sm.regular"),
  valueText: T2("typography.numeric.amountMd"),
};
comp.tickChart = {
  track: col("color.chart.bar.track"),
  fill: col("color.chart.bar.fill"),
  highlight: col("color.chart.bar.highlight"),
  label: col("color.text.secondary"),
  value: col("color.text.primary"),
  valueText: T2("typography.numeric.balance"),
  text: T2("typography.body.sm.regular"),
};
comp.promo = {
  bg: col("color.tone.inverse.bg"),
  color: col("color.tone.inverse.fg"),
  muted: col("color.tone.inverse.muted"),
  pattern: col("color.tone.inverse.muted"),
  button: { bg: col("color.bg.secondary"), color: col("color.text.primary") },
  paddingH: sp("space.padding.lg"),
  paddingV: sp("space.padding.lg"),
  gap: sp("space.gap.md"),
  borderRadius: t(ref("borderRadius.tile"), "borderRadius"),
  title: T2("typography.title.t4"),
  body: T2("typography.body.sm.regular"),
};
comp.profile = {
  bg: col("color.fill.secondary.default"),
  color: col("color.text.primary"),
  muted: col("color.text.secondary"),
  paddingH: sp("space.padding.sm"),
  paddingV: sp("space.padding.sm"),
  gap: sp("space.gap.md"),
  borderRadius: t(ref("borderRadius.tile"), "borderRadius"),
  name: T2("typography.body.sm.strong"),
  role: T2("typography.caption.regular"),
};
comp.navItem.indicator = col("color.chart.accent");
comp.navItem.section = col("color.text.tertiary");
comp.navItem.sectionText = T2("typography.label.overline");
comp.bankCard.layer = { bg: col("color.fill.primary.default") };
comp.bankCard.pattern = col("color.card.faceMuted");
comp.bankCard.chip = col("color.card.faceMuted");
comp.transactionRow.bg.default = col("color.bg.secondary");
comp.transactionRow.bg.hover = col("color.bg.tertiary");
comp.transactionRow.avatar.bg = col("color.fill.secondary.default");
comp.transactionRow.avatar.color = col("color.text.secondary");
comp.accountCard.icon.bg = col("color.fill.secondary.default");
comp.accountCard.icon.color = col("color.text.primary");
comp.transactionRow.borderRadius = t(ref("borderRadius.surface"), "borderRadius");
comp.hero = {
  bg: col("color.tone.primary.bg"),
  color: col("color.tone.primary.fg"),
  muted: col("color.tone.primary.muted"),
  cta: { bg: col("color.tone.primary.cta"), color: col("color.tone.primary.ctaFg") },
  line: col("color.tone.primary.fg"),
  paddingH: sp("space.padding.xl"),
  paddingV: sp("space.padding.xl"),
  gap: sp("space.gap.lg"),
  borderRadius: t(ref("borderRadius.tile"), "borderRadius"),
  valueText: T2("typography.numeric.balance"),
  labelText: T2("typography.label.md"),
};
comp.demoPanel = {
  bg: col("color.bg.secondary"),
  br: col("color.border.tertiary"),
  color: col("color.text.primary"),
  muted: col("color.text.secondary"),
  shadow: t(ref("boxShadow.lg"), "boxShadow"),
  paddingH: sp("space.padding.md"),
  paddingV: sp("space.padding.md"),
  gap: sp("space.gap.md"),
  borderRadius: t(ref("borderRadius.tile"), "borderRadius"),
  borderWidth: t(ref("borderWidth.control"), "borderWidth"),
  text: T2("typography.label.md"),
};
comp.barChart.series = {
  income: col("color.chart.series.income"),
  expense: col("color.chart.series.expense"),
};
comp.barChart.accent = col("color.chart.accent");
comp.card.borderRadius = t(ref("borderRadius.tile"), "borderRadius");
comp.balance.borderRadius = t(ref("borderRadius.tile"), "borderRadius");
comp.accountCard.borderRadius = t(ref("borderRadius.tile"), "borderRadius");

W("components.json", comp);

// ---------- themes / metadata ----------
const themes = [];
const order = [
  "core",
  "brand/vanta",
  "brand/pulse",
  "brand/north",
  "brand/flow",
  "map",
  "theme/light",
  "theme/dark",
  "typography",
  "components",
];
themes.push({ id: "base", name: "Default", group: "Base", selectedTokenSets: { core: "enabled" } });
for (const k of Object.keys(B))
  themes.push({
    id: `brand-${k}`,
    name: k.toUpperCase(),
    group: "Brand",
    selectedTokenSets: { core: "source", [`brand/${k}`]: "enabled", map: "enabled" },
  });
for (const m of ["light", "dark"])
  themes.push({
    id: `theme-${m}`,
    name: m[0].toUpperCase() + m.slice(1),
    group: "Theme",
    selectedTokenSets: {
      core: "source",
      "brand/vanta": "source",
      map: "source",
      [`theme/${m}`]: "enabled",
    },
  });
themes.push({
  id: "typography",
  name: "Default",
  group: "Typography",
  selectedTokenSets: { core: "source", "brand/vanta": "source", typography: "enabled" },
});
themes.push({
  id: "components",
  name: "Default",
  group: "Components",
  selectedTokenSets: {
    core: "source",
    "brand/vanta": "source",
    map: "source",
    "theme/light": "source",
    "theme/dark": "source",
    typography: "source",
    components: "enabled",
  },
});
W("$themes.json", themes);
W("$metadata.json", { tokenSetOrder: order });
console.log("ok");
