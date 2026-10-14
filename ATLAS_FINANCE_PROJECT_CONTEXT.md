# ATLAS Finance — Project Context & Product Brief

Version: 1.0 · 2026-10-13 · Status: planning / agreed direction

> Give this file to Claude Code before starting implementation. This is a new, independent project, not a modification of the existing Portfolio or iGaming demo.

## 1. Project vision

**ATLAS Finance** is a fictional, interactive, multi-brand digital banking web application and design-system demonstration for a Product/UI/UX designer's portfolio.

**Tagline:** One banking experience. Four distinct identities.

**Goal:** Demonstrate that one shared component library, token architecture and banking UX can support four visually distinct brands and two themes without duplicating product logic or screens.

The project should prove product design quality, scalable design-system architecture, token discipline, accessibility and implementation readiness. It must feel like a credible fintech product, not a recolored casino interface or a static dashboard mockup.

## 2. Confirmed decisions

- **Model A:** ONE banking product with FOUR visual brands, not four different products.
- **Brands:** VANTA, PULSE, NORTH, FLOW.
- **Themes:** Light and Dark for each brand = eight visual configurations.
- Same navigation, modules, scenarios, demo data and functionality across brands.
- Branding changes through design tokens: colors, typography, radius, borders, surfaces, shadows, appropriate component presentation and restrained motion.
- **Tokens Studio for Figma is central:** build the component/token foundation first, with compatible JSON and a documented import/export workflow.
- Then build the working, responsive banking web app with live brand/theme switching.
- Only after that, integrate the finished project into the existing portfolio.
- Work **step by step**, one Claude Code prompt at a time; inspect results before advancing.
- New separate repository and standalone demo. Do not edit existing portfolio/iGaming projects without explicit approval.
- Banking data and operations are entirely simulated; no real banking integration, payments, credentials or personal financial information.

## 3. Brand directions (working concepts; not final tokens)

| Brand | Positioning | Visual character | Initial palette direction |
|---|---|---|---|
| VANTA | Premium banking | Restrained, elegant, minimal radius | Graphite / champagne gold |
| PULSE | Neo banking | Expressive, youthful, rounded | Violet / lime |
| NORTH | Modern structured banking | Precise, trustworthy, orderly | Cobalt / slate |
| FLOW | Personal lifestyle finance | Friendly, warm, soft | Coral / teal |

Brand names are working names; trademark clearance has not been performed. Palette examples are inspiration, not approved production color tokens. Validate light/dark contrast before finalization.

## 4. Product scope

**MVP modules:**

1. Overview — balances, accounts summary, spending chart, recent transactions, quick actions.
2. Accounts — account list, balances, details, copy account details.
3. Transactions — searchable/filterable list, categories, dates, detail view.
4. Transfers — recipient → amount → review → success/error; field validation, insufficient funds, local demo balance update.
5. Cards — physical/virtual cards, details, freeze/unfreeze in demo state.
6. Analytics — income/expenses, spending categories, charts.
7. Settings — brand/theme controls, preferences, reset demo.

**Later:** Savings goals; richer workflows. **Not MVP:** real auth/KYC, real banking APIs/payments, loans, trading, investment terminal, admin panel, native apps.

### Primary UX flows

- Overview → Account → Transactions → Transaction details.
- Transfer: Recipient → Amount → Review → Result, including errors and confirmation.
- Cards → Select card → Freeze/Unfreeze → Feedback.
- Brand switch → visual transformation with the same route, content and in-progress UX state preserved.

### Demo data

Shared across brands: approximately three accounts (Everyday EUR, Savings EUR, USD Account), two cards, 30–50 fictional transactions, 6–8 expense categories, 5–8 fictional recipients, multiple months of history. Switching brand/theme must not reset data; a separate Reset demo action restores the initial state. Never imply the demo connects to a real bank.

## 5. Design system and Tokens Studio

**Intended layers:** `core → brand → map → theme → typography → components`.

- Core: base scales for color, spacing, sizing, radius, type, motion.
- Brand: brand-specific identity values.
- Map: alias and semantic mappings.
- Theme: light/dark surfaces, text, borders, statuses.
- Typography: text roles, font families, weights, line heights, tracking.
- Components: component tokens, variants and interaction states.

**Important:** Confirm the currently supported Tokens Studio token JSON schema, types, references, token sets, themes and export mechanics before generating token files. Explicitly document composition for all eight configurations and decide a single source of truth. No parallel hand-maintained token system, no manual editing generated CSS, no arbitrary hardcoded component palettes. Include build-time resolution, validation, token parity, contrast checks and generated CSS variables.

