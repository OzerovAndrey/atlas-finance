# ATLAS Finance — Brief

## Product

A fictional multi-brand digital banking web app for a Product/UI/UX designer's portfolio. Goal: prove that one component library, one token architecture and one banking UX can serve four brands and two themes. It must read as a credible fintech product, not a recolored casino UI or a static mockup.

**Model A:** ONE banking product with FOUR visual brands (not four products). Same navigation, modules, scenarios, data and functionality; branding changes through tokens only.

## Brands (working concepts, not final tokens)

| Brand | Positioning                | Character                           | Palette direction         |
| ----- | -------------------------- | ----------------------------------- | ------------------------- |
| VANTA | Premium banking            | Restrained, elegant, minimal radius | Graphite / champagne gold |
| PULSE | Neo banking                | Expressive, youthful, rounded       | Violet / lime             |
| NORTH | Modern structured banking  | Precise, trustworthy, orderly       | Cobalt / slate            |
| FLOW  | Personal lifestyle finance | Friendly, warm, soft                | Coral / teal              |

Palettes are inspiration only. Contrast must be validated in light and dark before finalizing.

## MVP modules

1. **Overview** — balances, accounts summary, spending chart, recent transactions, quick actions.
2. **Accounts** — list, balances, details, copy account details.
3. **Transactions** — searchable/filterable list, categories, dates, detail view.
4. **Transfers** — recipient → amount → review → success/error; validation, insufficient funds, local demo balance update.
5. **Cards** — physical/virtual cards, details, freeze/unfreeze in demo state.
6. **Analytics** — income/expenses, spending categories, charts.
7. **Settings** — brand/theme controls, preferences, Reset demo.

Later: savings goals, richer workflows. Not MVP: real auth/KYC, banking APIs/payments, loans, trading, admin panel, native apps.

## Key flows

- Overview → Account → Transactions → Transaction details.
- Transfer: Recipient → Amount → Review → Result (with errors and confirmation).
- Cards → select card → freeze/unfreeze → feedback.
- Brand switch → visual transformation; same route, content and in-progress UX state preserved.

## Demo data

Shared by all brands: ~3 accounts (Everyday EUR, Savings EUR, USD Account), 2 cards, 30–50 fictional transactions, 6–8 expense categories, 5–8 fictional recipients, several months of history. Brand/theme switching never resets data; a separate **Reset demo** action restores the initial state.

## Principles

Clear financial hierarchy; reliable number/currency formatting (`Intl.NumberFormat`); confirmation before simulated transfers; WCAG 2.2 AA; keyboard support and visible focus; reduced motion; instant brand/theme switching without reload or state loss; one shared implementation per component; English MVP with localization-ready architecture; no invented client results or real banking capabilities.
