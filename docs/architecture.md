# Architecture

## Goals

Prove that one shared component library, token architecture and banking UX can support four brands and two themes (eight configurations) with no duplicated product logic or screens.

## Stack (proposed, not locked)

- React + TypeScript (`strict`, `noUncheckedIndexedAccess`) + Vite; npm; Node 22+.
- CSS custom properties generated from tokens; native CSS and browser APIs preferred. No animation library unless justified.
- Static, GitHub Pages-compatible build (`base: '/atlas-finance/'`).

## Layers

```
tokens/ (source of truth)
   └─ scripts/ build → src/styles/tokens.generated.css   ([data-brand][data-theme] on <html>)
src/components/   shared UI, styled only by component tokens
src/features/     banking modules composed from components
src/lib/          formatting (Intl), brand/theme switching, demo store
src/data/         fictional demo data (identical for every brand)
```

Dependencies point downward only: `features → components → (tokens CSS)`; `lib` and `data` are leaf modules.

## Brand / theme switching

`<html data-brand="vanta|pulse|north|flow" data-theme="light|dark">`. All eight configurations are emitted into one stylesheet, scoped by these attributes, so switching is an attribute change: no reload, no re-render of app state. Routing and in-progress UI state (e.g. a half-filled transfer) are independent of brand/theme state.

## State

Demo state (balances, card freeze flags, transfers) lives in one client store seeded from `src/data/`. Brand/theme never touch it. **Reset demo** re-seeds it. No network, no persistence of anything beyond the demo (persistence, if any, is local only and decided later).

## Components

One implementation per component; variants and states are expressed through tokens, not forks. Families: Actions, Forms, Navigation, Data, Finance, Feedback, Visualization, Layout, Controls (see context file §5). A component playground (four brands × two themes × all states) precedes the full app.

## Formatting and localization

All amounts and dates go through `Intl.NumberFormat` / `Intl.DateTimeFormat` with a locale and currency passed explicitly. UI strings are kept out of components so a future locale layer can be added. English only for MVP.

## Accessibility and responsiveness

WCAG 2.2 AA, keyboard-first, visible focus (`focusRing` token), `prefers-reduced-motion`. Charts use semantic category tokens and non-color cues. Validated at 1440 / 1024 / 768 / 390 / 320.

## Quality gates

`typecheck`, `lint` (jsx-a11y), `build`; later: token validation (see [tokens.md](tokens.md)), accessibility and responsive checks.
