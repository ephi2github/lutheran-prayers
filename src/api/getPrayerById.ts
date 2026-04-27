import type { LanguageOption, Prayer } from '../types.js';
import { getPrayer } from '../data/loader.js';
import { resolveLanguage, toPrayer } from '../data/resolve.js';

/**
 * Looks up a prayer by stable identifier.
 *
 * @param id - Prayer ID in `P###` format (e.g. `"P001"`).
 * @param options.language - `'en'` (default) or `'am'`.
 * @returns The full {@link Prayer}, or `null` when no prayer has that id.
 *
 * @throws If `language` is invalid.
 *
 * @example
 * ```ts
 * const p001 = getPrayerById('P001');
 * if (p001) console.log(p001.attribution?.author);  // "Johann Gerhard"
 *
 * const inAmharic = getPrayerById('P001', { language: 'am' });
 * const missing = getPrayerById('NOPE');             // null
 * ```
 */
export function getPrayerById(id: string, options?: LanguageOption): Prayer | null {
  const language = resolveLanguage(options?.language);
  const prayer = getPrayer(id);
  if (!prayer) return null;
  return toPrayer(prayer, language);
}
