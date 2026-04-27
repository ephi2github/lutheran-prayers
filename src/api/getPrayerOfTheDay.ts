import type { Prayer, PrayerOfTheDayOptions } from '../types.js';
import { resolveLanguage, toPrayer } from '../data/resolve.js';
import { selectPrayerOfTheDay } from '../strategies/prayerOfTheDay.js';

/**
 * Returns the prayer scheduled for the given date by the liturgical scheduler.
 *
 * The scheduler is deterministic from a fixed anchor (`2025-01-01`). On the
 * first call after import, it walks forward from the anchor to the requested
 * date computing and caching picks; subsequent calls are O(1) lookups.
 *
 * @param options.date - Date to compute for, interpreted in UTC. Defaults to now.
 * @param options.language - `'en'` (default) or `'am'`.
 * @returns The full {@link Prayer} for the requested day.
 *
 * @throws If `date` precedes the anchor (`2025-01-01`).
 * @throws If `language` is invalid.
 *
 * @example
 * ```ts
 * const today = getPrayerOfTheDay();
 * const easter = getPrayerOfTheDay({ date: new Date('2026-04-12') });
 * const easterAm = getPrayerOfTheDay({ date: new Date('2026-04-12'), language: 'am' });
 * ```
 */
export function getPrayerOfTheDay(options?: PrayerOfTheDayOptions): Prayer {
  const language = resolveLanguage(options?.language);
  const date = options?.date ?? new Date();
  const prayer = selectPrayerOfTheDay(date);
  return toPrayer(prayer, language);
}
