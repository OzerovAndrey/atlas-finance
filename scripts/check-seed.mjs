#!/usr/bin/env node
// Demo seed invariants: the numbers drawn in the Figma layouts must be derivable from src/data/seed.json.
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const seed = JSON.parse(
  readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "../src/data/seed.json"), "utf8"),
);
const errors = [];
const eq = (label, got, want) => {
  if (Math.round(got) !== Math.round(want)) errors.push(`${label}: got ${got}, want ${want}`);
};
const done = seed.transactions.filter((t) => t.status === "completed");
const month = (ym) => done.filter((t) => t.date.startsWith(ym));
const spend = (ym, pred = () => true) =>
  -month(ym)
    .filter((t) => t.amountMinor < 0 && pred(t))
    .reduce((s, t) => s + t.amountMinor, 0);
const income = (ym) =>
  month(ym)
    .filter((t) => t.amountMinor > 0)
    .reduce((s, t) => s + t.amountMinor, 0);
const group = (id) => seed.categories.find((c) => c.id === id)?.group;
// totals shown in the layouts
const total = seed.accounts.reduce((s, a) => s + a.balanceMinor * (seed.fx[a.currency] ?? 1), 0);
eq("total balance (24,580.50)", total, 2458050);
eq("Oct income (4,120.00)", income("2026-10"), 412000);
eq("Oct expenses (1,084.30)", spend("2026-10"), 108430);
eq("Sep income (3,665.50)", income("2026-09"), 366550);
eq("Sep expenses (1,051.70)", spend("2026-09"), 105170);
for (const [g, v] of Object.entries({
  groceries: 41200,
  transport: 22800,
  dining: 18400,
  bills: 15200,
  other: 10830,
}))
  eq(
    `Oct category ${g}`,
    spend("2026-10", (t) => group(t.categoryId) === g),
    v,
  );
eq("Jul expenses (1,010.30)", spend("2026-07"), 101030);
eq("Aug expenses (1,160.90)", spend("2026-08"), 116090);
eq(
  "Oct card-paid expenses (708.90)",
  spend("2026-10", (t) => t.cardId === "card-physical"),
  70890,
);
const big = Math.max(
  ...month("2026-10")
    .filter((t) => t.amountMinor < 0)
    .map((t) => -t.amountMinor),
);
eq("Oct largest expense (133.50)", big, 13350);
const pct = ((income("2026-10") - spend("2026-10")) / income("2026-10")) * 100;
if (Math.abs(pct - 73.7) > 0.05) errors.push(`savings rate ${pct.toFixed(2)} != 73.7`);
const sav = ((income("2026-09") - spend("2026-09")) / income("2026-09")) * 100;
if (Math.abs(pct - sav - 2.4) > 0.05)
  errors.push(`savings rate delta ${(pct - sav).toFixed(2)} != 2.4`);
if (seed.transactions.length < 30 || seed.transactions.length > 50)
  errors.push("transaction count outside 30–50");
if (new Set(seed.transactions.map((t) => t.id)).size !== seed.transactions.length)
  errors.push("duplicate transaction ids");
for (const t of seed.transactions) {
  if (!seed.categories.some((c) => c.id === t.categoryId)) errors.push(`${t.id}: unknown category`);
  if (!seed.accounts.some((a) => a.id === t.accountId)) errors.push(`${t.id}: unknown account`);
  if (t.cardId && !seed.cards.some((c) => c.id === t.cardId)) errors.push(`${t.id}: unknown card`);
}
if (errors.length) {
  console.error("✗ seed errors:\n  " + errors.join("\n  "));
  process.exit(1);
}
console.log(
  `✓ seed ok: ${seed.transactions.length} transactions, ${seed.accounts.length} accounts, ${seed.cards.length} cards, ${seed.recipients.length} recipients; totals match the Figma layouts`,
);
