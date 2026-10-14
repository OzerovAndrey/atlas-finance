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
  alert: "M12 8v5M12 16.5h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  close: "M6 6l12 12M18 6 6 18",
  arrowDownLeft: "M17 7 7 17M16 17H7V8",
  percent:
    "M19 5 5 19M7 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM17 19.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  cart: "M3 4h2l2.2 10.5h10.6L20 7H6.2M9 19.5h.01M17 19.5h.01",
  bus: "M6 17V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v11zM6 11h12M8 20v-3M16 20v-3M8.5 14h.01M15.5 14h.01",
  dining: "M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2 1-3 3.5-3 7h3",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h4",
  bag: "M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2",
  heart: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
  ticket: "M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4zM14 7v10",
  swap: "M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z",
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
