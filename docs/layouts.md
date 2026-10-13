# Layouts and demo specification

Source: the Figma file (see [figma.md](figma.md)). Every screen exists in **8 configurations** (VANTA / PULSE / NORTH / FLOW × Light / Dark) with identical content — only variable modes differ. This document is the contract between the layouts and the working demo: routes, states, flows, data and acceptance criteria.

## 1. Routing

GitHub Pages cannot rewrite URLs, so the demo uses **hash routes** (`#/overview`). Brand and theme are _not_ part of the route; they live in `data-brand` / `data-theme` on `<html>` and in `localStorage` (preference only — demo data never persists beyond the tab session unless decided later).

| Route                                                       | Figma page(s)                                                                                                             | Notes                                                            |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `#/overview`                                                | Overview, Mobile Overview, Mobile Overview 320                                                                            | landing screen                                                   |
| `#/accounts` (`?account=<id>`)                              | Accounts                                                                                                                  | selecting a card changes the details panel                       |
| `#/transactions`                                            | Transactions, Transactions loading, Transactions empty, Mobile Transactions                                               | tabs All / Income / Expenses / Pending, search, category, period |
| `#/transactions/<id>`                                       | Transaction detail                                                                                                        | drawer / panel next to the list                                  |
| `#/transfers/recipient` → `/amount` → `/review` → `/result` | Transfer 1 Recipient, Transfer 2 Amount, Transfer 2 Amount (error), Transfer 3 Review, Transfer 4 Result, Mobile Transfer | guarded: a later step without earlier input redirects back       |
| `#/cards`                                                   | Cards, Cards (frozen), Mobile Cards                                                                                       | freeze / unfreeze                                                |
| `#/analytics`                                               | Analytics                                                                                                                 | tabs Spending / Income / Cashflow                                |
| `#/settings`                                                | Settings                                                                                                                  | brand / theme, preferences, **Reset demo**                       |

## 2. Screen → component map

| Screen             | Components used                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| Shell (desktop)    | Sidebar (7 variants, `Active=`), Page Header, Switchers                                                 |
| Shell (< 768)      | Top Bar, Bottom Nav                                                                                     |
| Overview           | Balance Card, Bank Card, Category Chart (mobile) / Spending Chart (desktop), Transaction Row            |
| Accounts           | Section Header, Account Card, Button, Transaction Row, Link                                             |
| Transactions       | Tab Item, Input, Select, Table Header, Table Row, Badge, Skeleton (loading), empty state (Icon, Button) |
| Transaction detail | Transaction Row, Icon Button, Badge, Button                                                             |
| Transfer steps     | Tab Item (stepper), Input, Select, Radio, Checkbox, Alert, Button, Account Card, Dialog, Toast          |
| Cards              | Bank Card, Badge, Switch, Alert, Toast, Button                                                          |
| Analytics          | Tab Item, Balance Card, Spending Chart, Category Chart                                                  |
| Settings           | Switchers, Select, Switch, Alert, Button (danger), Dialog                                               |

## 3. Flows and state rules

**Transfer** (`recipient → amount → review → result`)

- Recipient: required; list is the 5 seeded recipients (+ "Add a new recipient" is a **gap**, see §7).
- Amount: required, > 0, max 2 decimals, `≤ available balance` of the _From_ account. Over balance → Input `state=error`, helper "Insufficient funds — available € …", danger Alert, **Continue disabled** (layout: _Transfer 2 Amount (error)_).
- Review: summary + "Review transfer" opens the confirmation **Dialog** (focus trap, Esc cancels, focus returns).
- Confirm: debit the account, append a transaction (`status: completed`, merchant = recipient name, category `transfer`-like, new id `tx-0NN`), show **Toast** "Transfer sent", go to Result. "Back to overview" shows the new balance (`€ 8,170.15` in the layouts for the € 250.00 example).
- Brand/theme switch during any step keeps the route and the form values.

**Cards** — Freeze toggles `status: active ↔ frozen`: Bank Card variant `frozen`, Badge `Active`(success) ↔ `Frozen`(warning), contactless "Enabled/Paused", info Alert and Toast "Card frozen". State survives route changes; **Reset demo** restores `active`.

**Transactions** — filters combine (tab AND search AND category AND period). Loading shows 6 Skeleton rows (`aria-busy`); zero results show the empty state with "Clear filters". Row click / Enter opens the detail; Esc or Close returns to the list with the same filters.

**Settings** — Switchers change `data-brand` / `data-theme` instantly (no reload, no state loss). Preferences (notifications, hide balances, reduce motion, language, display currency) are stored locally; `prefers-reduced-motion` is honoured regardless. **Reset demo** → confirmation Dialog → restores seed data, keeps brand/theme.

## 4. Data

`src/data/seed.json` is the single dataset for all brands (3 accounts, 2 cards, 5 recipients, 8 categories, **50 transactions** Jul–Oct 2026). `npm run seed:check` verifies that every number drawn in the layouts is derivable from it: total balance `€ 24,580.50` (USD account at a fixed demo rate of 1.00), October income `€ 4,120.00`, expenses `€ 1,084.30`, the five category totals and shares, savings rate `73.7 %` (+ 2.4 pts vs September), the 6-month spending line, card spend `€ 708.90`.

Formatting: amounts, dates and percentages **only** through `Intl.*` (`formatToParts`, with the layouts' thin gap between symbol and number and a real minus `−` for negatives). Never concatenate currency strings.

## 5. Breakpoints

| Width                                     | Shell                                                                                  | Content                                                                                              |
| ----------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| ≥ 1440                                    | Sidebar 232 + content (drawn: 1200 frame)                                              | two-column grids as drawn                                                                            |
| 1024 – 1439                               | same Sidebar                                                                           | side columns (details, summary, dialog) drop under the main column when the row is narrower than 880 |
| 768 – 1023                                | Sidebar collapses to an icon rail (72) _(not drawn — derive from Nav Item, icon only)_ | single column, tables stay                                                                           |
| < 768 (390 drawn, 320 drawn for Overview) | Top Bar + Bottom Nav                                                                   | tables → Transaction Row lists, line chart → category bars, forms single column, buttons full width  |

Touch targets ≥ 44 px on mobile; no horizontal page scroll at 320.

## 6. Accessibility acceptance

Keyboard order follows layout order; every interactive element has a visible `focus` ring (`focus/*` tokens); sidebar landmarks (`nav`), single `h1` per page; Switch = `role=switch`, Select = listbox pattern, Dialog = `role=dialog` + focus trap; Tabs = `tablist` with arrow keys; Toast = `role=status` (errors `role=alert`); amounts carry a sign and are never colour-only; chart series have labels + values (and a data table alternative); animations (skeleton shimmer, theme cross-fade) are disabled under `prefers-reduced-motion`.

## 7. Known gaps (not drawn yet)

Add-recipient form, Add-account flow, card "Show details" reveal, notification centre, 768 / 1024 frames (rules above only), Foundations specimen page, long-list pagination, Savings goals (post-MVP).

## 8. Definition of "the demo works fully"

1. Every route in §1 reachable from the sidebar / bottom nav and by URL.
2. The transfer flow completes, updates balances and the transactions list; the over-balance case is blocked.
3. Card freeze/unfreeze works and persists across routes.
4. Filters, search, empty and loading states behave as in §3.
5. Brand × theme switch (8 combinations) at any route keeps route, data and form input.
6. Reset demo restores the seed.
7. `npm run typecheck && npm run lint && npm run build && npm run tokens:check && npm run seed:check` are green; layouts verified at 1440 / 1024 / 768 / 390 / 320.
