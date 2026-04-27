import { describe, expect, it } from 'vitest';
import { getPrayerOfTheDay } from '../../src/index.js';

describe('getPrayerOfTheDay', () => {
  it('is deterministic for a given UTC date', () => {
    const date = new Date('2026-04-27T00:00:00Z');
    const a = getPrayerOfTheDay({ date });
    const b = getPrayerOfTheDay({ date });
    expect(a.id).toBe(b.id);
  });

  it('returns different prayers for different days', () => {
    const day1 = getPrayerOfTheDay({ date: new Date('2026-04-27T00:00:00Z') });
    const day2 = getPrayerOfTheDay({ date: new Date('2026-04-28T00:00:00Z') });
    expect(day1.id).not.toBe(day2.id);
  });

  it('defaults language to English', () => {
    const p = getPrayerOfTheDay({ date: new Date('2026-04-27T00:00:00Z') });
    expect(p.language).toBe('en');
  });

  it('returns Amharic when requested', () => {
    const date = new Date('2026-04-27T00:00:00Z');
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
});
