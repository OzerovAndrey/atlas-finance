const PATHS = {
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  wallet: "M3 7a2 2 0 0 1 2-2h13v3M3 7v10a2 2 0 0 0 2 2h14V8H5a2 2 0 0 1-2-1zM16 13.5h2",
  list: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  send: "M21 3 10 14M21 3l-7 18-4-7-7-4z",
  card: "M3 6h18v12H3zM3 10h18M7 15h4",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14.2 3h-4l-.4 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2l.4 2.6h4l.4-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.5-4.5",
  bell: "M6 17V11a6 6 0 1 1 12 0v6l2 2H4zM10 21h4",
  arrowUpRight: "M7 17 17 7M8 7h9v9",
  check: "M5 12.5l4.5 4.5L19 7.5",
  snow: "M12 2v20M4.9 7l14.2 10M19.1 7 4.9 17M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5",
  wifi: "M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0M11 18.5a2 2 0 0 1 2 0",
  clock: "M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  chevronDown: "M6 9l6 6 6-6",
  chevronUp: "M6 15l6-6 6 6",
  plus: "M12 5v14M5 12h14",
  sliders: "M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6",
  reset: "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5",
  trendUp: "M3 17l6-6 4 4 8-8M15 7h6v6",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = "var(--icon-size-md)" }: { name: IconName; size?: string }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ width: size, height: size }}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
