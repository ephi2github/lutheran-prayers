# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2026-05-02

### Fixed
- Release CI typecheck failure — `tests/package/exports.test.ts` imported the package by its own name, which `tsc --noEmit` could not resolve in the CI environment (the test relied on the built `dist/`, which only exists at runtime). The test now resolves the built entrypoints via filesystem path, so typecheck passes without depending on a pre-built `dist/`. v1.1.0 was tagged but never reached npm; this is the first published 1.1.x release.

## [1.1.0] - 2026-05-01

### Changed
- Updated `data/source/prayers_am.json` — substantive corrections and completions across the Amharic prayer corpus; `corpus.json` regenerated.

### Fixed
- CommonJS consumers can now `require('lutheran-prayers')`. The ESM-only `kenat` dependency is inlined into the CJS bundle (`tsup.config.ts` `noExternal: ['kenat']`).

### Added
- `tests/package/exports.test.ts` — verifies both ESM `import` and CJS `require` resolution against the built `dist/`.
- `scripts/get_next_batch.cjs`, `scripts/update_prayer.cjs` — maintainer helpers for batched Amharic-text edits (not published).

## [1.0.0] - 2026-04-27

First public release.

### Added
- Liturgical `getPrayerOfTheDay` scheduler — Ethiopian-calendar-anchored seasons, Bahire Hasab feast computation via `kenat`, weekday-aware category priority, cooldown ladder, deterministic walk-from-anchor.
- `getDayContext(date)` — exposes `seasonKey`, `weekday`, `isPrincipalFeast`, `principalFeastKey` for any date.
- `PrincipalFeastKey`, `SeasonKey`, `Weekday`, `DayContext` public types.
- Full TSDoc on every public function and type.
- README, CHANGELOG, CONTRIBUTING.
- Release workflow on tag push.

### Changed
- `kenat` is now a required runtime dependency (externalized in the bundle).
- Spec stance shifted from "zero runtime dependencies" to "one zero-dep runtime dependency for Ethiopian calendar correctness."

## [0.2.0] - 2026-04-27 (development)

### Added
- Liturgical scheduler implementation (Phase 2 internal milestone).
- `src/calendar/` module with season + principal-feast resolution.
- `src/strategies/categoryRules.ts` transcribed from the strategy doc.

### Changed
- `getPrayerOfTheDay` now uses the real strategy; placeholder day-of-epoch removed.

## [0.1.0] - 2026-04-27 (development)

### Added
- Hand-curated `data/source/categories.json` — 28 entries with English + Amharic display names.
- Zod-validated build pipeline producing `src/data/bundled/corpus.json` (411 prayers, 28 categories).
- Public types: `Prayer`, `PrayerAttribution`, `PrayerSummary`, `Category`, `Language`.
- API functions: `listCategories`, `listPrayers`, `listPrayersByCategory`, `getPrayerById`, `searchPrayers`.

### Removed
- Spec-defined `Prayer.tags` and `Prayer.notes` (no source data; future-proofed via `attribution` object instead).

## [0.0.0] - 2026-04-27 (development)

### Added
- Initial scaffold: TypeScript strict, dual ESM+CJS via tsup, vitest, eslint flat config, Prettier.
- Stubbed public API surface (all functions throwing `NOT_IMPLEMENTED`) to lock the contract early.
- GitHub Actions CI pipeline.

[1.1.1]: https://github.com/ephi2github/lutheran-prayers/releases/tag/v1.1.1
[1.1.0]: https://github.com/ephi2github/lutheran-prayers/releases/tag/v1.1.0
[1.0.0]: https://github.com/ephi2github/lutheran-prayers/releases/tag/v1.0.0
