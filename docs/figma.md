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

## Pages (in order)

`Foundations` (empty, reserved) · `Components` · `Overview` · `Accounts` · `Transactions` · `Transaction detail` · `Transactions loading` · `Transactions empty` · `Transfer 1 Recipient` · `Transfer 2 Amount` · `Transfer 2 Amount (error)` · `Transfer 3 Review` · `Transfer 4 Result` · `Cards` · `Cards (frozen)` · `Analytics` · `Settings` · `Mobile Overview` · `Mobile Overview 320` · `Mobile Transactions` · `Mobile Transfer` · `Mobile Cards`.

v2 additions (see [visual-direction.md](visual-direction.md)): Stat Card, Delta Chip, Avatar, Avatar Stack, Round Button, Search Bar, Tile, Bar / Donut / Tick charts, Promo Card, Profile; Balance Card, Bank Card, Account Card, Sidebar, Nav Item and Page Header were rebuilt. Desktop frames are 1440 wide. Overview, Analytics and Transactions are full bento compositions; the other desktop pages keep their v1 composition but inherit the new shell, radii, rows and cards through shared components.

Every screen page holds 8 frames: row 1 Light, row 2 Dark; columns VANTA · PULSE · NORTH · FLOW; explicit `Brand` + `Theme` modes per frame. Routes, flows and states are described in [layouts.md](layouts.md).

`Components` sections: **Icons**, **Actions** (Button, Icon Button, Link), **Forms** (Input, Select, Checkbox, Radio, Switch), **Navigation** (Nav Item, Tab Item, Breadcrumbs, Segmented Item), **Data** (Table Header, Table Row, Badge, Transaction Row, Section Header, Skeleton), **Finance** (Account Card, Bank Card, Balance Card), **Feedback** (Alert, Toast, Dialog), **Visualization** (Spending Chart, Category Chart, Bar Chart, Donut Chart, Tick Chart), **Shell** (Sidebar, Switchers, Page Header, Bottom Nav, Top Bar).

## Known rules / gotchas

- Do not override paints on a _nested_ swapped icon or on an instance property that equals the base value: Figma renders the placeholder colour. Use variants / instance-swap properties instead.
- Chart series use `chart.category.*` (semantic, AA-checked), not the brand primary; every series also has a text label.
- `info` is one shared blue in all brands so it can never be mistaken for `warning` (FLOW's third brand colour is amber).
- Shadows on Toast / Dialog are plain effects (no variable for shadow colour yet).

## Not yet built

Foundations specimen page, 768 / 1024 frames, add-recipient / add-account flows, component descriptions for Code Connect, interaction prototypes.

## Logo component

`Logo` (Components page): `Style=full|mark` × `Size=sm|md|lg`. Marks are bold two-tone geometric symbols without a container, filled with `Brand:color/product1/500` and `product2/500`: VANTA faceted "V" (two legs), PULSE three rising slanted bars, NORTH two-tone north arrow, FLOW two overlapping wave ribbons. Wordmark uses `Brand:fontFamily/display`. Used in Sidebar and Top Bar.

## Gradients (visual refresh v3)

Primary buttons (default/hover/active) and all Stat Card tones use a soft 135° two-stop gradient: start = the existing component background token, end = `*/bgTo` component tokens (`button/primary/bgTo`, `statCard/<tone>/bgTo`) aliasing Theme `color/gradient/<primary|soft1|soft2|soft3|neutral|inverse>/to`. Soft and neutral Stat Cards also get a 1px `statCard/soft/br` border (Theme `color/border/secondary`) and the Tile shadow so they stay visible on the page background. The decorative sparkline was removed from Stat Card.

These tokens currently exist in Figma only; adding them to `tokens/` (Theme + Components sets, gradient stops via `linear-gradient({from}, {to})`) is a follow-up before the coded demo.

## No decorative borders (visual refresh v3)

Component and screen frames no longer use border strokes: surfaces are separated by fills, gradients and the Tile shadow (the `statCard/soft/br` border from the first v3 pass is no longer applied; light soft tones use the 200 ramp step as background and 300 as gradient end so they read against the page). Strokes remain only where they carry meaning: focus rings, error state, and the unchecked outline of Checkbox / Radio / Switch.
