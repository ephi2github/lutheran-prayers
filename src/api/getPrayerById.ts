import type { LanguageOption, Prayer } from '../types.js';
import { getPrayer } from '../data/loader.js';
import { resolveLanguage, toPrayer } from '../data/resolve.js';

export function getPrayerById(id: string, options?: LanguageOption): Prayer | null {
  const language = resolveLanguage(options?.language);
  const prayer = getPrayer(id);
  if (!prayer) return null;
  return toPrayer(prayer, language);
}
