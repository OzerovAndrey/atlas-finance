# Figma library

File: `Claude_Ozerov_TEST (2)` — https://www.figma.com/design/Gd8skRyht7UDbMQi3AMWby (test copy; rebuilt from scratch for ATLAS Finance — the previous casino demo content was removed at the owner's request).

## Variable collections (names = Tokens Studio theme groups)

| Collection   | Modes                        | Content                                                                                       | Source set(s)     |
| ------------ | ---------------------------- | --------------------------------------------------------------------------------------------- | ----------------- |
| `Base`       | Default                      | primitives: dimension, radius, border width, font scales, white/black/transparent, chart hues | `core`            |
| `Brand`      | VANTA · PULSE · NORTH · FLOW | brand colours, neutral ramp, fonts, density, radii, sizes + colour ramps                      | `brand/*` + `map` |
| `Theme`      | Light · Dark                 | semantic colours (bg, fill, text, border, amount, status, card, chart)                        | `theme/*`         |
| `Components` | Default                      | component tokens (alias Theme / Brand)                                                        | `components`      |

88 + 87 + 81 + 261 variables. Hierarchy `Components → Theme → Brand → Base`. WEB code syntax on every variable (`var(--button-primary-bg-default)` …). Primitives (`Base`, brand colours) have empty scopes (hidden from pickers).

**One configuration = two explicit modes.** To show e.g. NORTH · Dark, set on the frame: `Brand = NORTH`, `Theme = Dark` (right panel → Appearance / variable modes). Components inherit them; text styles switch font family with the Brand mode.

## Text styles (22)

`display/d1–d3`, `title/t1–t5`, `body/{lg,md,sm}/{regular,strong}`, `label/{md,sm,overline}`, `caption/regular`, `numeric/{balance,amountLg,amountMd,amountSm}`. `fontFamily` is bound to `Brand/fontFamily/display|base`; `fontWeight`, `fontSize`, `lineHeight` are bound to `Base`. Letter spacing is a fixed percent value (Figma binds variable letter spacing in px).

## Pages

- `Components` — Button (48 variants), Input (15), Badge (5), Alert (4), Segmented Item (3), Nav Item (5), Transaction Row (6), Bank Card (2), Balance Card, Spending Chart, Icon (14).
- `Overview` — the Overview screen composed from those components, 4 brands × 2 themes (8 frames, explicit modes per frame).
- `Foundations` — reserved for token specimens (not built yet).

## Not yet built

Icon Button, Link, Select, Checkbox, Radio, Tabs, Breadcrumbs, Table, Account Card, Toast, Dialog, Skeleton, Category Chart, Panel / Section Header; Foundations specimen page; Code Connect.
