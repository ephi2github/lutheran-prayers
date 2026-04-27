import bundled from './bundled/corpus.json' with { type: 'json' };
import type { BundledCorpus, BundledCategory, BundledPrayer } from './types.js';

const CORPUS = deepFreeze(bundled as BundledCorpus);

const PRAYER_INDEX: ReadonlyMap<string, BundledPrayer> = new Map(
  CORPUS.prayers.map((p) => [p.id, p]),
);

const CATEGORY_INDEX: ReadonlyMap<string, BundledCategory> = new Map(
  CORPUS.categories.map((c) => [c.id, c]),
);

const CATEGORY_PRAYER_COUNTS: ReadonlyMap<string, number> = (() => {
  const counts = new Map<string, number>();
  for (const p of CORPUS.prayers) {
    counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1);
  }
  return counts;
})();

export function getCorpus(): BundledCorpus {
  return CORPUS;
}

export function getPrayer(id: string): BundledPrayer | undefined {
  return PRAYER_INDEX.get(id);
}

export function getCategory(id: string): BundledCategory | undefined {
  return CATEGORY_INDEX.get(id);
}

export function getCategoryPrayerCount(id: string): number {
  return CATEGORY_PRAYER_COUNTS.get(id) ?? 0;
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const key of Object.keys(value)) {
      deepFreeze((value as Record<string, unknown>)[key]);
    }
  }
  return value;
}
