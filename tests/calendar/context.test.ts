import { describe, expect, it } from 'vitest';
import { dayContextFor } from '../../src/calendar/context.js';
import type { PrincipalFeastKey } from '../../src/calendar/types.js';

function utc(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

describe('dayContextFor', () => {
  it('produces ISO date and weekday correctly', () => {
    const ctx = dayContextFor(utc(2026, 4, 12));
    expect(ctx.date).toBe('2026-04-12');
    expect(ctx.weekday).toBe(0);
    expect(ctx.isSunday).toBe(true);
  });

  it.each<[string, ReturnType<typeof utc>, PrincipalFeastKey]>([
    ['Genna 2026', utc(2026, 1, 7), 'genna'],
    ['Timket 2026', utc(2026, 1, 19), 'timket'],
    ['Hosanna 2026', utc(2026, 4, 5), 'hosanna'],
    ['Fasika 2026', utc(2026, 4, 12), 'fasika'],
    ['Erget 2026', utc(2026, 5, 21), 'erget'],
    ['Paraclete 2026', utc(2026, 5, 31), 'paraclete'],
    ['Trinity Sunday 2026', utc(2026, 6, 7), 'trinity_sunday'],
    ['Enkutatash 2018 EC', utc(2025, 9, 11), 'enkutatash'],
    ['Meskel 2018 EC', utc(2025, 9, 27), 'meskel'],
  ])('%s is a principal feast (%s)', (_label, date, expectedKey) => {
    const ctx = dayContextFor(date);
    expect(ctx.isPrincipalFeast).toBe(true);
    expect(ctx.principalFeastKey).toBe(expectedKey);
  });

  it('a non-feast day is not flagged', () => {
    const ctx = dayContextFor(utc(2026, 8, 15));
    expect(ctx.isPrincipalFeast).toBe(false);
    expect(ctx.principalFeastKey).toBeUndefined();
  });

  it('memoizes — repeated calls return the same frozen object', () => {
    const a = dayContextFor(utc(2026, 4, 12));
    const b = dayContextFor(utc(2026, 4, 12));
    expect(a).toBe(b);
    expect(Object.isFrozen(a)).toBe(true);
  });
});
