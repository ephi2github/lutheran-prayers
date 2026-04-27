import { addDays, compareYmd, fromIsoDate, fromJsDate, toIsoDate } from '../calendar/dateUtils.js';
import { dayContextFor } from '../calendar/context.js';
import { getCorpus } from '../data/loader.js';
import type { BundledPrayer } from '../data/types.js';
import type { DayContext, YMD } from '../calendar/types.js';
import {
  EXCLUDED_CATEGORIES,
  isAllowedInSeason,
  isChildrenBlocked,
  priorityOf,
} from './categoryRules.js';

const ANCHOR: YMD = { year: 2025, month: 1, day: 1 };
const COOLDOWN_LADDER = [28, 14, 7, 1] as const;

interface SchedulerState {
  lastUsedDate: Map<string, string>;
  lastUsedDayIndex: Map<string, number>;
  timesUsedTotal: Map<string, number>;
  timesUsedInSeason: Map<string, number>;
  lastSelectedPrayerId: string | null;
}

function freshState(): SchedulerState {
  return {
    lastUsedDate: new Map(),
    lastUsedDayIndex: new Map(),
    timesUsedTotal: new Map(),
    timesUsedInSeason: new Map(),
    lastSelectedPrayerId: null,
  };
}

let SCHEDULE: Map<string, string> = new Map();
let STATE: SchedulerState = freshState();
let FRONTIER_DAY_INDEX = 0;
const ANCHOR_DAY_INDEX = dayIndexOf(ANCHOR);

function dayIndexOf(ymd: YMD): number {
  return Math.floor(Date.UTC(ymd.year, ymd.month - 1, ymd.day) / 86_400_000);
}

function seasonUseKey(prayerId: string, season: string): string {
  return `${prayerId}::${season}`;
}

const ELIGIBLE_PRAYERS: BundledPrayer[] = (() => {
  return getCorpus().prayers.filter((p) => !EXCLUDED_CATEGORIES.has(p.categoryId));
})();

function buildCandidates(ctx: DayContext): BundledPrayer[] {
  return ELIGIBLE_PRAYERS.filter(
    (p) =>
      isAllowedInSeason(p.categoryId, ctx.seasonKey) && !isChildrenBlocked(p.categoryId, ctx),
  );
}

interface RankedCandidate {
  prayer: BundledPrayer;
  priority: number;
  lastUsedIndex: number;
  seasonUseCount: number;
  totalUseCount: number;
}

function rank(candidates: BundledPrayer[], ctx: DayContext, state: SchedulerState): RankedCandidate[] {
  return candidates.map((prayer) => ({
    prayer,
    priority: priorityOf(prayer.categoryId, ctx),
    lastUsedIndex: state.lastUsedDayIndex.get(prayer.id) ?? Number.NEGATIVE_INFINITY,
    seasonUseCount: state.timesUsedInSeason.get(seasonUseKey(prayer.id, ctx.seasonKey)) ?? 0,
    totalUseCount: state.timesUsedTotal.get(prayer.id) ?? 0,
  }));
}

function pickBest(ranked: RankedCandidate[]): RankedCandidate {
  return ranked.reduce((best, candidate) => {
    if (candidate.priority !== best.priority) {
      return candidate.priority < best.priority ? candidate : best;
    }
    if (candidate.lastUsedIndex !== best.lastUsedIndex) {
      return candidate.lastUsedIndex < best.lastUsedIndex ? candidate : best;
    }
    if (candidate.seasonUseCount !== best.seasonUseCount) {
      return candidate.seasonUseCount < best.seasonUseCount ? candidate : best;
    }
    if (candidate.totalUseCount !== best.totalUseCount) {
      return candidate.totalUseCount < best.totalUseCount ? candidate : best;
    }
    return candidate.prayer.id < best.prayer.id ? candidate : best;
  });
}

