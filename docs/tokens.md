# Token strategy

Status: **token sets implemented and validated (`npm run tokens:check`)**; build pipeline (§6), sync scripts (§8) and CSS generation are still to be implemented. Set structure mirrors the owner's Portfolio / multibrand-design-system projects.

## 1. Sources and what is verified

Verification status is stated per claim. The official docs host (`docs.tokens.studio`) was **not reachable from the sandbox that produced this document** (DNS failure), so Tokens Studio's own pages were seen only as search-result snippets, not read in full. Re-check every item marked _to verify_ against the live docs at the start of STEP 02.

| Claim                                                                                                                                                                                                 | Status                                                                                                                                                                                                                                                                                | Source                                                                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tokens Studio supports two formats: **Legacy** (`value` / `type` / `description`) and **W3C DTCG** (`$value` / `$type` / `$description`); a settings page "Token Format – W3C DTCG vs Legacy" exists  | Seen in search results; details _to verify_                                                                                                                                                                                                                                           | [docs.tokens.studio token types](https://docs.tokens.studio/manage-tokens/token-types/dimension/spacing) (search result), [token groups](https://docs.tokens.studio/manage-tokens/token-names/groups)                                                        |
| Tokens Studio types are not identical to DTCG: `spacing`, `text` and `paragraphSpacing` are Tokens Studio types, not official DTCG types                                                              | Seen in docs snippets                                                                                                                                                                                                                                                                 | [spacing](https://docs.tokens.studio/manage-tokens/token-types/dimension/spacing), [text](https://docs.tokens.studio/manage-tokens/token-types/text), [paragraph spacing](https://docs.tokens.studio/manage-tokens/token-types/typography/paragraph-spacing) |
| `@tokens-studio/sd-transforms` v1+ targets **Style Dictionary v4**; ESM-only; `register(StyleDictionary)`; preprocessor `'tokens-studio'` must be added explicitly; transform group `'tokens-studio'` | **Verified** (README read)                                                                                                                                                                                                                                                            | [sd-transforms README](https://github.com/tokens-studio/sd-transforms)                                                                                                                                                                                       |
| The preprocessor aligns Tokens Studio types with DTCG types and keeps the original in `$extensions['studio.tokens'].originalType`                                                                     | **Verified**                                                                                                                                                                                                                                                                          | same README                                                                                                                                                                                                                                                  |
| Math in token values is evaluated by the `ts/resolveMath` transform (not by the preprocessor); `mathFractionDigits` controls rounding                                                                 | **Verified**                                                                                                                                                                                                                                                                          | [README (raw)](https://raw.githubusercontent.com/tokens-studio/sd-transforms/main/README.md)                                                                                                                                                                 |
| `permutateThemes($themes, { separator })` produces one entry per combination of theme **groups**; best practice is one standalone output file per combination                                         | **Verified**                                                                                                                                                                                                                                                                          | same README                                                                                                                                                                                                                                                  |
| `$themes.json` entries: `id`, `name`, `group`, `selectedTokenSets` with per-set status `enabled` / `source` / `disabled`; `$metadata.json`: `tokenSetOrder` (array of set paths)                      | **Verified in a working project** (Portfolio repo: `tokens/$themes.json`, `tokens/$metadata.json`), consistent with sd-transforms README. The README is inconsistent about `selectedTokenSets` vs `selectedTokensets` — use the camel-cased `selectedTokenSets` written by the plugin | Portfolio repo (same owner)                                                                                                                                                                                                                                  |
| Token references use `{group.token}` syntax                                                                                                                                                           | **Verified in a working project** (Portfolio token files)                                                                                                                                                                                                                             | Portfolio repo                                                                                                                                                                                                                                               |
| Whether theme **groups** / multi-dimensional themes are a **Pro** feature of the plugin                                                                                                               | **Unknown — to verify**                                                                                                                                                                                                                                                               | see §8                                                                                                                                                                                                                                                       |

Not invented: no syntax below goes beyond what the sources above show. Anything about the plugin's behavior that was not verified is labeled _to verify_.

## 2. Format (decided)

**Legacy format (`value` / `type` / `description`)** for all files in `tokens/`, the same as the owner's Portfolio and multibrand-design-system projects (proven round trip with the plugin). sd-transforms maps Tokens Studio types to DTCG at build time. The format is a plugin setting and must not be mixed in one repo. Group names `value`, `type`, `description` are reserved → use `amount` / `detail`.

Types used: `color`, `sizing`, `spacing`, `borderRadius`, `borderWidth`, `fontSizes`, `lineHeights`, `fontWeights`, `fontFamilies`, `letterSpacing`, `textCase`, `duration`, `cubicBezier`, `boxShadow`, `typography`. Colour ramps in `map.json` use the Tokens Studio colour modifier (`$extensions["studio.tokens"].modify` with `lighten` / `darken`, `space: "hsl"`), exactly like the demo project. The `mix` modifier is deliberately **not** used (neutral ramps are explicit values in `brand/*`, see below).

## 3. Source of truth

`tokens/` is the **single source of truth**, stored multi-file in Git. Everything else is derived: generated CSS, the single-file bundle for the plugin (`npm run tokens:bundle` → `dist/tokens-studio.json`), validation reports, the Figma variables. Initial values were seeded once by a throw-away script (OKLab/OKLCH-based) that is **not** kept in the repo, so hand edits are never overwritten.

## 4. Set composition and order — mirrors the Portfolio / demo project

`$metadata.json → tokenSetOrder`:

```
core, brand/vanta, brand/pulse, brand/north, brand/flow, map,
theme/light, theme/dark, typography, components
```

| Set                         | Holds                                                                                                                                                                                                                                                                                                                                                                                                                                           | Rules                                                                          |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `core`                      | `dimension`, `borderRadius`, `borderWidth`, `fontWeight`, `fontSize`, `lineHeight`, `letterSpacing`, `textCase`, `duration`, `curve`, `color.white/black/transparent`, `color.chart.<hue>.300/600`                                                                                                                                                                                                                                              | primitives only, no references                                                 |
| `brand/<x>`                 | `color.product1/2/3` (+ `onProduct1/2`), `success/warning/danger`, shared `info`, `ink`, `surface`, `paper`, `cardFace`, **`color.neutral.0–950`** (explicit values, OKLab ramp from `ink`), `fontFamily.display/base`, `space.padding/gap.xs–xl`, `borderRadius.control/surface/tile/round/full`, `borderWidth.none/control/strong`, `size.control.xs–xl`, `iconSize.xs–xl`                                                                    | **identical keys in all four brands**; dimensions alias `core`                 |
| `map`                       | ramps `100/200/300/500/700/900` for `product1/2/3`, `success`, `warning`, `danger`, `info` via colour modifiers                                                                                                                                                                                                                                                                                                                                 | brand-agnostic maths, brand-specific results                                   |
| `theme/light`, `theme/dark` | `color.bg/fill/text/border/outline`, `color.amount.*`, `color.status.*`, `color.card.*`, `color.tone.{primary,inverse,soft1,soft2,soft3}.{bg,fg,muted,iconBg,icon}`, `color.chart.category.1–8 / grid / axis / bar.{track,fill,highlight}`, `boxShadow.sm/md/lg`                                                                                                                                                                                | **identical keys**; alias `brand` / `map` / `core` colours                     |
| `typography`                | text styles `display d1–d3`, `title t1–t5`, `body lg/md/sm × regular/strong`, `label md/sm/overline`, `caption`, `numeric.*`                                                                                                                                                                                                                                                                                                                    | composite tokens; `numeric.*` need `font-variant-numeric: tabular-nums` in CSS |
| `components`                | `button`, `iconButton`, `link`, `focus`, `input`, `select`, `checkbox`, `radio`, `switch`, `tabs`, `breadcrumbs`, `table`, `card`, `balance`, `amount`, `bankCard`, `accountCard`, `transactionRow`, `navItem`, `sectionHeader`, `badge`, `alert`, `toast`, `dialog`, `skeleton`, `segmented`, `chart`, `categoryChart`, `statCard`, `chip`, `avatar`, `searchBar`, `roundButton`, `tile`, `barChart`, `donut`, `tickChart`, `promo`, `profile` | **only** theme / brand / typography references — never `core` or `map`         |

### Component token naming

Token name = CSS property; path = `component.[part].[variant].property.[state|size]`, e.g. `button.primary.bg.hover`, `input.br.error`, `button.paddingH.md`. States `default|hover|active|disabled` (+ `focus`, `error` for inputs). Sizes `xs`–`xl`.

### Palette provenance and contrast decisions

Dark-theme anchors (`ink`, `surface`, accent) come from the _ATLAS Finance Visual Reference Guide_; light themes are derived. The checker (§7) caught and drove these deviations from a naive derivation: neutral ramp is an explicit OKLab ramp (HSL lightening made mid-tone teal/violet surfaces too vivid for AA text); on the saturated dark surfaces of PULSE/FLOW semantic text uses the lighter `200` / `100` steps; light-theme accent text/borders/focus use `product*.900`; `onProduct2` is per-brand (black/white); PULSE display font is **Sora** (Space Grotesk has no SemiBold).

## 5. Themes: 4 brands × 2 modes = 8 configurations

`$themes.json` uses the **same group layout as the owner's Portfolio project** — one theme per group entry, no cross-product needed:

| Group        | Themes                            | Enabled set(s)                                |
| ------------ | --------------------------------- | --------------------------------------------- |
| `Base`       | `Default`                         | `core`                                        |
| `Brand`      | `VANTA`, `PULSE`, `NORTH`, `FLOW` | `brand/<x>` + `map` (core as `source`)        |
| `Theme`      | `Light`, `Dark`                   | `theme/<mode>` (core, brand, map as `source`) |
| `Typography` | `Default`                         | `typography`                                  |
| `Components` | `Default`                         | `components`                                  |

In Tokens Studio's _Export to Figma Variables_ each group becomes one variable collection and each theme one mode: `Base` (1 mode), `Brand` (4 modes), `Theme` (2 modes), `Typography`, `Components`. A frame selects its configuration by setting the explicit mode of the `Brand` and `Theme` collections — see [docs/figma.md](figma.md). In code the same eight configurations are produced by sd-transforms `permutateThemes` over `Brand × Theme` (to implement).

## 6. Build pipeline (described only — no dependencies installed yet)

- **Style Dictionary v4 + `@tokens-studio/sd-transforms`** (v1+). `register(StyleDictionary)`, preprocessor `'tokens-studio'`, transform group `'tokens-studio'`, math through `ts/resolveMath`.
- `scripts/build-tokens`: read `$themes.json` + `$metadata.json`; build the 8 permutations; for each, merge the enabled/source sets in `tokenSetOrder`, resolve references and math, and emit CSS variables.
- Output: `src/styles/tokens.generated.css`, one block per configuration, scoped:

  ```css
  [data-brand="vanta"][data-theme="light"] { --button-primary-bg-default: …; … }
  ```

  applied on `<html>`. Switching brand/theme = changing two attributes: no reload, app state untouched. The file is git-ignored and never edited by hand.

- Variable names derive from the token path (`kebab-case`), so component CSS can use `var(--button-primary-bg-hover)` and nothing else.

## 7. Validation (described only — to be implemented in `scripts/`)

Run in CI and as part of `build` once implemented. Any failure blocks the commit.

1. JSON validity of every file in `tokens/`.
2. **Reference resolution** of all `{…}` references in all 8 configurations (no unresolved or circular references).
3. **Key parity**: all `brand/*` identical; `theme/light` ≡ `theme/dark`.
4. **Layering**: no `core.*` or `map.*` references from `components`.
5. **Reserved group names**: no group called `value`, `type` or `description`.
6. **Naming convention** for component tokens (§4) and required finance semantics present.
7. **Contrast, WCAG 2.2 AA**, all 8 configurations: declared text/background pairs (≥ 4.5:1 normal, ≥ 3:1 large text/UI), focus ring against adjacent surfaces, amount colors on surfaces, and `chart.category.1–8` against the chart surface and against each other (plus a non-color cue requirement in components). The pair list lives next to the checker, like `PAIRS` in the Portfolio `check-tokens`.
8. Generated CSS in sync with sources (rebuild produces no diff).

## 8. Tokens Studio ↔ code synchronization (local storage, single-file)

The plugin is used with **local storage / single-file import-export** (no sync provider). Repository files are multi-file; two scripts convert between the forms. Both are _planned, not implemented_.

- `scripts/tokens-bundle` — reads `tokens/` + `$themes.json` + `$metadata.json` and writes **`dist/tokens-studio.json`**, a single file the plugin can import (token sets as top-level keys, plus `$themes` and `$metadata`). Round-trip format to be confirmed against a real plugin export in STEP 02 (_to verify_).
- `scripts/tokens-split` — takes an export from the plugin (single file) and lays it back out into `tokens/…` (one file per set, `$themes.json`, `$metadata.json`), preserving key order, then runs validation. Refuses to write if validation fails or if it would delete keys without `--allow-removals`.

Workflow: edit in code → `tokens-bundle` → import into the plugin to inspect in Figma; or edit in the plugin → export → `tokens-split` → review diff → validate → commit. Git is the only master copy; the plugin's local storage is a working copy.

## 9. Open questions for the owner

1. **Tokens Studio import:** open the plugin → _Settings → Import / Load from file or JSON_ with `dist/tokens-studio.json`; confirm the `$extensions["studio.tokens"].modify` ramps (`lighten`/`darken`, `hsl`) show the same values as the Figma `Brand` collection. If anything differs, tell me and the JSON is corrected (not the Figma file).
2. **Pro / theme groups:** the layout needs theme _groups_ (as in your existing projects). Unverified against the live docs (not reachable from the sandbox) — expected to work since the Portfolio project already uses it.
3. **Typefaces:** VANTA Playfair Display + Inter, PULSE Sora + DM Sans, NORTH IBM Plex Sans, FLOW Nunito + DM Sans (all open-source; self-hosting to decide).
4. **Light-theme palettes** are derived by me, not from the reference PDF (it shows dark only) — review the Figma `Overview` page.
