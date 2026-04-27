import type { LanguageOption, PrayerSummary } from '../types.js';
import { getCorpus } from '../data/loader.js';
import { resolveLanguage, toPrayerSummary } from '../data/resolve.js';

/**
 * Returns all prayer summaries for a given category, sorted by id.
 *
 * @param categoryId - Slug-style category identifier (e.g. `"confession"`).
 * @param options.language - `'en'` (default) or `'am'`.
 * @returns Array of {@link PrayerSummary}. Empty array for unknown categories
 *   (no error thrown).
 *
 * @throws If `language` is invalid.
 *
 * @example
 * ```ts
 * listPrayersByCategory('confession').length;        // 10
 * listPrayersByCategory('after_trinity').length;     // 70
 * listPrayersByCategory('not-a-real-category');      // []
 * ```
 */
export function listPrayersByCategory(
  categoryId: string,
  options?: LanguageOption,
): PrayerSummary[] {
  const language = resolveLanguage(options?.language);
  return getCorpus()
    .prayers.filter((p) => p.categoryId === categoryId)
    .map((p) => toPrayerSummary(p, language));
}