**Component families:**
- Actions: Button, Icon Button, Link.
- Forms: Input, Select, Checkbox, Radio.
- Navigation: Sidebar, Tabs, Breadcrumbs.
- Data: Table, Transaction Row, Badge.
- Finance: Account Card, Bank Card, Balance, Amount.
- Feedback: Alert, Toast, Dialog, Skeleton.
- Visualization: Spending Chart, Category Chart.
- Layout: Card, Panel, Section Header.
- Controls: Brand Switcher, Theme Switcher.

Define applicable default, hover, pressed/active, focus, disabled, loading, error, success, empty states. Finance charts need accessible semantic series/category tokens, not just the brand primary color.

## 6. Product/design principles

- Clear financial information hierarchy; reliable formatting of currencies and numbers.
- Confirmation before simulated transfers, meaningful error feedback.
- WCAG 2.2 AA as target, keyboard support, visible focus, reduced motion.
- Responsive web app: validate 1440, 1024, 768, 390 and 320 widths.
- English MVP; architecture should allow future localization.
- Use semantic interaction micro-motion; no gratuitous effects.
- Keep brand/theme switching instant, without full page reload or loss of app state.
- Prefer one shared implementation of every component.

## 7. Technical direction (proposed, not yet locked)

- Separate GitHub repository and GitHub Pages-compatible standalone demo.
- React + TypeScript strict + Vite; CSS custom properties and generated tokens.
- Prefer native CSS and browser APIs; avoid animation libraries unless justified.
- A component playground should display variants and states in all brand/theme combinations before full banking app development.
- The repository must document Tokens Studio ↔ code synchronization and validation.

## 8. Agreed development order

**Phase 1 — Component and token foundation:**
1. Project setup, repository structure and architecture documentation.
2. Core tokens in Tokens Studio-compatible JSON.
3. Brand tokens, map, light/dark themes and typography.
4. Component tokens and reusable component library.
5. Interactive component playground: four brands × two themes, states and variants.

**Phase 2 — Working product:**
6. Banking application shell, navigation and Overview.
7. Accounts and Transactions.
8. Transfers and Cards flows.
9. Analytics, Settings and demo reset.
10. QA: accessibility, responsiveness, performance, token validation, interaction polish.

**Phase 3 — Portfolio:**
11. Public standalone live demo.
12. Portfolio case study and links to the finished demo.

After each meaningful UI step, validate, commit, push and verify deployment once the new repository and deployment are configured. For the initial scaffold, do not invent/connect a remote or push without knowing the target repo.

## 9. Immediate next task for Claude Code: STEP 01 ONLY

**Role:** Senior Design Systems Architect, Product Designer and Frontend Architect.

1. Inspect the working directory and Git status/remote. Stop if the folder is an existing unrelated project or points to Portfolio/iGaming.
2. In a clean project folder, create a minimal React + TypeScript strict + Vite scaffold.
3. Write `README.md`, `BRIEF.md`, `CLAUDE.md`, `docs/architecture.md`, `docs/roadmap.md` using this context.
4. Propose a token-set composition strategy and Tokens Studio import/export flow. Verify schema requirements; do not invent incompatible syntax.
5. Prepare only purposeful directories (`tokens`, `scripts`, `src/components`, `src/features`, `src/lib`, `src/styles`, `src/data`, `docs`) when justified.
6. Document validation, token discipline, accessibility, responsive requirements and safe Git workflow.
7. Run available install/typecheck/build checks; report exact results.
8. Initialize Git locally only if appropriate. **Do not create/connect a remote, push or deploy at this stage.**
9. Report files created, architectural decisions, Tokens Studio strategy, validation and any decisions requiring approval.
10. **STOP. Do not implement tokens, components, branding or dashboard yet.** Wait for the next prompt.

## 10. Relationship to existing portfolio

Existing portfolio: https://ozerovandrey.github.io/Portfolio/en/
Existing iGaming multi-brand demo: https://ozerovandrey.github.io/multibrand-design-system/

These are reference projects for the quality bar and architectural experience, not destinations for changes during the early ATLAS phases. ATLAS must develop its own fintech visual identity. The final portfolio integration happens only after the independent demo is working.

## 11. Working agreement

