import type { Category, LanguageOption } from '../types.js';
import { getCorpus } from '../data/loader.js';
import { resolveLanguage, toCategory } from '../data/resolve.js';

/**
 * Returns all 28 categories with their localized display names, optional
 * descriptions, and accurate prayer counts.
 *
 * @param options.language - `'en'` (default) or `'am'`.
 * @returns Array of {@link Category}, sorted by id.
 *
 * @throws If `language` is invalid.
 *
 * @example
 * ```ts
 * const cats = listCategories();
 * cats.find(c => c.id === 'lent')?.description;
 * // "The forty-day fast preceding Easter."
 *
 * const totalPrayers = cats.reduce((sum, c) => sum + c.prayerCount, 0);  // 411
 * ```
 */
export function listCategories(options?: LanguageOption): Category[] {
  const language = resolveLanguage(options?.language);
  return getCorpus().categories.map((c) => toCategory(c, language));
}
