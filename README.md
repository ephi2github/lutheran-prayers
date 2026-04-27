# lutheran-prayers

> An offline-first, TypeScript npm package providing 411 confessional Lutheran prayers in English and Amharic, with an Ethiopian-calendar-anchored prayer-of-the-day scheduler.

`lutheran-prayers` ships a vetted, fully bilingual corpus behind a small synchronous API. It works in browsers, React Native, Node, Bun, and Deno — with no network calls. Calendar logic uses [`kenat`](https://www.npmjs.com/package/kenat) (MIT, zero deps) for Ethiopian date conversion and Bahire Hasab feast computation.

## Installation

```sh
pnpm add lutheran-prayers kenat
# or: npm install lutheran-prayers kenat
```

`kenat` is a required runtime dependency. It is a normal npm install — your bundler will dedupe it naturally.

## Quickstart

```ts
import {
  getPrayerOfTheDay,
  getPrayerById,
  getDayContext,
  listCategories,
  searchPrayers,
} from 'lutheran-prayers';

// Today's prayer, in English
const today = getPrayerOfTheDay();
console.log(today.title, '—', today.attribution?.author);

// The same prayer, in Amharic
const todayAm = getPrayerOfTheDay({ language: 'am' });

// What liturgical season is today?
const ctx = getDayContext();
// → { date: '2026-04-27', seasonKey: 'after_easter', weekday: 1, isSunday: false, isPrincipalFeast: false }

// Look up a specific prayer
const p001 = getPrayerById('P001');               // Johann Gerhard's prayer on original sin
const p001Am = getPrayerById('P001', { language: 'am' });

// Browse
const cats = listCategories();                     // 28 categories with prayer counts
const luther = searchPrayers('Luther', { limit: 5 });
```

All functions are **synchronous**. Default language is `en`; pass `{ language: 'am' }` for Amharic. Unknown IDs return `null`. Invalid language codes throw.

## API

| Function | Returns | Notes |
| --- | --- | --- |
| `getPrayerOfTheDay(options?)` | `Prayer` | Liturgical-calendar-aware. See [Prayer of the Day](#prayer-of-the-day) below. |
| `getPrayerById(id, options?)` | `Prayer \| null` | O(1) lookup; returns `null` for unknown ids. |
| `listPrayers(options?)` | `PrayerSummary[]` | All 411 summaries. No bodies — use `getPrayerById` for those. |
| `listPrayersByCategory(id, options?)` | `PrayerSummary[]` | Empty array for unknown categories. |
| `listCategories(options?)` | `Category[]` | All 28 categories with prayer counts. |
| `searchPrayers(query, options?)` | `PrayerSummary[]` | Case-insensitive substring across titles, authors, source titles. |
| `getDayContext(date?)` | `DayContext` | Season, weekday, principal-feast flag for any date. |

Full TypeScript types ship with the package — your IDE will surface them on hover.

## Prayer of the Day

The scheduler implements a deterministic liturgical strategy:

- **Ethiopian-anchored seasons.** Christmas = Genna (Jan 7), Epiphany = Timket (Jan 19), New Year = Enkutatash (~Sept 11). Lent and Easter use the [Bahire Hasab](https://en.wikipedia.org/wiki/Bahire_Hasab) computus via `kenat`. Advent is the four Sundays before Genna.
- **Weekday-aware category priority.** Mondays favor `daily`, Wednesdays favor `confession` (especially in Advent and Lent), Thursdays favor `thanksgiving`, Saturdays favor `general`. Sundays and principal feasts always lead with the season-specific prayer.
- **Cooldown ladder.** A prayer cannot repeat for at least 28 days. If no candidate survives, the cooldown relaxes to 14, 7, then 1 — but the same prayer never appears on consecutive days.
- **Principal feasts** (`isPrincipalFeast: true`): Genna, Timket, Hosanna (Palm), Fasika (Easter), Erget (Ascension), Paraclete (Pentecost), Trinity Sunday, Enkutatash, Meskel.

The schedule is **deterministic from a fixed anchor** of `2025-01-01`. The first call to `getPrayerOfTheDay(date)` walks forward day-by-day from the anchor to compute and cache picks (~50ms cold for a date inside the first year, <1ms for cached dates). State is module-scoped — no persistence required from the consumer.

Dates before the anchor throw with a clear error. There is no upper bound: future dates extend the cache lazily.

## Bilingual coverage

The current corpus has **100% Amharic coverage** for all 411 prayers, plus curated English + Amharic display names for all 28 categories. Translation policy is `sense_first_faithful` — meaning preserved over word-for-word literal rendering.

The `Prayer.languageFallback` field is reserved for future translations that may be incomplete; it is currently never set.

## Confessional stance

The corpus is curated from confessional Lutheran sources, including Johann Gerhard's _Meditationes Sacrae_ and _Prayers (A Daily Practice of Piety)_, Luther's catechisms, and historic Lutheran prayer books. Every prayer carries an `attribution` object with author, dates, source title, and (where available) source page numbers.

## Acknowledgments

- [`kenat`](https://www.npmjs.com/package/kenat) by Melaku Demeke — Ethiopian calendar conversion and Bahire Hasab.
- The translators and source-text editors who prepared the bilingual corpus.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to add prayers, fix attributions, or improve translations.

## License

MIT — see [LICENSE](./LICENSE). Copyright © Ephrem K. Getachew.
