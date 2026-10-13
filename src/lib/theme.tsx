import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const BRANDS = ["vanta", "pulse", "north", "flow"] as const;
export type Brand = (typeof BRANDS)[number];
export type Mode = "light" | "dark";

interface ThemeState {
  brand: Brand;
  mode: Mode;
  setBrand: (b: Brand) => void;
  setMode: (m: Mode) => void;
}

const Ctx = createContext<ThemeState | null>(null);
const KEY = "atlas.theme";
const query = "(prefers-color-scheme: dark)";

function stored(): { brand?: Brand; mode?: Mode } {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}") as { brand?: Brand; mode?: Mode };
  } catch {
    return {};
  }
}

/** Brand/theme changes never touch demo data. First visit follows the system theme until the user picks one. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const saved = stored();
  const [brand, setBrand] = useState<Brand>(saved.brand ?? "vanta");
  const [manual, setManual] = useState<Mode | null>(saved.mode ?? null);
  const [system, setSystem] = useState<Mode>(() => (matchMedia(query).matches ? "dark" : "light"));
  const mode = manual ?? system;

  useEffect(() => {
    const mq = matchMedia(query);
    const on = () => setSystem(mq.matches ? "dark" : "light");
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.brand = brand;
    document.documentElement.dataset.theme = mode;
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ brand, mode: manual ?? undefined }));
    } catch {
      /* storage may be unavailable */
    }
  }, [brand, mode, manual]);

  const value = useMemo(() => ({ brand, mode, setBrand, setMode: setManual }), [brand, mode]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme outside ThemeProvider");
  return v;
}
