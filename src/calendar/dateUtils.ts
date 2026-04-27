import type { Weekday, YMD } from './types.js';

export function toIsoDate(ymd: YMD): string {
  const yyyy = String(ymd.year).padStart(4, '0');
  const mm = String(ymd.month).padStart(2, '0');
  const dd = String(ymd.day).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function fromJsDate(date: Date): YMD {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

export function fromIsoDate(iso: string): YMD {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) throw new Error(`lutheran-prayers: invalid ISO date "${iso}"`);
  return {
    year: Number(m[1]),
    month: Number(m[2]),
    day: Number(m[3]),
  };
}

export function ymdToUtcMillis(ymd: YMD): number {
  return Date.UTC(ymd.year, ymd.month - 1, ymd.day);
}

export function ymdFromUtcMillis(ms: number): YMD {
  const d = new Date(ms);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
}

export function addDays(ymd: YMD, n: number): YMD {
  return ymdFromUtcMillis(ymdToUtcMillis(ymd) + n * 86_400_000);
}

export function daysBetween(a: YMD, b: YMD): number {
  return Math.round((ymdToUtcMillis(b) - ymdToUtcMillis(a)) / 86_400_000);
}

export function compareYmd(a: YMD, b: YMD): number {
  return ymdToUtcMillis(a) - ymdToUtcMillis(b);
}

export function weekdayOf(ymd: YMD): Weekday {
  return new Date(ymdToUtcMillis(ymd)).getUTCDay() as Weekday;
}
