/** Two-letter language code. `'en'` is the default; `'am'` selects Amharic. */
export type Language = 'en' | 'am';

/**
 * Lightweight prayer reference returned by the `list*` and `searchPrayers`
 * functions. Carries identifying metadata only — no body, no attribution.
 * Use {@link getPrayerById} to fetch the full prayer.
 */
export interface PrayerSummary {
  /** Stable prayer identifier in `P###` format (e.g. `"P001"`). */
  id: string;
  /** Display title in the requested language. */
  title: string;
  /** Slug of the category this prayer belongs to (e.g. `"confession"`). */
  categoryId: string;
  /** Language code reflecting which language the `title` is in. */
  language: Language;
}

/**
 * Provenance information attached to a prayer. The corpus is curated from
 * historic Lutheran sources, so attribution is typically rich and accurate.
 */
export interface PrayerAttribution {
  /** Original author (e.g. `"Johann Gerhard"`). */
  author: string;
  /** Author's life dates as a free-form string (e.g. `"1582-1637"`). */
  authorDates?: string;
  /** Source work title in the requested language. */
  sourceTitle: string;
  /** Page where the prayer begins in the source, if known. */
  pageStart?: number;
  /** Page where the prayer ends in the source, if known. */
  pageEnd?: number;
}

/**
 * A complete prayer including body and attribution. Returned by
 * {@link getPrayerById} and {@link getPrayerOfTheDay}.
 */
export interface Prayer extends PrayerSummary {
  /** Full prayer text in the requested language. */
  body: string;
  /** Provenance — author, source, pages. Present for every prayer in the current corpus. */
  attribution?: PrayerAttribution;
  /**
   * Set when the requested language was unavailable and another language was
   * substituted (e.g. Amharic requested, English returned). The current corpus
   * has 100% bilingual coverage, so this is reserved for future translations.
   */
  languageFallback?: Language;
}

/**
 * A prayer category — for example `"advent"`, `"confession"`, `"after_trinity"`.
 * Returned by {@link listCategories} with localized names and an accurate count.
 */
export interface Category {
  /** Slug-style identifier (e.g. `"after_trinity"`). */
  id: string;
  /** Localized display name (e.g. `"After Trinity"` or `"ከሥላሴ በኋላ"`). */
  name: string;
  /** Localized description, where one has been authored. */
  description?: string;
  /** Number of prayers currently assigned to this category in the corpus. */
  prayerCount: number;
}

/** Common option shape for functions that accept a language. */
export interface LanguageOption {
  /** Defaults to `'en'`. */
  language?: Language;
}

/** Options for {@link getPrayerOfTheDay}. */
export interface PrayerOfTheDayOptions extends LanguageOption {
  /**
   * Date to compute the prayer for. Interpreted in UTC.
   * Defaults to the current date.
   */
  date?: Date;
}

/** Options for {@link searchPrayers}. */
export interface SearchOptions extends LanguageOption {
  /** Maximum number of results to return. Defaults to 20. Must be a positive integer. */
  limit?: number;
}
