/**
 * Liturgical season slug. Drives prayer-of-the-day selection and category
 * eligibility. Seasons are mutually exclusive — every date falls in exactly one.
 *
 * Season anchoring is Ethiopian-calendar primary:
 * - `christmas` = Genna (Jan 7) through Timket eve (Jan 18)
 * - `epiphany` = Timket (Jan 19), one day
 * - `new_year` = Enkutatash (≈ Sep 11), one day
 * - `lent` / `easter` / `ascension` / `whitsuntide` = derived from Bahire Hasab
 * - `after_trinity` = the long ordinary stretch from Trinity Sunday until Advent
 */
export type SeasonKey =
  | 'advent'
  | 'christmas'
  | 'new_year'
  | 'after_new_year'
  | 'epiphany'
  | 'after_epiphany'
  | 'lent'
  | 'easter'
  | 'after_easter'
  | 'ascension'
  | 'whitsuntide'
  | 'trinity'
  | 'after_trinity';

/**
 * Day of the week. `0` is Sunday, matching the JavaScript `Date.getUTCDay()` convention.
 */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Calendar context for a single day, returned by {@link getDayContext}.
 * Drives the prayer-of-the-day scheduler and is also useful for consumer UIs
 * that want to label the day liturgically.
 */
export interface DayContext {
  /** ISO date string in `YYYY-MM-DD` format (UTC). */
  date: string;
  /** Liturgical season this date belongs to. */
  seasonKey: SeasonKey;
  /** Day of the week (0 = Sunday). */
  weekday: Weekday;
  /** Convenience flag: `weekday === 0`. */
  isSunday: boolean;
  /** True for the nine days enumerated in {@link PrincipalFeastKey}. */
  isPrincipalFeast: boolean;
  /** Identifies which principal feast this date is, when one applies. */
  principalFeastKey?: PrincipalFeastKey;
}

/**
 * The nine principal feasts the scheduler treats as priority days.
 * Five are computed via Bahire Hasab; four are fixed Ethiopian feasts.
 */
export type PrincipalFeastKey =
  | 'enkutatash'
  | 'meskel'
  | 'genna'
  | 'timket'
  | 'hosanna'
  | 'fasika'
  | 'erget'
  | 'paraclete'
  | 'trinity_sunday';

/** UTC year-month-day triple. Used internally; not part of the public API. */
export interface YMD {
  year: number;
  month: number;
  day: number;
}
