import { describe, expect, it } from 'vitest';
import { listPrayers } from '../../src/index.js';

describe('listPrayers', () => {
  it('returns 411 summaries by default', () => {
    const prayers = listPrayers();
    expect(prayers).toHaveLength(411);
  });

  it('summaries do not contain prayer bodies', () => {
    const prayers = listPrayers();
    for (const p of prayers) {
      expect(p).not.toHaveProperty('body');
      expect(p).not.toHaveProperty('attribution');
    }
  });

  it('summaries carry the requested language code', () => {
    expect(listPrayers()[0]?.language).toBe('en');
    expect(listPrayers({ language: 'am' })[0]?.language).toBe('am');
  });

  it('Amharic titles differ from English titles', () => {
    const en = listPrayers();
    const am = listPrayers({ language: 'am' });
    expect(en[0]?.title).not.toBe(am[0]?.title);
  });

  it('is sorted by id (P001 first)', () => {
    const prayers = listPrayers();
    expect(prayers[0]?.id).toBe('P001');
    const ids = prayers.map((p) => p.id);
    const sorted = [...ids].sort();
    expect(ids).toEqual(sorted);
  });
});
