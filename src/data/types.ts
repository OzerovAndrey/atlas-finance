// Types for src/data/seed.json. Amounts are integer minor units (cents) — format with Intl only.
export type AccountCurrency = "EUR" | "USD";
export interface Account {
  id: string;
  name: string;
  currency: AccountCurrency;
  type: string;
  number: string;
  last4: string;
  bankCode: string;
  openedAt: string;
  balanceMinor: number;
}
export interface Card {
  id: string;
  kind: "physical" | "virtual";
  name: string;
  accountId: string;
  last4: string;
  expires: string;
  monthlyLimitMinor: number;
  status: "active" | "frozen";
  contactless: boolean;
}
export interface Recipient {
  id: string;
  name: string;
  number: string;
  last4: string;
}
export interface Category {
  id: string;
  name: string;
  group: string;
}
export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  categoryId: string;
  amountMinor: number;
  currency: AccountCurrency;
  accountId: string;
  cardId: string | null;
  status: "completed" | "pending";
  reference: string;
}
export interface DemoSeed {
  meta: { currency: string; locale: string; today: string; balanceChangePct: number; note: string };
  accounts: Account[];
  fx: Record<string, number>;
  cards: Card[];
  recipients: Recipient[];
  categories: Category[];
  monthlySpendingMinor: Record<string, number>;
  transactions: Transaction[];
}
