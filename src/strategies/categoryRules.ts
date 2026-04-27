import type { DayContext, SeasonKey, Weekday } from '../calendar/types.js';

export const EXCLUDED_CATEGORIES: ReadonlySet<string> = new Set([
  'deathbed',
  'sick',
  'baptism',
  'church_attendance',
  'preparatory',
  'motherhood',
  'table',
]);

const ALL_SEASONS: SeasonKey[] = [
  'advent',
  'christmas',
  'new_year',
  'after_new_year',
  'epiphany',
  'after_epiphany',
  'lent',
  'easter',
  'after_easter',
  'ascension',
  'whitsuntide',
  'trinity',
  'after_trinity',
];

const FEAST_SEASONS: SeasonKey[] = [
  'advent',
  'christmas',
  'new_year',
  'after_new_year',
  'epiphany',
  'after_epiphany',
  'lent',
  'easter',
  'after_easter',
  'ascension',
  'whitsuntide',
  'trinity',
];

const ALLOWED_SEASONS_BY_CATEGORY: Record<string, ReadonlyArray<SeasonKey>> = {
  advent: ['advent'],
  christmas: ['christmas'],
  new_year: ['new_year'],
  after_new_year: ['after_new_year'],
  epiphany: ['epiphany'],
  after_epiphany: ['after_epiphany'],
  lent: ['lent'],
  after_trinity: ['after_trinity'],
  easter: ['easter', 'after_easter', 'ascension', 'whitsuntide'],
  after_easter: ['easter', 'after_easter', 'ascension', 'whitsuntide'],
  ascension: ['ascension', 'whitsuntide'],
  whitsuntide: ['whitsuntide', 'trinity'],
  trinity: ['trinity'],
  festival_days_general: FEAST_SEASONS,
  general: ALL_SEASONS,
  daily: ALL_SEASONS,
  confession: ALL_SEASONS,
  thanksgiving: ALL_SEASONS,
  intercession: ALL_SEASONS,
  children: ALL_SEASONS,
  meditation_prayer_fragment: ALL_SEASONS,
};

export type SeasonFamily = 'nativity' | 'paschal' | 'ordinary';

const SEASON_FAMILY: Record<SeasonKey, SeasonFamily> = {
  advent: 'nativity',
  christmas: 'nativity',
  new_year: 'nativity',
  after_new_year: 'nativity',
  epiphany: 'nativity',
  after_epiphany: 'nativity',
  lent: 'paschal',
  easter: 'paschal',
  after_easter: 'paschal',
  ascension: 'paschal',
  whitsuntide: 'paschal',
  trinity: 'paschal',
  after_trinity: 'ordinary',
};

export function isAllowedInSeason(categoryId: string, seasonKey: SeasonKey): boolean {
  const allowed = ALLOWED_SEASONS_BY_CATEGORY[categoryId];
  return Array.isArray(allowed) && allowed.includes(seasonKey);
}

export function familyOf(seasonOrCategory: string): SeasonFamily | undefined {
  if (seasonOrCategory in SEASON_FAMILY) {
    return SEASON_FAMILY[seasonOrCategory as SeasonKey];
  }
  return undefined;
}

type Slot =
  | { kind: 'category'; id: string }
  | { kind: 'exact_season' }
  | { kind: 'family_fallback' };

const SUNDAY: Slot[] = [
  { kind: 'exact_season' },
  { kind: 'family_fallback' },
  { kind: 'category', id: 'festival_days_general' },
  { kind: 'category', id: 'general' },
  { kind: 'category', id: 'thanksgiving' },
  { kind: 'category', id: 'daily' },
  { kind: 'category', id: 'intercession' },
  { kind: 'category', id: 'confession' },
  { kind: 'category', id: 'meditation_prayer_fragment' },
];

const MONDAY: Slot[] = [
  { kind: 'category', id: 'daily' },
  { kind: 'exact_season' },
  { kind: 'family_fallback' },
  { kind: 'category', id: 'general' },
  { kind: 'category', id: 'intercession' },
  { kind: 'category', id: 'thanksgiving' },
  { kind: 'category', id: 'confession' },
  { kind: 'category', id: 'children' },
  { kind: 'category', id: 'meditation_prayer_fragment' },
];

const MONDAY_FEAST: Slot[] = [
  { kind: 'exact_season' },
  { kind: 'family_fallback' },
  { kind: 'category', id: 'daily' },
  { kind: 'category', id: 'general' },
  { kind: 'category', id: 'intercession' },
  { kind: 'category', id: 'thanksgiving' },
  { kind: 'category', id: 'confession' },
  { kind: 'category', id: 'children' },
  { kind: 'category', id: 'meditation_prayer_fragment' },
];

const TUESDAY: Slot[] = [
  { kind: 'category', id: 'general' },
  { kind: 'exact_season' },
  { kind: 'family_fallback' },
  { kind: 'category', id: 'intercession' },
  { kind: 'category', id: 'daily' },
  { kind: 'category', id: 'thanksgiving' },
  { kind: 'category', id: 'confession' },
  { kind: 'category', id: 'children' },
  { kind: 'category', id: 'meditation_prayer_fragment' },
];

const TUESDAY_FEAST: Slot[] = [
  { kind: 'exact_season' },
  { kind: 'family_fallback' },
  { kind: 'category', id: 'general' },
  { kind: 'category', id: 'intercession' },
  { kind: 'category', id: 'daily' },
  { kind: 'category', id: 'thanksgiving' },
  { kind: 'category', id: 'confession' },
  { kind: 'category', id: 'children' },
  { kind: 'category', id: 'meditation_prayer_fragment' },
];