- Follow the user's latest decisions over this document if they conflict.
- Do not advance multiple phases without review.
- Keep changes small, auditable and token-driven.
- Never invent client results, conversion metrics or real banking capabilities.
- After each milestone, update this context file to reflect accepted changes and decisions.

## 12. Accepted decisions — visual redesign v3

- Neutral base shared by all brands; brand colour only for CTA, active navigation, charts, selected states and one hero widget.
- Inter for all brands (no serif); money uses tabular numerals with a quieter decimal part.
- Overview is a bento: hero Total balance + Transfer, Money flow, compact KPIs, Pending block, Recent activity, category split with Other.
- Charts are derived from seed data only (no invented values); the incomplete current month is hatched and labelled.
- Brand / theme / reset live in a compact collapsible demo panel (bottom right). Branch `redesign/v3`; nothing is deployed without an explicit command.
- Figma is not yet redrawn for v3.

## 13. Accepted decisions — UX review fixes (2026-10-14)

- ATLAS Finance is the product/system name; VANTA / PULSE / NORTH / FLOW are its brands. The sidebar note and demo panel say so explicitly.
- Demo panel is labelled ("ATLAS demo · Brand"; collapsed pill "Switch brand") and shows a one-time, dismissible hint on first visit (localStorage `atlas.brandHint`), closed automatically on the first brand switch.
- Dark-theme `color.text.danger` and `color.border.danger` use `danger.300` instead of `danger.100`, so input errors read as errors (AA still passes). Field errors carry an alert icon; an invalid focused input keeps a danger outline.
- Overview has one transfer CTA (hero); the toolbar "New transfer" is hidden there. Hero secondary action is an outlined button.
- Pending block matches KPI tiles (tile surface, warning border) instead of a grey disabled-looking fill.
- Transfers has a live Summary panel beside the wizard (stacked below ≤1024 px).
- `chart.category.*` stays theme-level and shared by all brands on purpose (semantic, contrast-validated series colours).

## 14. Accepted decisions — visual redesign v4 (2026-10-14)

- Owner asked for a more attractive, more detailed look after new references: lighter brand-tinted canvas, white tiles with soft layered shadows, more colour. Details in `docs/visual-direction.md` (v4).
- Supersedes the v3 rule "brand colour only in one hero widget": brands now also colour both chart series and KPI icon tints; status colours keep their meaning.
- New brand tokens `chartAccent2`, `chartAccent2Dark`; per-brand `paper`; new theme token `color.border.surface`; checker also validates both chart series and `text.tertiary` on `bg.tertiary`.
- `tokens/` stays generated by `scripts/gen-tokens.mjs` (all v4 changes, including the dark danger fix, are in the generator).
- Figma is not yet updated for v4 — next step.
- App frame (2026-10-14): content in a rounded, shadowed frame, max 1440 px, on a brand-tinted backdrop; new tokens `color.backdrop` (brand), `color.bg.backdrop` (theme), `borderRadius.frame`, component `appFrame`. Token resolver now resolves layered (array) shadows — before this fix the v4 shadows rendered as `undefined`; `build-css` now fails on unresolved values.
- Fixed frame (2026-10-14): only `.content` scrolls inside the frame; sidebar and toolbar are static; scroll resets on route change; ≤ 720 px falls back to normal page scroll.
- Toolbar edge (2026-10-14): no fade — content is hard-cut under the toolbar, with a hairline divider and a soft downward shadow while the content is scrolled.
- Accounts page (2026-10-14): "All accounts" summary (total in base currency + share bar by account) and detailed account cards — tinted type icon, 30-day change chip and per-account balance line, this month's money in / out and payment count (honest empty state when there is no activity), account number with working Copy, linked cards, Transfer / Transactions actions. All values derived from demo data. Transactions accept `?account=<id>` with a removable filter chip.
- Avatars (2026-10-14): demo contacts and the demo user use 3D characters from Microsoft Fluent Emoji (MIT, license file next to the assets, credited in README); one shared `PersonAvatar` (falls back to initials). Transfers to demo contacts show the contact's face in transaction lists (`TxAvatar`).
- Bank cards (2026-10-14): one shared `BankCard` with a physical 3D look — brand glows over the card face, guilloché print, metallic EMV chip (SVG), embossed number, holder/expiry, fictional "ATLAS demo" network mark (no real card-network logos), pointer-driven tilt with a moving glare (off for reduced motion), cast shadow tinted by the brand. Virtual card = dark frosted glass over a holographic base; frozen card = desaturated with a frosted "Frozen" overlay.
