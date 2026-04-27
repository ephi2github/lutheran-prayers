import { fromJsDate, toIsoDate, weekdayOf } from './dateUtils.js';
import { getPrincipalFeast, getSeasonKey } from './seasons.js';
import type { DayContext, YMD } from './types.js';

const CONTEXT_CACHE = new Map<string, DayContext>();

export function dayContextFor(input: Date | YMD): DayContext {
  const ymd = isYmd(input) ? input : fromJsDate(input);
  const iso = toIsoDate(ymd);
  const cached = CONTEXT_CACHE.get(iso);
  if (cached) return cached;

  const weekday = weekdayOf(ymd);
  const seasonKey = getSeasonKey(ymd);
  const feastKey = getPrincipalFeast(ymd);

  const ctx: DayContext = {
    date: iso,
    seasonKey,
    weekday,
    isSunday: weekday === 0,
    isPrincipalFeast: feastKey !== null,
    ...(feastKey ? { principalFeastKey: feastKey } : {}),
  };
  Object.freeze(ctx);
  CONTEXT_CACHE.set(iso, ctx);
  return ctx;
}

function isYmd(value: Date | YMD): value is YMD {
  return typeof (value as YMD).year === 'number';
}
