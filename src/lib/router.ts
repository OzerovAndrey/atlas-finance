import { useEffect, useState } from "react";

export const ROUTES = [
  { path: "/overview", label: "Overview", icon: "grid" },
  { path: "/accounts", label: "Accounts", icon: "wallet" },
  { path: "/transactions", label: "Transactions", icon: "list" },
  { path: "/transfers", label: "Transfers", icon: "send" },
  { path: "/cards", label: "Cards", icon: "card" },
  { path: "/analytics", label: "Analytics", icon: "chart" },
  { path: "/settings", label: "Settings", icon: "settings" },
] as const;

export type RoutePath = (typeof ROUTES)[number]["path"];

/** Hash routing keeps the demo working on GitHub Pages without server rewrites. */
function read(): RoutePath {
  const p = location.hash.replace(/^#/, "");
  return ROUTES.find((r) => p.startsWith(r.path))?.path ?? "/overview";
}

export function useRoute(): RoutePath {
  const [route, setRoute] = useState<RoutePath>(read);
  useEffect(() => {
    const on = () => setRoute(read());
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  return route;
}

/** Query string after "?" inside the hash, e.g. #/transactions?q=spotify&status=pending. */
export function useRouteQuery(): URLSearchParams {
  const [q, setQ] = useState(() => new URLSearchParams(location.hash.split("?")[1] ?? ""));
  useEffect(() => {
    const on = () => setQ(new URLSearchParams(location.hash.split("?")[1] ?? ""));
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  return q;
}