function selectForDate(targetIndex: number, ctx: DayContext, state: SchedulerState): BundledPrayer {
  const allCandidates = buildCandidates(ctx);
  if (allCandidates.length === 0) {
    throw new Error(
      `lutheran-prayers: no candidate prayers for ${ctx.date} (season=${ctx.seasonKey})`,
    );
  }

  for (const cooldown of COOLDOWN_LADDER) {
    const survivors = allCandidates.filter((p) => {
      if (state.lastSelectedPrayerId === p.id) return false;
      const lastIndex = state.lastUsedDayIndex.get(p.id);
      if (lastIndex === undefined) return true;
      return targetIndex - lastIndex >= cooldown;
    });
    if (survivors.length === 0) continue;
    const ranked = rank(survivors, ctx, state);
    const filteredFinite = ranked.filter((r) => Number.isFinite(r.priority));
    const winner = pickBest(filteredFinite.length > 0 ? filteredFinite : ranked);
    return winner.prayer;
  }

  throw new Error(
    `lutheran-prayers: scheduler exhausted all cooldowns for ${ctx.date}; no candidate available`,
  );
}

function recordUsage(
  state: SchedulerState,
  prayer: BundledPrayer,
  date: string,
  dayIndex: number,
  seasonKey: string,
): void {
  state.lastUsedDate.set(prayer.id, date);
  state.lastUsedDayIndex.set(prayer.id, dayIndex);
  state.timesUsedTotal.set(prayer.id, (state.timesUsedTotal.get(prayer.id) ?? 0) + 1);
  const k = seasonUseKey(prayer.id, seasonKey);
  state.timesUsedInSeason.set(k, (state.timesUsedInSeason.get(k) ?? 0) + 1);
  state.lastSelectedPrayerId = prayer.id;
}

function ensureScheduledThrough(targetIndex: number): void {
  while (FRONTIER_DAY_INDEX <= targetIndex) {
    const offsetDays = FRONTIER_DAY_INDEX - ANCHOR_DAY_INDEX;
    const ymd = addDays(ANCHOR, offsetDays);
    const iso = toIsoDate(ymd);
    const ctx = dayContextFor(ymd);
    const winner = selectForDate(FRONTIER_DAY_INDEX, ctx, STATE);
    SCHEDULE.set(iso, winner.id);
    recordUsage(STATE, winner, iso, FRONTIER_DAY_INDEX, ctx.seasonKey);
    FRONTIER_DAY_INDEX += 1;
  }
}

export function selectPrayerOfTheDay(date: Date | YMD): BundledPrayer {
  const ymd: YMD = isYmd(date) ? date : fromJsDate(date);
  const idx = dayIndexOf(ymd);
  if (idx < ANCHOR_DAY_INDEX) {
    throw new Error(
      `lutheran-prayers: date ${toIsoDate(ymd)} precedes the supported range (anchor ${toIsoDate(ANCHOR)}). ` +
        `Use getPrayerById for arbitrary historical lookups.`,
    );
  }
  if (FRONTIER_DAY_INDEX === 0) FRONTIER_DAY_INDEX = ANCHOR_DAY_INDEX;
  ensureScheduledThrough(idx);
  const iso = toIsoDate(ymd);
  const prayerId = SCHEDULE.get(iso);
  if (!prayerId) {
    throw new Error(`lutheran-prayers: scheduler invariant violated, no entry for ${iso}`);
  }
  const prayer = getCorpus().prayers.find((p) => p.id === prayerId);
  if (!prayer) {
    throw new Error(`lutheran-prayers: scheduled prayer id ${prayerId} not in corpus`);
  }
  return prayer;
}

function isYmd(value: Date | YMD): value is YMD {
  return typeof (value as YMD).year === 'number';
}

export function _resetScheduler(): void {
  SCHEDULE = new Map();
  STATE = freshState();
  FRONTIER_DAY_INDEX = 0;
}

export function _scheduleSize(): number {
  return SCHEDULE.size;
}

export function _scheduleGet(iso: string): string | undefined {
  return SCHEDULE.get(iso);
}

export function _peekState(): Readonly<SchedulerState> {
  return STATE;
}

export const _ANCHOR_ISO = toIsoDate(ANCHOR);

export function _isoFromInput(date: Date | YMD): string {
  return toIsoDate(isYmd(date) ? date : fromJsDate(date));
}

export function _ymdFromIso(iso: string): YMD {
  return fromIsoDate(iso);
}

export function _eligiblePoolSize(): number {
  return ELIGIBLE_PRAYERS.length;
}

export function _compareYmdDebug(a: YMD, b: YMD): number {
  return compareYmd(a, b);
}
