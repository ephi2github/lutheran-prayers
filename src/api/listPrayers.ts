import type { LanguageOption, PrayerSummary } from '../types.js';
import { getCorpus } from '../data/loader.js';
import { resolveLanguage, toPrayerSummary } from '../data/resolve.js';

/**
 * Returns lightweight summaries of all prayers in the corpus, sorted by id.
 *
 * Summaries do **not** include prayer bodies — use {@link getPrayerById} to
 * fetch a full prayer. This keeps list calls cheap and prevents accidental
 * full-corpus serialization.
 *
 * @param options.language - `'en'` (default) or `'am'`. Affects which language
 *   the `title` field is in.
 * @returns 411 {@link PrayerSummary} objects.
 *
 * @throws If `language` is invalid.
 *
 * @example
 * ```ts
 * const all = listPrayers();
 * console.log(all.length);          // 411
 * console.log(all[0]?.id);          // "P001"
 * ```
 */
export function listPrayers(options?: LanguageOption): PrayerSummary[] {
  const language = resolveLanguage(options?.language);
  return getCorpus().prayers.map((p) => toPrayerSummary(p, language));
}
