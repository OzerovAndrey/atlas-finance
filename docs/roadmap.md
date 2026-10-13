# Roadmap

Work proceeds one step at a time; each step is reviewed before the next. After each meaningful UI step: validate, commit, (push and verify deployment once a remote and deployment are configured).

## Phase 1 — Component and token foundation

1. **Project setup**, structure and architecture docs — _STEP 01, done: scaffold + docs, local commit_.
2. Core tokens in Tokens Studio-compatible JSON. — _done: `tokens/core.json`_
3. Brand tokens, map, light/dark themes and typography. — _done, validated by `npm run tokens:check`_
4. Component tokens and reusable component library. — _tokens + Figma library (≈35 components, 22 screen pages × 8 configurations incl. flow steps, states and mobile) done, see docs/figma.md; React components not started_
5. Interactive component playground: four brands × two themes, states and variants.
   5a. **Generate a `skill/` for Claude from `tokens/`** (token reference so Claude can build against the system correctly).

## Phase 2 — Working product

6. Banking application shell, navigation and Overview. Done: shell, hash routing, floating demo bar (brand + dark + reset), logos, Overview on seed data.
7. Accounts and Transactions (with detail panel). Done.
8. Transfers (4 steps, validation) and Cards (freeze, limit). Done.
9. Analytics, Settings and demo reset. Done.
10. QA: accessibility, responsiveness, performance, token validation, interaction polish.

## Phase 3 — Portfolio

11. Public standalone live demo.
12. Portfolio case study and links to the finished demo (no changes to the existing portfolio before then).

Numbering of Phase 2 follows the agreed order in the context file (steps 6–10); the `skill/` task closes Phase 1.
