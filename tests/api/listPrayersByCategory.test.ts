import { describe, expect, it } from 'vitest';
import { listPrayersByCategory } from '../../src/index.js';

describe('listPrayersByCategory', () => {
  it('returns prayers for a known category', () => {
    const confession = listPrayersByCategory('confession');
    expect(confession).toHaveLength(10);
    for (const p of confession) {
      expect(p.categoryId).toBe('confession');
    }
  });

  it('returns the largest category (after_trinity) with 70 prayers', () => {
    expect(listPrayersByCategory('after_trinity')).toHaveLength(70);
  });

  it('returns an empty array for an unknown category', () => {
    expect(listPrayersByCategory('not-a-real-category')).toEqual([]);
  });

  it('respects the language option', () => {
    const am = listPrayersByCategory('confession', { language: 'am' });
    expect(am[0]?.language).toBe('am');
  });
});
