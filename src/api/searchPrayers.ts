import type { PrayerSummary, SearchOptions } from '../types.js';
import { getCorpus } from '../data/loader.js';
import { resolveLanguage, toPrayerSummary } from '../data/resolve.js';

const DEFAULT_LIMIT = 20;

export function searchPrayers(query: string, options?: SearchOptions): PrayerSummary[] {
  const trimmed = query.trim().toLowerCase();
  if (trimmed.length === 0) return [];

  const language = resolveLanguage(options?.language);
  const limit = options?.limit ?? DEFAULT_LIMIT;
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error(`lutheran-prayers: searchPrayers limit must be a positive integer`);
  }

  const results: PrayerSummary[] = [];
  for (const prayer of getCorpus().prayers) {
    if (matches(prayer.title.en, trimmed) ||
        matches(prayer.title.am, trimmed) ||
        matches(prayer.attribution.author, trimmed) ||
        matches(prayer.attribution.sourceTitle.en, trimmed) ||
        matches(prayer.attribution.sourceTitle.am, trimmed)) {
      results.push(toPrayerSummary(prayer, language));
      if (results.length >= limit) break;
    }
  }
  return results;
}

function matches(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle);
}
