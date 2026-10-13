import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import { initialState, seed, type DemoState, type Prefs } from "./demo";

export type Action =
  | {
      type: "transfer";
      accountId: string;
      recipientId: string;
      amountMinor: number;
      reference: string;
    }
  | { type: "toggleFreeze"; cardId: string }
  | { type: "setLimit"; cardId: string; limitMinor: number }
  | { type: "pref"; key: keyof Prefs; value: boolean }
  | { type: "reset" };

const KEY = "atlas.demo";

function reduce(state: DemoState, a: Action): DemoState {
  switch (a.type) {
    case "transfer": {
      const rcp = seed.recipients.find((r) => r.id === a.recipientId);
      const acc = state.accounts.find((x) => x.id === a.accountId);
      if (!rcp || !acc || a.amountMinor <= 0 || a.amountMinor > acc.balanceMinor) return state;
      return {
        ...state,
        accounts: state.accounts.map((x) =>
          x.id === acc.id ? { ...x, balanceMinor: x.balanceMinor - a.amountMinor } : x,
        ),
        transactions: [
          {
            id: `tx-new-${state.transactions.length + 1}`,
            date: `${seed.meta.today}T12:00:00`,
            merchant: rcp.name,
            categoryId: "transfers",
            amountMinor: -a.amountMinor,
            currency: acc.currency,
            accountId: acc.id,
            cardId: null,
            status: "completed",
            reference:
              a.reference ||
              `ATLAS-DEMO-TRF-${String(state.transactions.length + 1).padStart(4, "0")}`,
          },
          ...state.transactions,
        ],
      };
    }
    case "toggleFreeze":
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === a.cardId ? { ...c, status: c.status === "frozen" ? "active" : "frozen" } : c,
        ),
      };
    case "setLimit":
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === a.cardId ? { ...c, monthlyLimitMinor: a.limitMinor } : c,
        ),
      };
    case "pref":
      return { ...state, prefs: { ...state.prefs, [a.key]: a.value } };
    case "reset":
      return initialState();
  }
}

function load(): DemoState {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as DemoState;
  } catch {
    /* storage may be unavailable */
  }
  return initialState();
}

const Ctx = createContext<{ state: DemoState; dispatch: Dispatch<Action> } | null>(null);

/** Demo data lives only in this session. Brand/theme changes never touch it; "Reset demo" restores the seed. */
export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reduce, undefined, load);
  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);
  useEffect(() => {
    document.documentElement.dataset.motion = state.prefs.reduceMotion ? "reduced" : "";
  }, [state.prefs.reduceMotion]);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDemo outside DemoProvider");
  return v;
}
