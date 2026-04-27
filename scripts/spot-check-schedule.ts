/**
 * One-shot spot-check of the prayer-of-the-day scheduler.
 * Prints picks for ~15 critical 2026 dates so a human can sanity-check
 * the strategy doc's expected behavior. Not part of the test suite.
 *
 *   pnpm tsx scripts/spot-check-schedule.ts
 */

import { getDayContext, getPrayerOfTheDay } from '../src/index.js';

const CRITICAL_DATES = [
  '2026-01-07', // Genna (Christmas) — Wednesday + principal feast
  '2026-01-19', // Timket (Epiphany) — Monday + principal feast
  '2026-02-16', // Lent starts (abiyTsome) — Monday
  '2026-02-18', // Wed in Lent (confession boost)
  '2026-02-25', // Wed in Lent
  '2026-03-04', // Wed in Lent
  '2026-03-11', // Wed in Lent
  '2026-03-18', // Wed in Lent
  '2026-03-25', // Wed in Lent
  '2026-04-01', // Wed in Lent
  '2026-04-08', // Wed in Lent (last)
  '2026-04-05', // Hosanna (Palm Sunday)
  '2026-04-12', // Fasika (Easter)
  '2026-05-21', // Erget (Ascension) — Thursday
  '2026-05-31', // Paraclete (Pentecost)
  '2026-06-07', // Trinity Sunday
  '2026-09-11', // Enkutatash (next EC year)
  '2026-09-27', // Meskel (next EC year)
];

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function ellipsize(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

const rows: string[] = [];
rows.push(
  ['date', 'wd', 'season', 'feast', 'id', 'category', 'title (en)']
    .map((h, i) => h.padEnd([10, 4, 16, 12, 6, 22, 60][i] ?? 10))
    .join(' '),
);
rows.push('-'.repeat(132));

for (const iso of CRITICAL_DATES) {
  const date = new Date(`${iso}T00:00:00Z`);
  const ctx = getDayContext(date);
  const prayer = getPrayerOfTheDay({ date });
  rows.push(
    [
      iso.padEnd(10),
      WEEKDAY_NAMES[ctx.weekday]!.padEnd(4),
      ctx.seasonKey.padEnd(16),
      (ctx.principalFeastKey ?? '').padEnd(12),
      prayer.id.padEnd(6),
      prayer.categoryId.padEnd(22),
      ellipsize(prayer.title, 60),
    ].join(' '),
  );
}

console.log(rows.join('\n'));
