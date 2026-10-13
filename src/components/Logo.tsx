import type { Brand } from "../lib/theme";

const NAME: Record<Brand, string> = {
  vanta: "VANTA",
  pulse: "PULSE",
  north: "NORTH",
  flow: "FLOW",
};

type Shape = { d: string; tone: 1 | 2; opacity?: number };
const MARKS: Record<Brand, Shape[]> = {
  vanta: [
    { d: "M2 4L11 4L16 21L12 28Z", tone: 1 },
    { d: "M30 4L21 4L16 21L20 28Z", tone: 2 },
    { d: "M11 4L16 4L16 21Z", tone: 1, opacity: 0.55 },
    { d: "M21 4L16 4L16 21Z", tone: 2, opacity: 0.55 },
  ],
  pulse: [
    { d: "M2 28L2 20L10 14L10 28Z", tone: 1 },
    { d: "M11 28L11 13L19 7L19 28Z", tone: 2 },
    { d: "M20 28L20 6L30 0L30 28Z", tone: 1 },
  ],
  north: [
    { d: "M16 2L30 29L16 21Z", tone: 1 },
    { d: "M16 2L2 29L16 21Z", tone: 2 },
  ],
  flow: [
    {
      d: "M1 17C5 5 14 4 19 9L23 13C26 16 29 15 31 12L31 19C28 23 23 23 19 19L15 15C11 11 7 14 1 24Z",
      tone: 1,
    },
    {
      d: "M1 24C5 14 10 12 15 16L19 20C23 24 28 24 31 20L31 27C27 31 22 31 18 27L14 23C10 19 6 21 1 31Z",
      tone: 2,
      opacity: 0.9,
    },
  ],
};

export function LogoMark({ brand, size = 32 }: { brand: Brand; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      {MARKS[brand].map((s, i) => (
        <path key={i} d={s.d} fill={`var(--color-product${s.tone})`} opacity={s.opacity ?? 1} />
      ))}
    </svg>
  );
}

export function Logo({ brand, mark = false }: { brand: Brand; mark?: boolean }) {
  return (
    <span className="logo" role="img" aria-label={`${NAME[brand]} — ATLAS Finance demo`}>
      <LogoMark brand={brand} />
      {!mark && <span className="logo__word ts-title-t4">{NAME[brand]}</span>}
    </span>
  );
}
