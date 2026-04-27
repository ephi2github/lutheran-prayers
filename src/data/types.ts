import type { Language } from '../types.js';

export type LocalizedString = Record<Language, string | null>;

export interface SourceCategory {
  id: string;
  name: LocalizedString;
  description?: LocalizedString;
}

export interface SourcePrayer {
  id: string;
  categoryId: string;
  source?: string;
  notes?: LocalizedString;
  tags?: string[];
  title: LocalizedString;
  body: LocalizedString;
}

export interface SourceCorpus {
  categories: SourceCategory[];
  prayers: SourcePrayer[];
}
