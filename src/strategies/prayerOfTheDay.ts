import type { Prayer } from '../types.js';

/**
 * Placeholder strategy. The real strategy will be supplied by the project
 * owner. Until then, this module reserves the surface so consumers can wire up
 * `getPrayerOfTheDay` from day one.
 */
export function selectPrayerOfTheDay(_date: Date, _candidates: Prayer[]): Prayer {
  throw new Error('NOT_IMPLEMENTED');
}
