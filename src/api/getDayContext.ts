import { dayContextFor } from '../calendar/context.js';
import type { DayContext } from '../calendar/types.js';

export function getDayContext(date?: Date): DayContext {
  return dayContextFor(date ?? new Date());
}
