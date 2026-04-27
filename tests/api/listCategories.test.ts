import { describe, expect, it } from 'vitest';
import { listCategories } from '../../src/index.js';

describe('listCategories', () => {
  it('returns all 28 categories with English names by default', () => {
    const categories = listCategories();
    expect(categories).toHaveLength(28);
    const advent = categories.find((c) => c.id === 'advent');
    expect(advent?.name).toBe('Advent');
    expect(advent?.prayerCount).toBe(14);
  });

  it('returns Amharic names when requested', () => {
    const categories = listCategories({ language: 'am' });
    const easter = categories.find((c) => c.id === 'easter');
    expect(easter?.name).toBe('ትንሣኤ');
  });

  it('reports prayer counts that sum to 411', () => {
    const total = listCategories().reduce((sum, c) => sum + c.prayerCount, 0);
    expect(total).toBe(411);
  });

  it('throws on invalid language', () => {
    expect(() => listCategories({ language: 'xx' as 'en' })).toThrow(/invalid language/);
  });

  it('exposes description when present (Lent has one)', () => {
    const lent = listCategories().find((c) => c.id === 'lent');
    expect(lent?.description).toMatch(/forty-day fast/);
  });
});
