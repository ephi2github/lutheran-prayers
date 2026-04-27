import { describe, expect, it } from 'vitest';
import { getSeasonKey } from '../../src/calendar/seasons.js';
import type { SeasonKey, YMD } from '../../src/calendar/types.js';

function ymd(year: number, month: number, day: number): YMD {
  return { year, month, day };
}

const cases: Array<[string, YMD, SeasonKey]> = [
  ['Sept 11 2025 = Enkutatash 2018', ymd(2025, 9, 11), 'new_year'],
  ['Sept 13 2025 = after_new_year', ymd(2025, 9, 13), 'after_new_year'],
  ['Sept 17 2025 = after_new_year (last day)', ymd(2025, 9, 17), 'after_new_year'],
  ['Sept 18 2025 = after_trinity (carve-out ended)', ymd(2025, 9, 18), 'after_trinity'],
  ['Dec 13 2025 = after_trinity (day before Advent)', ymd(2025, 12, 13), 'after_trinity'],
  ['Dec 14 2025 = first Sunday of Advent', ymd(2025, 12, 14), 'advent'],
  ['Jan 6 2026 = Advent (Genna eve)', ymd(2026, 1, 6), 'advent'],
  ['Jan 7 2026 = Christmas (Genna)', ymd(2026, 1, 7), 'christmas'],
  ['Jan 18 2026 = Christmas (Timket eve)', ymd(2026, 1, 18), 'christmas'],
  ['Jan 19 2026 = Epiphany (Timket)', ymd(2026, 1, 19), 'epiphany'],
  ['Jan 20 2026 = After Epiphany', ymd(2026, 1, 20), 'after_epiphany'],
  ['Feb 15 2026 = After Epiphany (last day)', ymd(2026, 2, 15), 'after_epiphany'],
  ['Feb 16 2026 = Lent (abiyTsome)', ymd(2026, 2, 16), 'lent'],
  ['Apr 11 2026 = Lent (Holy Saturday)', ymd(2026, 4, 11), 'lent'],
  ['Apr 12 2026 = Easter (Fasika)', ymd(2026, 4, 12), 'easter'],
  ['Apr 18 2026 = Easter octave (last day)', ymd(2026, 4, 18), 'easter'],
  ['Apr 19 2026 = After Easter', ymd(2026, 4, 19), 'after_easter'],
  ['May 20 2026 = After Easter (Erget eve)', ymd(2026, 5, 20), 'after_easter'],
  ['May 21 2026 = Ascension (Erget)', ymd(2026, 5, 21), 'ascension'],
  ['May 22 2026 = After Easter resumes', ymd(2026, 5, 22), 'after_easter'],
  ['May 30 2026 = After Easter (Paraclete eve)', ymd(2026, 5, 30), 'after_easter'],
  ['May 31 2026 = Whitsuntide (Paraclete)', ymd(2026, 5, 31), 'whitsuntide'],
  ['Jun 6 2026 = Whitsuntide octave (last day)', ymd(2026, 6, 6), 'whitsuntide'],
  ['Jun 7 2026 = Trinity Sunday', ymd(2026, 6, 7), 'trinity'],
  ['Jun 8 2026 = After Trinity', ymd(2026, 6, 8), 'after_trinity'],
  ['Aug 15 2026 = After Trinity', ymd(2026, 8, 15), 'after_trinity'],
];

describe('getSeasonKey', () => {
  it.each(cases)('%s', (_label, date, expected) => {
    expect(getSeasonKey(date)).toBe(expected);
  });
});
