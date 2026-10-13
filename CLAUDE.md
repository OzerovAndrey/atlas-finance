# ATLAS Finance — rules for Claude Code

## Project

Independent, fictional multi-brand banking demo (VANTA / PULSE / NORTH / FLOW × light / dark). Demo only, no real banking. This is a **separate** project: never edit the Portfolio or `multibrand-design-system` repos from here without explicit approval.
Read `ATLAS_FINANCE_PROJECT_CONTEXT.md` and `BRIEF.md` before large tasks.

## Communication and commits

- Communicate with the owner in **Ukrainian**. Code, documentation and UI copy are in **English**.
- Commit messages in Ukrainian: `<область>: <що>` — e.g. `tokens: додано core-сет`, `docs: оновлено roadmap`, `chore: scaffold ATLAS Finance`.
- Work step by step, one prompt at a time. Do not advance phases without review. Keep changes small and auditable.
- Safe Git: no remote, push or deploy unless asked. Never force-push, never rewrite history, no `reset --hard` without approval. Check `pwd`, `git status`, `git remote -v` before starting.
- After each milestone, update `ATLAS_FINANCE_PROJECT_CONTEXT.md` with accepted decisions.
- Never invent client results, metrics or real banking capabilities.

## Tokens (details: docs/tokens.md)

- Set order: `core → brand/vanta|pulse|north|flow → map → theme/light|dark → typography → components`.
- `core` = primitives only. `components` never reference `core` or `map` — only theme/brand semantics.
- Keys of all `brand/*` sets are identical (values differ). `theme/light` and `theme/dark` have identical keys.
- Naming: token name = CSS property (`bg`, `color`, `br`, `borderRadius`, `borderWidth`, `paddingH`, `paddingV`, `gap`, `size`, `iconSize`…). Format: `component.[part].[variant].property.[state|size]`. States: `default`, `hover`, `active`, `focus`, `disabled` (+ `loading`, `error`, `success` where relevant). Sizes: `xs`–`xl`.
- Reserved by Tokens Studio, never use as group names: `value`, `type`, `description`. Use `amount` for sums and `detail` for details.
- Required finance semantics: `amount.positive|negative|neutral`, `focusRing`, `status.*`, `chart.category.1–8`, card face per brand, numeric typography (`tabular-nums`).
- Component CSS contains **no** hex, px or font names — only CSS variables from component tokens. The app shell uses theme/brand semantics.
- Never hand-edit `src/styles/tokens.generated.css`. No parallel hand-maintained token system.

## Quality

- WCAG 2.2 AA, full keyboard support, visible focus, `prefers-reduced-motion` respected.
- Verify layouts at 1440 / 1024 / 768 / 390 / 320 px.
- Numbers and currencies only through `Intl.NumberFormat`; localization is built into the architecture (no string-concatenated amounts).
- Demo data is fictional. Brand/theme changes never reset data. A **Reset demo** action exists.
- TypeScript `strict` + `noUncheckedIndexedAccess`. One shared implementation per component.
- Before every commit: `npm run typecheck && npm run lint && npm run build` — all green.
