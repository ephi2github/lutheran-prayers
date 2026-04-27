import { describe, expect, it } from 'vitest';
import { getPrayerById } from '../../src/index.js';

describe('getPrayerById', () => {
  it('returns the full prayer for a known id', () => {
    const p = getPrayerById('P001');
    expect(p).not.toBeNull();
    expect(p?.id).toBe('P001');
    expect(p?.body.length).toBeGreaterThan(100);
    expect(p?.categoryId).toBe('confession');
    expect(p?.language).toBe('en');
  });

  it('returns attribution for prayers that have it', () => {
    const p = getPrayerById('P001');
    expect(p?.attribution?.author).toBe('Johann Gerhard');
    expect(p?.attribution?.authorDates).toBe('1582-1637');
    expect(p?.attribution?.sourceTitle).toContain('Prayers');
  });

  it('returns null for unknown id (does not throw)', () => {
    expect(getPrayerById('NOPE')).toBeNull();
    expect(getPrayerById('')).toBeNull();
  });

  it('returns Amharic body when language=am', () => {
    const en = getPrayerById('P001');
    const am = getPrayerById('P001', { language: 'am' });
    expect(am?.body).not.toBe(en?.body);
    expect(am?.language).toBe('am');
  });

  it('attribution.sourceTitle resolves to the requested language', () => {
    const en = getPrayerById('P001');
    const am = getPrayerById('P001', { language: 'am' });
    expect(am?.attribution?.sourceTitle).not.toBe(en?.attribution?.sourceTitle);
  });

  it('throws on invalid language', () => {
    expect(() => getPrayerById('P001', { language: 'fr' as 'en' })).toThrow(/invalid language/);
  });

  it('returns the last prayer (P411) successfully', () => {
    const p = getPrayerById('P411');
    expect(p).not.toBeNull();
    expect(p?.id).toBe('P411');
  });
});
