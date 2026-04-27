import type { Category, Language, Prayer, PrayerAttribution, PrayerSummary } from '../types.js';
import type { BundledCategory, BundledPrayer } from './types.js';
import { getCategoryPrayerCount } from './loader.js';

export const VALID_LANGUAGES: ReadonlySet<Language> = new Set<Language>(['en', 'am']);

export function assertLanguage(language: Language): void {
  if (!VALID_LANGUAGES.has(language)) {
    throw new Error(`lutheran-prayers: invalid language "${String(language)}"`);
  }
}

export function resolveLanguage(language: Language | undefined): Language {
  const resolved: Language = language ?? 'en';
  assertLanguage(resolved);
  return resolved;
}

export function toPrayerSummary(prayer: BundledPrayer, language: Language): PrayerSummary {
  return {
    id: prayer.id,
    title: prayer.title[language],
    categoryId: prayer.categoryId,
    language,
  };
}

export function toPrayer(prayer: BundledPrayer, language: Language): Prayer {
  const attribution = toAttribution(prayer.attribution, language);
  return {
    id: prayer.id,
    title: prayer.title[language],
    body: prayer.body[language],
    categoryId: prayer.categoryId,
    language,
    ...(attribution ? { attribution } : {}),
  };
}

export function toCategory(category: BundledCategory, language: Language): Category {
  const description = category.description?.[language];
  return {
    id: category.id,
    name: category.name[language],
    prayerCount: getCategoryPrayerCount(category.id),
    ...(description ? { description } : {}),
  };
}

function toAttribution(
  attribution: BundledPrayer['attribution'],
  language: Language,
): PrayerAttribution {
  return {
    author: attribution.author,
    ...(attribution.authorDates ? { authorDates: attribution.authorDates } : {}),
    sourceTitle: attribution.sourceTitle[language],
    ...(attribution.pageStart !== undefined ? { pageStart: attribution.pageStart } : {}),
    ...(attribution.pageEnd !== undefined ? { pageEnd: attribution.pageEnd } : {}),
  };
}
