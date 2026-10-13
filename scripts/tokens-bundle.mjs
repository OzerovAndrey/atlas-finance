#!/usr/bin/env node
// tokens/ (multi-file, source of truth) → dist/tokens-studio.json (single file for Tokens Studio import:
// one top-level key per token set, plus $themes and $metadata). Read-only for tokens/.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const T = resolve(ROOT, "tokens");
const read = (p) => JSON.parse(readFileSync(resolve(T, p), "utf8"));

const metadata = read("$metadata.json");
const themes = read("$themes.json");
const bundle = {};
for (const set of metadata.tokenSetOrder) bundle[set] = read(`${set}.json`);
bundle.$themes = themes;
bundle.$metadata = metadata;

const out = resolve(ROOT, "dist/tokens-studio.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(bundle, null, 2) + "\n");
console.log(`✓ ${out} (${metadata.tokenSetOrder.length} sets, ${themes.length} themes)`);