const WEDNESDAY_BASE: Slot[] = [
  { kind: 'category', id: 'confession' },
  { kind: 'exact_season' },
  { kind: 'family_fallback' },
  { kind: 'category', id: 'general' },
  { kind: 'category', id: 'daily' },
  { kind: 'category', id: 'thanksgiving' },
  { kind: 'category', id: 'intercession' },
  { kind: 'category', id: 'children' },
  { kind: 'category', id: 'meditation_prayer_fragment' },
];

const WEDNESDAY_FEAST: Slot[] = [
  { kind: 'exact_season' },
  { kind: 'family_fallback' },
  { kind: 'category', id: 'confession' },
  { kind: 'category', id: 'general' },
  { kind: 'category', id: 'daily' },
  { kind: 'category', id: 'thanksgiving' },
  { kind: 'category', id: 'intercession' },
  { kind: 'category', id: 'children' },
  { kind: 'category', id: 'meditation_prayer_fragment' },
];

const THURSDAY: Slot[] = [
  { kind: 'category', id: 'thanksgiving' },
  { kind: 'exact_season' },
  { kind: 'family_fallback' },
  { kind: 'category', id: 'general' },
  { kind: 'category', id: 'daily' },
  { kind: 'category', id: 'intercession' },
  { kind: 'category', id: 'confession' },
  { kind: 'category', id: 'children' },
  { kind: 'category', id: 'meditation_prayer_fragment' },
];

const THURSDAY_FEAST: Slot[] = [
  { kind: 'exact_season' },
  { kind: 'family_fallback' },
  { kind: 'category', id: 'thanksgiving' },
  { kind: 'category', id: 'general' },
  { kind: 'category', id: 'daily' },
  { kind: 'category', id: 'intercession' },
  { kind: 'category', id: 'confession' },
  { kind: 'category', id: 'children' },
  { kind: 'category', id: 'meditation_prayer_fragment' },
];

const FRIDAY: Slot[] = [
  { kind: 'exact_season' },
  { kind: 'family_fallback' },
  { kind: 'category', id: 'confession' },
  { kind: 'category', id: 'general' },
  { kind: 'category', id: 'daily' },
  { kind: 'category', id: 'thanksgiving' },
  { kind: 'category', id: 'intercession' },
  { kind: 'category', id: 'children' },
  { kind: 'category', id: 'meditation_prayer_fragment' },
];

const SATURDAY: Slot[] = [
  { kind: 'category', id: 'general' },
  { kind: 'category', id: 'intercession' },
  { kind: 'exact_season' },
  { kind: 'family_fallback' },
  { kind: 'category', id: 'daily' },
  { kind: 'category', id: 'thanksgiving' },
  { kind: 'category', id: 'confession' },
  { kind: 'category', id: 'children' },
  { kind: 'category', id: 'meditation_prayer_fragment' },
];

const SATURDAY_FEAST: Slot[] = [
  { kind: 'exact_season' },
  { kind: 'family_fallback' },
  { kind: 'category', id: 'general' },
  { kind: 'category', id: 'intercession' },
  { kind: 'category', id: 'daily' },
  { kind: 'category', id: 'thanksgiving' },
  { kind: 'category', id: 'confession' },
  { kind: 'category', id: 'children' },
  { kind: 'category', id: 'meditation_prayer_fragment' },
];

function pickSlots(weekday: Weekday, ctx: DayContext): Slot[] {
  // Sunday and Friday already lead with exact_season; the principal-feast rule
  // is satisfied by their default lists.
  if (weekday === 0) return SUNDAY;
  if (weekday === 5) return FRIDAY;

  if (weekday === 1) return ctx.isPrincipalFeast ? MONDAY_FEAST : MONDAY;
  if (weekday === 2) return ctx.isPrincipalFeast ? TUESDAY_FEAST : TUESDAY;
  if (weekday === 3) {
    // Advent/Lent: confession leads even on principal feasts.
    if (ctx.seasonKey === 'advent' || ctx.seasonKey === 'lent') return WEDNESDAY_BASE;
    return ctx.isPrincipalFeast ? WEDNESDAY_FEAST : WEDNESDAY_BASE;
  }
  if (weekday === 4) return ctx.isPrincipalFeast ? THURSDAY_FEAST : THURSDAY;
  return ctx.isPrincipalFeast ? SATURDAY_FEAST : SATURDAY;
}

function slotMatches(slot: Slot, categoryId: string, ctx: DayContext): boolean {
  if (slot.kind === 'category') return slot.id === categoryId;
  if (slot.kind === 'exact_season') return categoryId === ctx.seasonKey;
  const catFamily = familyOf(categoryId);
  const seasonFamily = familyOf(ctx.seasonKey);
  return (
    catFamily !== undefined &&
    seasonFamily !== undefined &&
    catFamily === seasonFamily &&
    categoryId !== ctx.seasonKey
  );
}

const UNRANKED = Number.POSITIVE_INFINITY;

export function priorityOf(categoryId: string, ctx: DayContext): number {
  const slots = pickSlots(ctx.weekday, ctx);
  for (let i = 0; i < slots.length; i++) {
    if (slotMatches(slots[i]!, categoryId, ctx)) return i + 1;
  }
  return UNRANKED;
}

export function isChildrenBlocked(categoryId: string, ctx: DayContext): boolean {
  return categoryId === 'children' && (ctx.isSunday || ctx.isPrincipalFeast);
}
