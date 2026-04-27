import { dayContextFor } from '../calendar/context.js';
import type { DayContext } from '../calendar/types.js';

/**
 * Returns calendar metadata for a date: liturgical season, weekday, and
 * principal-feast flag. Useful for UIs that want to label "today" liturgically
 * (e.g. "Today is Trinity Sunday").
 *
 * Computation uses `kenat`'s Bahire Hasab + Ethiopian fixed feasts. Results
 * are memoized per ISO date.
 *
 * @param date - The date to describe, interpreted in UTC. Defaults to now.
 * @returns A frozen {@link DayContext}.
 *
 * @example
 * ```ts
 * const today = getDayContext();
 * if (today.isPrincipalFeast) console.log(`Today is ${today.principalFeastKey}`);
 *
 * const easter2026 = getDayContext(new Date('2026-04-12'));
 * // → { date: '2026-04-12', seasonKey: 'easter', weekday: 0,
 * //     isSunday: true, isPrincipalFeast: true, principalFeastKey: 'fasika' }
 * ```
 */
export function getDayContext(date?: Date): DayContext {
  return dayContextFor(date ?? new Date());
}
