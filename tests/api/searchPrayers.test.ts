import { describe, expect, it } from 'vitest';
import { searchPrayers } from '../../src/index.js';

describe('searchPrayers', () => {
  it('returns empty for an empty query', () => {
    expect(searchPrayers('')).toEqual([]);
    expect(searchPrayers('   ')).toEqual([]);
  });

  it('finds prayers by author (case-insensitive)', () => {
    const results = searchPrayers('GERHARD', { limit: 5 });
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(5);
  });

  it('respects the limit option', () => {
    const results = searchPrayers('prayer', { limit: 3 });
    expect(results).toHaveLength(3);
  });

  it('uses default limit of 20', () => {
    const results = searchPrayers('prayer');
    expect(results.length).toBeLessThanOrEqual(20);
  });

  it('matches against Amharic content', () => {
    const results = searchPrayers('ጸሎት', { language: 'am', limit: 5 });
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(r.language).toBe('am');
    }
  });

  it('throws on invalid limit', () => {
    expect(() => searchPrayers('x', { limit: 0 })).toThrow(/positive integer/);
    expect(() => searchPrayers('x', { limit: -1 })).toThrow(/positive integer/);
  });
});
