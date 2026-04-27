import { beforeEach, describe, expect, it } from 'vitest';
import { getPrayerOfTheDay } from '../../src/index.js';
import { _resetScheduler } from '../../src/strategies/prayerOfTheDay.js';

describe('getPrayerOfTheDay (public API)', () => {
  beforeEach(() => {
    _resetScheduler();
  });

  it('is deterministic for a given UTC date', () => {
    const date = new Date(Date.UTC(2026, 3, 27));
    const a = getPrayerOfTheDay({ date });
    const b = getPrayerOfTheDay({ date });
    expect(a.id).toBe(b.id);
  });

  it('returns different prayers on consecutive days', () => {
    const day1 = getPrayerOfTheDay({ date: new Date(Date.UTC(2026, 3, 27)) });
    const day2 = getPrayerOfTheDay({ date: new Date(Date.UTC(2026, 3, 28)) });
    expect(day1.id).not.toBe(day2.id);
  });

  it('defaults language to English', () => {
    const p = getPrayerOfTheDay({ date: new Date(Date.UTC(2026, 3, 27)) });
    expect(p.language).toBe('en');
  });

  it('returns Amharic body for the same prayer when language=am', () => {
    const date = new Date(Date.UTC(2026, 3, 27));
    const en = getPrayerOfTheDay({ date });
    const am = getPrayerOfTheDay({ date, language: 'am' });
    expect(am.id).toBe(en.id);
    expect(am.language).toBe('am');
    expect(am.body).not.toBe(en.body);
  });

  it('uses current date when no date is provided', () => {
    const p = getPrayerOfTheDay();
    expect(p.id).toMatch(/^P\d{3}$/);
  });

  it('Easter Sunday 2026 picks an easter-window prayer', () => {
    const easter = new Date(Date.UTC(2026, 3, 12));
    const p = getPrayerOfTheDay({ date: easter });
    const easterFamily = new Set(['easter', 'after_easter']);
    expect(easterFamily.has(p.categoryId)).toBe(true);
  });
});
