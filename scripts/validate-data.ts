import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  sourceCategoriesSchema,
  sourceCorpusSchema,
  type SourceCategoryInput,
  type SourcePrayerInput,
} from '../src/data/schemas.js';

const SOURCE_DIR = resolve(process.cwd(), 'data/source');
const PRAYERS_PATH = resolve(SOURCE_DIR, 'prayers_am.json');
const CATEGORIES_PATH = resolve(SOURCE_DIR, 'categories.json');

interface ValidationReport {
  errors: string[];
  warnings: string[];
  prayers: SourcePrayerInput[];
  categories: SourceCategoryInput[];
}

async function readJson<T>(path: string): Promise<T> {
  const raw = await readFile(path, 'utf8');
  return JSON.parse(raw) as T;
}

export async function validate(): Promise<ValidationReport> {
  const errors: string[] = [];
  const warnings: string[] = [];

  const corpusRaw = await readJson<unknown>(PRAYERS_PATH);
  const corpusParsed = sourceCorpusSchema.safeParse(corpusRaw);
  if (!corpusParsed.success) {
    for (const issue of corpusParsed.error.issues) {
      errors.push(`prayers_am.json: ${issue.path.join('.')} — ${issue.message}`);
    }
    return { errors, warnings, prayers: [], categories: [] };
  }
  const prayers = corpusParsed.data.prayers;

  const categoriesRaw = await readJson<unknown>(CATEGORIES_PATH);
  const categoriesParsed = sourceCategoriesSchema.safeParse(categoriesRaw);
  if (!categoriesParsed.success) {
    for (const issue of categoriesParsed.error.issues) {
      errors.push(`categories.json: ${issue.path.join('.')} — ${issue.message}`);
    }
    return { errors, warnings, prayers, categories: [] };
  }
  const categories = categoriesParsed.data;

  const seenPrayerIds = new Set<string>();
  for (const prayer of prayers) {
    if (seenPrayerIds.has(prayer.id)) {
      errors.push(`Duplicate prayer id: ${prayer.id}`);
    }
    seenPrayerIds.add(prayer.id);
  }

  const seenCategoryIds = new Set<string>();
  for (const cat of categories) {
    if (seenCategoryIds.has(cat.id)) {
      errors.push(`Duplicate category id: ${cat.id}`);
    }
    seenCategoryIds.add(cat.id);
  }

  const corpusCategorySlugs = new Set(prayers.map((p) => p.category));
  for (const slug of corpusCategorySlugs) {
    if (!seenCategoryIds.has(slug)) {
      errors.push(
        `Prayer category "${slug}" has no matching entry in categories.json`,
      );
    }
  }

  for (const cat of categories) {
    if (!corpusCategorySlugs.has(cat.id)) {
      warnings.push(`Curated category "${cat.id}" has no prayers in the corpus`);
    }
  }

  const sourceAmByCategory = new Map<string, Map<string, number>>();
  for (const prayer of prayers) {
    const counts = sourceAmByCategory.get(prayer.category) ?? new Map<string, number>();
    counts.set(prayer.category_am, (counts.get(prayer.category_am) ?? 0) + 1);
    sourceAmByCategory.set(prayer.category, counts);
  }
  for (const [slug, counts] of sourceAmByCategory) {
    if (counts.size > 1) {
      const variants = [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([name, n]) => `"${name}" (×${n})`)
        .join(', ');
      warnings.push(
        `Category "${slug}" has inconsistent Amharic names in source: ${variants}. ` +
          `Curated categories.json is authoritative.`,
      );
    }
  }

  for (const prayer of prayers) {
    if (prayer.categories.length !== 1 || prayer.categories[0] !== prayer.category) {
      warnings.push(
        `Prayer ${prayer.id} has categories[]=${JSON.stringify(prayer.categories)} ` +
          `not equal to [${prayer.category}]. Build will use singular category.`,
      );
    }
  }

  return { errors, warnings, prayers, categories };
}

async function main(): Promise<void> {
  const { errors, warnings, prayers, categories } = await validate();

  for (const w of warnings) console.warn(`WARN  ${w}`);
  for (const e of errors) console.error(`ERROR ${e}`);

  console.log(
    `\nvalidate-data: ${prayers.length} prayers, ${categories.length} categories, ` +
      `${errors.length} errors, ${warnings.length} warnings`,
  );

  process.exit(errors.length > 0 ? 1 : 0);
}

const isDirectInvocation = process.argv[1] === fileURLToPath(import.meta.url);
if (isDirectInvocation) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
