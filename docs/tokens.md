# Token strategy

Status: **proposal for review (STEP 01). No token files exist yet.** Nothing here is implemented; decisions marked **[DECISION]** need the owner's approval.

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

## 2. Format

**[DECISION] Use the Legacy format (`value` / `type` / `description`) for the source files in `tokens/`,** the same as the owner's existing, working Portfolio and demo projects. Rationale: proven round trip with the plugin and with the existing `check-tokens` workflow; sd-transforms maps types to DTCG at build time anyway. Alternative: DTCG (`$value` / `$type`) — the plugin offers it as a setting, but its round trip with multi-file storage should be tested first (_to verify_). The format is a plugin setting and must not be mixed in one repo.

Consequences (from the Tokens Studio constraints): group names `value`, `type`, `description` are reserved — use `amount` and `detail`. Use Tokens Studio types (`color`, `dimension`, `spacing`, `borderRadius`, `borderWidth`, `fontFamilies`, `fontWeights`, `lineHeights`, `fontSizes`, `letterSpacing`, `boxShadow`, `typography`, …); sd-transforms converts them.

## 3. Source of truth

`tokens/` is the **single source of truth**, stored multi-file (one JSON per set) in Git. Everything else is derived: generated CSS, the single-file bundle for the plugin, validation reports. No parallel hand-maintained token system, no edits to generated files.

```
tokens/
  core.json                     primitives: color scales, spacing, sizing, radius, type, motion
  brand/vanta.json  pulse.json  north.json  flow.json     (identical keys, different values)
  map.json                      aliases / semantic mappings (brand → roles)
  theme/light.json  dark.json   (identical keys)  surfaces, text, borders, statuses, amount.*, chart.category.*
  typography.json               text roles, families, weights, line heights, tracking, tabular numerals
  components.json  (or components/*.json)
  $themes.json
  $metadata.json
```

## 4. Set composition and order

`$metadata.json → tokenSetOrder`:

```
core, brand/vanta, brand/pulse, brand/north, brand/flow, map,
theme/light, theme/dark, typography, components
```

Resolution order: `core → brand/* → map → theme/* → typography → components`. Rules (enforced by validation, §7):

- `core` holds primitives only; nothing in `core` references another set.
- `brand/*` have **identical key sets**; only values differ. Brand sets reference `core`.
- `map` creates semantic aliases from the active brand (`color.action.primary` → brand accent, etc.).
- `theme/light` and `theme/dark` have **identical key sets**; values differ.
- `components` reference **only** theme/brand semantics — never `core.*` or `map.*`.

### Required finance semantics

`amount.positive|negative|neutral`, `focusRing`, `status.*` (success/warning/error/info + on-colors), `chart.category.1`–`8` (semantic, accessible series colors — not just the brand primary), card face per brand, numeric typography (`tabular-nums`) as a typography/component token.

### Component token naming

Token name = CSS property; path = `component.[part].[variant].property.[state|size]`, e.g. `button.primary.bg.hover`, `input.borderColor.error`, `button.paddingH.md`. States: `default|hover|active|focus|disabled` (+ `loading|error|success` where relevant). Sizes: `xs`–`xl`. Property names: `bg`, `color`, `br`, `borderRadius`, `borderWidth`, `paddingH`, `paddingV`, `gap`, `size`, `iconSize`, …

## 5. Themes: 4 brands × 2 modes = 8 configurations

`$themes.json` defines **theme groups** so a configuration is one choice per group:

| Group    | Themes                            | Enables (status)                                         |
| -------- | --------------------------------- | -------------------------------------------------------- |
| `Brand`  | `VANTA`, `PULSE`, `NORTH`, `FLOW` | `core` source, `brand/<x>` enabled, `map` enabled        |
| `Mode`   | `Light`, `Dark`                   | `theme/<mode>` enabled (other sets `source`)             |
| `Layers` | `Default`                         | `typography`, `components` enabled (other sets `source`) |

Permutation (sd-transforms `permutateThemes`) yields one output per combination: 4 × 2 × 1 = **8**, e.g. `vanta_light` … `flow_dark`. A single-theme group must not change the count; _to verify_ in STEP 02 with a small fixture. This mirrors how the owner's Portfolio project already structures `$themes.json` (groups `Base`, `Brand`, `Theme`, `Typography`, `Components`).

**[DECISION]** whether to keep the owner's existing five-group layout (separate `Typography` and `Components` themes, as in Portfolio) or the three-group layout above; the latter is smaller, the former is already proven with the plugin.

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

1. **Pro features:** are theme groups / multi-dimensional themes available in your Tokens Studio plan? If they require Pro and you are not on it, fall back to 8 flat themes (`vanta-light` … `flow-dark`), which only changes `$themes.json`. _(Unverified — the docs were not reachable.)_
2. **Token format:** Legacy (`value`/`type`) as proposed, or W3C DTCG (`$value`/`$type`)?
3. **`$themes.json` layout:** five groups like Portfolio, or three groups as proposed?
4. **Figma:** Variables + Tokens Studio, or Tokens Studio styles only? Which Figma file will hold the library (to wire later)?
5. **Typefaces:** per-brand font families need licensing/hosting decisions (self-hosted open-source fonts proposed).
6. **Components in one file or split** (`components.json` vs `components/*.json`)? A split is proposed once there are more than ~10 components.
