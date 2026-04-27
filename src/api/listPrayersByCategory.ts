import type { LanguageOption, PrayerSummary } from '../types.js';
import { getCorpus } from '../data/loader.js';
import { resolveLanguage, toPrayerSummary } from '../data/resolve.js';

export function listPrayersByCategory(
  categoryId: string,
  options?: LanguageOption,
): PrayerSummary[] {
  const language = resolveLanguage(options?.language);
  return getCorpus()
    .prayers.filter((p) => p.categoryId === categoryId)
    .map((p) => toPrayerSummary(p, language));
}
