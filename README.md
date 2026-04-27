# lutheran-prayers

> An offline-first, TypeScript npm package providing 400+ confessional Lutheran prayers in English and Amharic.

`lutheran-prayers` ships a vetted, bundled corpus of confessional Lutheran prayers behind a small, well-typed, synchronous API. It works in browsers, React Native, Node, Bun, and Deno — with zero network calls and zero runtime dependencies.

## Status

Pre-release. Scaffolding in progress. The public API contract is defined and stable; implementation is landing in phases (see Roadmap below).

## Installation

```sh
npm install lutheran-prayers
# or
pnpm add lutheran-prayers
```

## Quickstart

```ts
import {
  getPrayerOfTheDay,
  getPrayerById,
  listPrayers,
  listPrayersByCategory,
  listCategories,
} from 'lutheran-prayers';

const today = getPrayerOfTheDay();
const morning = listPrayersByCategory('morning');
const luther = getPrayerById('luthers-morning-prayer');
const inAmharic = getPrayerById('luthers-morning-prayer', { language: 'am' });
```

## API

All functions are synchronous and pure. Default language is `en`; pass `{ language: 'am' }` for Amharic.

| Function | Returns |
| --- | --- |
| `getPrayerOfTheDay(options?)` | `Prayer` |
| `getPrayerById(id, options?)` | `Prayer \| null` |
| `listPrayers(options?)` | `PrayerSummary[]` |
| `listPrayersByCategory(categoryId, options?)` | `PrayerSummary[]` |
| `listCategories(options?)` | `Category[]` |
| `searchPrayers(query, options?)` | `PrayerSummary[]` |

`list*` functions return summaries only (no prayer bodies). Use `getPrayerById` to fetch a full prayer.

Unknown IDs return `null`. Invalid language codes throw.

## Language support

- **English** — primary, vetted.
- **Amharic** — translations in progress; entries without a vetted Amharic translation fall back to English with a `languageFallback: 'en'` flag on the returned `Prayer`.

## Confessional stance

The corpus is curated from confessional Lutheran sources (Luther's Small and Large Catechisms, the Book of Concord, historic Lutheran hymnals and prayer books). Each prayer carries a `source` field with attribution.

## Roadmap

- **Phase 0** — Scaffolding (this commit).
- **Phase 1** — Data pipeline: Zod schema, validator, build script.
- **Phase 2** — Core API: `listCategories`, `listPrayers`, `listPrayersByCategory`, `getPrayerById`.
- **Phase 3** — `getPrayerOfTheDay` (placeholder strategy first, real strategy second).
- **Phase 4** — Polish: `searchPrayers`, TSDoc, CHANGELOG, v1.0.0 publish.

## Contributing

Contributions of new prayers, translations, or attribution corrections are welcome. See `CONTRIBUTING.md` (coming soon).

## License

MIT — see [LICENSE](./LICENSE).
