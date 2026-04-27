/**
 * Zod schemas for the source files in /data/source. Used by scripts/ only.
 * These must NEVER be imported by runtime code — Zod is a dev-only dependency.
 */
import { z } from 'zod';

const localizedString = z.object({
  en: z.string().min(1),
  am: z.string().min(1),
});

export const sourceCategorySchema = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/, 'category id must be lowercase snake_case'),
  name: localizedString,
  description: localizedString.optional(),
});

export const sourceCategoriesSchema = z.array(sourceCategorySchema).min(1);

export const sourcePrayerSchema = z
  .object({
    id: z.string().regex(/^P\d{3}$/, 'prayer id must match P###'),
    title: z.string().min(1),
    title_am: z.string().min(1),
    display_title: z.string().min(1),
    display_title_am: z.string().min(1),
    text: z.string().min(1),
    text_am: z.string().min(1),
    author: z.string(),
    author_dates: z.string(),
    source_title: z.string(),
    source_title_am: z.string(),
    source_filename: z.string(),
    source_priority: z.string(),
    date: z.unknown(),
    category: z.string().min(1),
    category_am: z.string().min(1),
    categories: z.array(z.string()).min(1),
    categories_am: z.array(z.string()).min(1),
    meta: z
      .object({
        page_start: z.number().nullable().optional(),
        page_end: z.number().nullable().optional(),
      })
      .passthrough(),
  })
  .passthrough();

export const sourceCorpusSchema = z.object({
  meta: z
    .object({
      schema_version: z.number(),
      prayer_count: z.number(),
      translation_language: z.literal('am'),
    })
    .passthrough(),
  prayers: z.array(sourcePrayerSchema).min(1),
});

export type SourceCategoryInput = z.infer<typeof sourceCategorySchema>;
export type SourcePrayerInput = z.infer<typeof sourcePrayerSchema>;
export type SourceCorpusInput = z.infer<typeof sourceCorpusSchema>;
