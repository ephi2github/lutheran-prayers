import { describe, expect, it } from 'vitest';
import { getCorpus } from '../../src/data/loader.js';

const EXPECTED_PRAYER_COUNT = 411;
const EXPECTED_CATEGORY_COUNT = 28;

describe('bundled corpus integrity', () => {
  const corpus = getCorpus();

  it('matches expected prayer and category counts (snapshot)', () => {
    expect({
      prayers: corpus.prayers.length,
      categories: corpus.categories.length,
    }).toEqual({
      prayers: EXPECTED_PRAYER_COUNT,
      categories: EXPECTED_CATEGORY_COUNT,
    });
  });

  it('has unique prayer IDs', () => {
    const ids = new Set(corpus.prayers.map((p) => p.id));
    expect(ids.size).toBe(corpus.prayers.length);
  });

  it('has unique category IDs', () => {
    const ids = new Set(corpus.categories.map((c) => c.id));
    expect(ids.size).toBe(corpus.categories.length);
  });

  it('every prayer references a known category', () => {
    const validIds = new Set(corpus.categories.map((c) => c.id));
    const orphans = corpus.prayers.filter((p) => !validIds.has(p.categoryId));
    expect(orphans).toEqual([]);
  });

  it('every prayer has non-empty English title and body', () => {
    const empty = corpus.prayers.filter(
      (p) => p.title.en.trim().length === 0 || p.body.en.trim().length === 0,
    );
    expect(empty).toEqual([]);
  });

  it('every prayer has non-empty Amharic title and body', () => {
    const empty = corpus.prayers.filter(
      (p) => p.title.am.trim().length === 0 || p.body.am.trim().length === 0,
    );
    expect(empty).toEqual([]);
  });

  it('every prayer has attribution with author and source title', () => {
    const missing = corpus.prayers.filter(
      (p) =>
        !p.attribution ||
        p.attribution.author.length === 0 ||
        p.attribution.sourceTitle.en.length === 0,
    );
    expect(missing).toEqual([]);
  });

  it('corpus is deeply frozen', () => {
    expect(Object.isFrozen(corpus)).toBe(true);
    expect(Object.isFrozen(corpus.prayers)).toBe(true);
    expect(Object.isFrozen(corpus.prayers[0])).toBe(true);
    expect(Object.isFrozen(corpus.prayers[0]?.attribution)).toBe(true);
  });
});
