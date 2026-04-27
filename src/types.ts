export type Language = 'en' | 'am';

export interface PrayerSummary {
  id: string;
  title: string;
  categoryId: string;
  language: Language;
}

export interface PrayerAttribution {
  author: string;
  authorDates?: string;
  sourceTitle: string;
  pageStart?: number;
  pageEnd?: number;
}

export interface Prayer extends PrayerSummary {
  body: string;
  attribution?: PrayerAttribution;
  /**
   * Set when the requested language was unavailable and another language was
   * substituted (e.g. Amharic requested, English returned). The current corpus
   * has 100% bilingual coverage, so this is reserved for future translations.
   */
  languageFallback?: Language;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  prayerCount: number;
}

export interface LanguageOption {
  language?: Language;
}

export interface PrayerOfTheDayOptions extends LanguageOption {
  date?: Date;
}

export interface SearchOptions extends LanguageOption {
  limit?: number;
}
