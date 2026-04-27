import type { BundledPrayer } from '../data/types.js';

const MS_PER_DAY = 86_400_000;

/**
 * Placeholder strategy. The real strategy will be supplied by the project
 * owner. Until then, picks deterministically by UTC day-of-epoch modulo the
 * corpus size — same input always returns the same prayer, immune to DST and
 * timezone shifts.
 */
// TODO(owner): replace with real strategy when liturgical-calendar logic is provided.
export function selectPrayerOfTheDay(date: Date, prayers: readonly BundledPrayer[]): BundledPrayer {
  if (prayers.length === 0) {
    throw new Error('lutheran-prayers: cannot pick prayer of the day from empty corpus');
  }
  const dayIndex = Math.floor(date.getTime() / MS_PER_DAY);
  const offset = ((dayIndex % prayers.length) + prayers.length) % prayers.length;
  const prayer = prayers[offset];
  if (!prayer) {
    throw new Error('lutheran-prayers: unreachable — modulo math invariant violated');
  }
  return prayer;
}
