# ATLAS Finance

**One banking experience. Four distinct identities.**

ATLAS Finance is a fictional, interactive, multi-brand digital banking web app and design-system demonstration. One shared component library and token architecture drive four brands (VANTA, PULSE, NORTH, FLOW) × two themes (light, dark) = eight visual configurations, without duplicating product logic or screens.

> **Demo only — no real banking.** All accounts, cards, transactions and recipients are fictional. There is no authentication, no payments and no connection to any bank. Brand names are working names; no trademark clearance has been performed.

## Status

Phase 1, STEP 01: project scaffold and documentation only. No tokens, components, branding or screens yet. See [docs/roadmap.md](docs/roadmap.md).

## Commands

Requires Node.js 22+ and npm.

```bash
npm install
npm run dev        # Vite dev server
npm run typecheck  # tsc -b --noEmit (strict)
npm run lint       # ESLint (typescript-eslint, jsx-a11y, react-hooks)
npm run build      # typecheck + production build to dist/
npm run format     # Prettier
```

## Structure

```
tokens/            Token source of truth (Tokens Studio-compatible JSON)
scripts/           Token pipeline: build, validate, Tokens Studio sync
docs/              architecture, roadmap, tokens strategy
src/components/    Shared brand-agnostic UI components
src/features/      Banking modules (Overview, Accounts, Transactions, ...)
src/lib/           Formatting, brand/theme switching, demo-state helpers
src/styles/        Global styles and generated token CSS
src/data/          Fictional demo data
```

## Documents

- [BRIEF.md](BRIEF.md) — product brief
- [CLAUDE.md](CLAUDE.md) — rules for Claude Code
- [docs/architecture.md](docs/architecture.md), [docs/roadmap.md](docs/roadmap.md), [docs/tokens.md](docs/tokens.md)
- [ATLAS_FINANCE_PROJECT_CONTEXT.md](ATLAS_FINANCE_PROJECT_CONTEXT.md) — original agreed context

Deployment target: GitHub Pages at `/atlas-finance/` (configured in `vite.config.ts`, not deployed yet).
