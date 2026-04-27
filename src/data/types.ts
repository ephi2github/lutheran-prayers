/**
 * Internal data types — the shape of the bundled corpus.json. These are NOT
 * the public API types (see ../types.ts). The runtime translates these into
 * public types based on the requested language.
 */

export interface BundledLocalizedString {
  en: string;
  am: string;
}

export interface BundledOptionalLocalizedString {
  en: string | null;
  am: string | null;
}

export interface BundledAttribution {
  author: string;
  authorDates: string;
  sourceTitle: BundledLocalizedString;
  pageStart?: number;
  pageEnd?: number;
}

export interface BundledPrayer {
  id: string;
  categoryId: string;
  title: BundledLocalizedString;
  body: BundledLocalizedString;
  attribution: BundledAttribution;
}

export interface BundledCategory {
  id: string;
  name: BundledLocalizedString;
  description?: BundledOptionalLocalizedString;
}

export interface BundledCorpus {
  builtAt: string;
  schemaVersion: 1;
  categories: BundledCategory[];
  prayers: BundledPrayer[];
}
