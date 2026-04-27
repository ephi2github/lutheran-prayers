import type { LanguageOption, PrayerSummary } from '../types.js';
import { getCorpus } from '../data/loader.js';
import { resolveLanguage, toPrayerSummary } from '../data/resolve.js';

export function listPrayers(options?: LanguageOption): PrayerSummary[] {
  const language = resolveLanguage(options?.language);
  return getCorpus().prayers.map((p) => toPrayerSummary(p, language));
}
