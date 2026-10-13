# Figma library

File: `Claude_Ozerov_TEST (2)` — https://www.figma.com/design/Gd8skRyht7UDbMQi3AMWby (test copy; rebuilt from scratch for ATLAS Finance — the previous casino demo content was removed at the owner's request).

Source of truth is `tokens/` (Tokens Studio JSON). The Figma variables were first created by script from the same JSON; the owner then imported `dist/tokens-studio.json` into Tokens Studio, which updates the same collections **by name** and creates the text styles (`typography/*`). Re-import after every token change.

## Variable collections (names = Tokens Studio theme groups)

| Collection   | Modes                        | Content                                                                                               | Source set(s)     |
| ------------ | ---------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------- |
| `Base`       | Default                      | primitives: dimension, radius, border width, font scales, motion, white/black/transparent, chart hues | `core`            |
| `Brand`      | VANTA · PULSE · NORTH · FLOW | brand colours, neutral ramp, shared `info` blue, fonts, density, radii, sizes + colour ramps          | `brand/*` + `map` |
| `Theme`      | Light · Dark                 | semantic colours (bg, fill, text, border, amount, status, card, chart)                                | `theme/*`         |
| `Components` | Default                      | component tokens (alias Theme / Brand)                                                                | `components`      |

Hierarchy `Components → Theme → Brand → Base`. WEB code syntax on every variable (`var(--button-primary-bg-default)` …). Primitives have empty scopes (hidden from pickers).

**One configuration = two explicit modes.** To show e.g. NORTH · Dark set on the frame: `Brand = NORTH`, `Theme = Dark`. Components inherit them; text styles switch font family with the Brand mode.

## Text styles

`typography/display/d1–d3`, `title/t1–t5`, `body/{lg,md,sm}/{regular,strong}`, `label/{md,sm,overline}`, `caption/regular`, `numeric/{balance,amountLg,amountMd,amountSm}` — created by Tokens Studio, `fontFamily` bound to `Brand/fontFamily/display|base`, size / line height / weight bound to `Base`.

## Pages

- `Components` — organised in Sections by family:
  - **Icons** — Icon (21 stroke icons)
  - **Actions** — Button (48 variants), Icon Button, Link
  - **Forms** — Input, Select, Checkbox, Radio, Switch
  - **Navigation** — Nav Item, Tab Item, Breadcrumbs, Segmented Item (brand / theme switcher)
  - **Data** — Table Header, Table Row, Badge, Transaction Row, Section Header, Skeleton
  - **Finance** — Account Card, Bank Card, Balance Card
  - **Feedback** — Alert, Toast, Dialog
  - **Visualization** — Spending Chart, Category Chart
- `Overview`, `Transactions`, `Transfers` — screens composed from those components, each in 8 frames (4 brands × 2 themes, explicit modes per frame).
- `Foundations` — reserved for token specimens (not built yet).

## Known rules / gotchas

- Do not override paints on a _nested_ swapped icon or on an instance property that equals the base value: Figma renders the placeholder colour. Use variants / instance-swap properties instead.
- Chart series use `chart.category.*` (semantic, AA-checked), not the brand primary; every series also has a text label.
- `info` is one shared blue in all brands so it can never be mistaken for `warning` (FLOW's third brand colour is amber).
- Shadows on Toast / Dialog are plain effects (no variable for shadow colour yet).

## Not yet built

Account / Cards / Analytics / Settings screens, Foundations specimen page, component descriptions for Code Connect, interaction prototypes.
