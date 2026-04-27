import { beforeEach, describe, expect, it } from 'vitest';
import { dayContextFor } from '../../src/calendar/context.js';
import { addDays, toIsoDate } from '../../src/calendar/dateUtils.js';
import { getCorpus } from '../../src/data/loader.js';
import {
  _resetScheduler,
  selectPrayerOfTheDay,
} from '../../src/strategies/prayerOfTheDay.js';
import type { YMD } from '../../src/calendar/types.js';

const PRAYERS_BY_ID = new Map(getCorpus().prayers.map((p) => [p.id, p]));

function categoryOf(prayerId: string): string {
  return PRAYERS_BY_ID.get(prayerId)?.categoryId ?? 'unknown';
}

function walkYear(start: YMD, days: number): Array<{ date: string; prayerId: string }> {
  const result: Array<{ date: string; prayerId: string }> = [];
  let cursor = start;
  for (let i = 0; i < days; i++) {
    const prayer = selectPrayerOfTheDay(cursor);
    result.push({ date: toIsoDate(cursor), prayerId: prayer.id });
    cursor = addDays(cursor, 1);
  }
  return result;
}

describe('selectPrayerOfTheDay — strategy invariants over a full liturgical year', () => {
  beforeEach(() => {
    _resetScheduler();
  });

  it('walks 365 days starting 2026-01-01 without throwing', () => {
    const log = walkYear({ year: 2026, month: 1, day: 1 }, 365);
    expect(log).toHaveLength(365);
    for (const entry of log) {
      expect(PRAYERS_BY_ID.has(entry.prayerId)).toBe(true);
    }
  });

  it('never repeats the same prayer on consecutive dates', () => {
    const log = walkYear({ year: 2026, month: 1, day: 1 }, 200);
    for (let i = 1; i < log.length; i++) {
      expect(log[i]!.prayerId).not.toBe(log[i - 1]!.prayerId);
    }
  });

  it('never picks a prayer from an excluded category (deathbed, sick, baptism, etc.)', () => {
    const excluded = new Set([
      'deathbed',
      'sick',
      'baptism',
      'church_attendance',
      'preparatory',
      'motherhood',
      'table',
    ]);
    const log = walkYear({ year: 2026, month: 1, day: 1 }, 200);
    for (const { prayerId } of log) {
      expect(excluded.has(categoryOf(prayerId))).toBe(false);
    }
  });

  it('never picks a children prayer on Sunday or principal feast', () => {
    const log = walkYear({ year: 2026, month: 1, day: 1 }, 200);
    for (const { date, prayerId } of log) {
      if (categoryOf(prayerId) !== 'children') continue;
      const ctx = dayContextFor(new Date(`${date}T00:00:00Z`));
      expect(ctx.isSunday, `children pick on Sunday ${date}`).toBe(false);
      expect(ctx.isPrincipalFeast, `children pick on feast ${date}`).toBe(false);
    }
  });

  it('never picks a lent prayer outside lent dates', () => {
    const log = walkYear({ year: 2026, month: 1, day: 1 }, 365);
    for (const { date, prayerId } of log) {
      if (categoryOf(prayerId) !== 'lent') continue;
      const ctx = dayContextFor(new Date(`${date}T00:00:00Z`));
      expect(ctx.seasonKey, `lent prayer on non-lent date ${date}`).toBe('lent');
    }
  });

  it('never picks an advent prayer outside advent dates', () => {
    const log = walkYear({ year: 2026, month: 1, day: 1 }, 365);
    for (const { date, prayerId } of log) {
      if (categoryOf(prayerId) !== 'advent') continue;
      const ctx = dayContextFor(new Date(`${date}T00:00:00Z`));
      expect(ctx.seasonKey, `advent prayer on non-advent date ${date}`).toBe('advent');
    }
  });

  it('never picks festival_days_general during after_trinity', () => {
    const log = walkYear({ year: 2026, month: 1, day: 1 }, 365);
    for (const { date, prayerId } of log) {
      if (categoryOf(prayerId) !== 'festival_days_general') continue;
      const ctx = dayContextFor(new Date(`${date}T00:00:00Z`));
      expect(ctx.seasonKey, `festival_days_general on after_trinity ${date}`).not.toBe(
        'after_trinity',
      );
    }
  });

  it('confession density is higher in lent than in after_trinity', () => {
    const log = walkYear({ year: 2026, month: 1, day: 1 }, 365);
    let lentDays = 0;
    let lentConfession = 0;
    let afterTrinityDays = 0;
    let afterTrinityConfession = 0;
    for (const { date, prayerId } of log) {
      const ctx = dayContextFor(new Date(`${date}T00:00:00Z`));
      const isConfession = categoryOf(prayerId) === 'confession';
      if (ctx.seasonKey === 'lent') {
        lentDays += 1;
        if (isConfession) lentConfession += 1;
      } else if (ctx.seasonKey === 'after_trinity') {
        afterTrinityDays += 1;
        if (isConfession) afterTrinityConfession += 1;
      }
    }
    expect(lentDays).toBeGreaterThan(40);
    expect(afterTrinityDays).toBeGreaterThan(150);
    const lentRate = lentConfession / lentDays;
    const afterTrinityRate = afterTrinityConfession / afterTrinityDays;
    expect(lentRate).toBeGreaterThan(afterTrinityRate);
  });

  it('produces stable results for the same date across separate cold starts', () => {
    _resetScheduler();
    const a = selectPrayerOfTheDay({ year: 2026, month: 4, day: 12 });
    _resetScheduler();
    const b = selectPrayerOfTheDay({ year: 2026, month: 4, day: 12 });
    expect(a.id).toBe(b.id);
  });

  it('throws on dates before the anchor (2025-01-01)', () => {
    _resetScheduler();
    expect(() => selectPrayerOfTheDay({ year: 2024, month: 12, day: 31 })).toThrow(
      /precedes the supported range/,
    );
  });
});
