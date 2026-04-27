import type { Prayer, PrayerOfTheDayOptions } from '../types.js';
import { resolveLanguage, toPrayer } from '../data/resolve.js';
import { selectPrayerOfTheDay } from '../strategies/prayerOfTheDay.js';

export function getPrayerOfTheDay(options?: PrayerOfTheDayOptions): Prayer {
  const language = resolveLanguage(options?.language);
  const date = options?.date ?? new Date();
  const prayer = selectPrayerOfTheDay(date);
  return toPrayer(prayer, language);
}
