# Contributing to lutheran-prayers

Thanks for your interest. This package is a curated, bilingual corpus of confessional Lutheran prayers — contributions of new prayers, attribution corrections, and translation improvements are welcome.

## Setup

```sh
git clone https://github.com/ephi2github/lutheran-prayers.git
cd lutheran-prayers
pnpm install
pnpm test
```

## Adding or editing prayers

The source corpus lives at `data/source/prayers_am.json`. Each entry is an object with bilingual `title` / `title_am`, `text` / `text_am`, plus attribution (`author`, `author_dates`, `source_title`, `source_title_am`, page numbers) and a `category` slug. After editing:

```sh
pnpm validate:data    # Zod schema check + duplicate / orphan reports
pnpm build:data       # regenerates src/data/bundled/corpus.json
pnpm test             # corpus integrity tests must stay green
```

Prayer IDs are stable (`P###` format). Do not renumber existing prayers — append new ones with the next free ID.

## Adding or editing categories

Categories are declared in `data/source/categories.json`. To add a new category:

1. Add an entry with `id` (lowercase snake_case), `name.en`, `name.am`, and an optional `description`.
2. Update the prayer entries that should belong to it (`category` field).
3. If the category should be excluded from the daily scheduler (like `deathbed` or `sick`), add it to `EXCLUDED_CATEGORIES` in `src/strategies/categoryRules.ts`.
4. If the category should have a non-default season eligibility, update `ALLOWED_SEASONS_BY_CATEGORY` in the same file.

`pnpm test` exercises the strategy invariants — your change must keep them green.

## Improving Amharic translations

Edit `text_am` / `title_am` in `data/source/prayers_am.json`, run `pnpm build:data`, run `pnpm test`. The translation policy is **`sense_first_faithful`** — preserve meaning and liturgical register over word-for-word literal rendering. When in doubt, match the existing voice of the corpus.

## Pull request checklist

- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` all green.
- If you added prayers, the integrity-test snapshot in `tests/data/integrity.test.ts` (`EXPECTED_PRAYER_COUNT` / `EXPECTED_CATEGORY_COUNT`) is updated — this is intentional friction so corpus changes are explicit.
- One PR per cohesive change: a translation pass, a category rework, a new feast cycle, etc.

## Releasing (maintainers only)

Releases are wired through `.github/workflows/release.yml`. To publish a new version:

1. Bump `version` in `package.json` and add an entry to `CHANGELOG.md`.
2. Commit and merge to `main`.
3. Push an annotated tag matching `v*.*.*` (e.g. `git tag -a v1.1.0 -m "..." && git push origin v1.1.0`).
4. The workflow runs CI, then `pnpm publish --access public`.

One-time setup: add an [npm automation token](https://docs.npmjs.com/creating-and-viewing-access-tokens) to repo secrets as `NPM_TOKEN`.
