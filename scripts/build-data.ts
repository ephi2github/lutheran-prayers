import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { validate } from './validate-data.js';
import type {
  BundledAttribution,
  BundledCategory,
  BundledCorpus,
  BundledOptionalLocalizedString,
  BundledPrayer,
} from '../src/data/types.js';

const OUT_PATH = resolve(process.cwd(), 'src/data/bundled/corpus.json');

function normalizePageNumber(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return undefined;
  }
  return value;
}

async function main(): Promise<void> {
  const { errors, warnings, prayers, categories } = await validate();
  if (errors.length > 0) {
    for (const e of errors) console.error(`ERROR ${e}`);
    process.exit(1);
  }
  for (const w of warnings) console.warn(`WARN  ${w}`);

  const bundledCategories: BundledCategory[] = categories
    .map((cat): BundledCategory => {
      const description: BundledOptionalLocalizedString | undefined = cat.description
        ? { en: cat.description.en, am: cat.description.am }
        : undefined;
      return description
        ? { id: cat.id, name: { en: cat.name.en, am: cat.name.am }, description }
        : { id: cat.id, name: { en: cat.name.en, am: cat.name.am } };
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  const bundledPrayers: BundledPrayer[] = prayers
    .map((p): BundledPrayer => {
      const meta = p.meta as { page_start?: number | null; page_end?: number | null };
      const pageStart = normalizePageNumber(meta.page_start);
      const pageEnd = normalizePageNumber(meta.page_end);
      const attribution: BundledAttribution = {
        author: p.author,
        authorDates: p.author_dates,
        sourceTitle: { en: p.source_title, am: p.source_title_am },
        ...(pageStart !== undefined ? { pageStart } : {}),
        ...(pageEnd !== undefined ? { pageEnd } : {}),
      };
      return {
        id: p.id,
        categoryId: p.category,
        title: { en: p.display_title, am: p.display_title_am },
        body: { en: p.text, am: p.text_am },
        attribution,
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  const corpus: BundledCorpus = {
    builtAt: new Date().toISOString(),
    schemaVersion: 1,
    categories: bundledCategories,
    prayers: bundledPrayers,
  };

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(corpus) + '\n', 'utf8');

  console.log(
    `build-data: wrote ${bundledPrayers.length} prayers, ${bundledCategories.length} categories ` +
      `to ${OUT_PATH}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
