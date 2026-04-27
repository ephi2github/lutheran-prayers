export type Language = 'en' | 'am';

export interface PrayerSummary {
  id: string;
  title: string;
  categoryId: string;
  language: Language;
}

export interface Prayer extends PrayerSummary {
  body: string;
  source?: string;
  notes?: string;
  tags?: string[];
  /**
   * Set when the requested language was unavailable and another language was
   * substituted (e.g. Amharic requested, English returned).
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
