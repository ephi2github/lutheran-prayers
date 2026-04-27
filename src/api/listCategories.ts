import type { Category, LanguageOption } from '../types.js';
import { getCorpus } from '../data/loader.js';
import { resolveLanguage, toCategory } from '../data/resolve.js';

export function listCategories(options?: LanguageOption): Category[] {
  const language = resolveLanguage(options?.language);
  return getCorpus().categories.map((c) => toCategory(c, language));
}
