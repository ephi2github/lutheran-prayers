import { getBahireHasab, toEC, toGC } from 'kenat';
import {
  addDays,
  compareYmd,
  fromIsoDate,
  toIsoDate,
  weekdayOf,
} from './dateUtils.js';
import type { PrincipalFeastKey, SeasonKey, YMD } from './types.js';

interface SeasonAnchors {
  ethYear: number;
  enkutatash: YMD;
  meskel: YMD;
  genna: YMD;
  timket: YMD;
  abiyTsome: YMD;
  hosanna: YMD;
  fasika: YMD;
  erget: YMD;
  paraclete: YMD;
  trinitySunday: YMD;
  adventStart: YMD;
}

const ANCHORS_BY_ETH_YEAR = new Map<number, SeasonAnchors>();

function ymdFromKenat(obj: { year: number; month: number; day: number }): YMD {
  return { year: obj.year, month: obj.month, day: obj.day };
}

function bahireFeastGregorian(
  bh: ReturnType<typeof getBahireHasab>,
  key: string,
): YMD {
  const feast = bh.movableFeasts?.[key];
  if (!feast?.gregorian) {
    throw new Error(`lutheran-prayers: kenat did not return Gregorian date for ${key}`);
  }
  return ymdFromKenat(feast.gregorian);
}

export function getAnchors(ethYear: number): SeasonAnchors {
  const cached = ANCHORS_BY_ETH_YEAR.get(ethYear);
  if (cached) return cached;

  const enkutatash = ymdFromKenat(toGC(ethYear, 1, 1));
  const meskel = ymdFromKenat(toGC(ethYear, 1, 17));
  const genna = ymdFromKenat(toGC(ethYear, 4, 29));
  const timket = ymdFromKenat(toGC(ethYear, 5, 11));

  const bh = getBahireHasab(ethYear);
  const abiyTsome = bahireFeastGregorian(bh, 'abiyTsome');
  const hosanna = bahireFeastGregorian(bh, 'hosanna');
  const fasika = bahireFeastGregorian(bh, 'fasika');
  const erget = bahireFeastGregorian(bh, 'erget');
  const paraclete = bahireFeastGregorian(bh, 'paraclete');
  const trinitySunday = addDays(paraclete, 7);

  const adventStart = computeAdventStart(genna);

  const anchors: SeasonAnchors = {
    ethYear,
    enkutatash,
    meskel,
    genna,
    timket,
    abiyTsome,
    hosanna,
    fasika,
    erget,
    paraclete,
    trinitySunday,
    adventStart,
  };
  ANCHORS_BY_ETH_YEAR.set(ethYear, anchors);
  return anchors;
}

function computeAdventStart(genna: YMD): YMD {
  const gennaWeekday = weekdayOf(genna);
  const daysBackToFourthSunday = gennaWeekday === 0 ? 7 : gennaWeekday;
  const fourthSunday = addDays(genna, -daysBackToFourthSunday);
  return addDays(fourthSunday, -21);
}

export function getSeasonKey(date: YMD): SeasonKey {
  const ec = toEC(date.year, date.month, date.day);
  const anchors = getAnchors(ec.year);

  if (compareYmd(date, anchors.enkutatash) === 0) return 'new_year';
  const enkPlus6 = addDays(anchors.enkutatash, 6);
  if (compareYmd(date, anchors.enkutatash) > 0 && compareYmd(date, enkPlus6) <= 0) {
    return 'after_new_year';
  }

  if (
    compareYmd(date, anchors.adventStart) >= 0 &&
    compareYmd(date, anchors.genna) < 0
  ) {
    return 'advent';
  }

  if (compareYmd(date, anchors.genna) >= 0 && compareYmd(date, anchors.timket) < 0) {
    return 'christmas';
  }

  if (compareYmd(date, anchors.timket) === 0) return 'epiphany';

  if (
    compareYmd(date, anchors.timket) > 0 &&
    compareYmd(date, anchors.abiyTsome) < 0
  ) {
    return 'after_epiphany';
  }

  if (
    compareYmd(date, anchors.abiyTsome) >= 0 &&
    compareYmd(date, anchors.fasika) < 0
  ) {
    return 'lent';
  }

  const easterOctaveEnd = addDays(anchors.fasika, 6);
  if (compareYmd(date, anchors.fasika) >= 0 && compareYmd(date, easterOctaveEnd) <= 0) {
    return 'easter';
  }

  if (compareYmd(date, easterOctaveEnd) > 0 && compareYmd(date, anchors.erget) < 0) {
    return 'after_easter';
  }

  if (compareYmd(date, anchors.erget) === 0) return 'ascension';

  if (
    compareYmd(date, anchors.erget) > 0 &&
    compareYmd(date, anchors.paraclete) < 0
  ) {
    return 'after_easter';
  }

  const whitsuntideEnd = addDays(anchors.paraclete, 6);
  if (
    compareYmd(date, anchors.paraclete) >= 0 &&
    compareYmd(date, whitsuntideEnd) <= 0
  ) {
    return 'whitsuntide';
  }

  if (compareYmd(date, anchors.trinitySunday) === 0) return 'trinity';

  return 'after_trinity';
}

const PRINCIPAL_FEAST_DEFS: Array<{
  key: PrincipalFeastKey;
  pick: (a: SeasonAnchors) => YMD;
}> = [
  { key: 'enkutatash', pick: (a) => a.enkutatash },
  { key: 'meskel', pick: (a) => a.meskel },
  { key: 'genna', pick: (a) => a.genna },
  { key: 'timket', pick: (a) => a.timket },
  { key: 'hosanna', pick: (a) => a.hosanna },
  { key: 'fasika', pick: (a) => a.fasika },
  { key: 'erget', pick: (a) => a.erget },
  { key: 'paraclete', pick: (a) => a.paraclete },
  { key: 'trinity_sunday', pick: (a) => a.trinitySunday },
];

export function getPrincipalFeast(date: YMD): PrincipalFeastKey | null {
  const ec = toEC(date.year, date.month, date.day);
  for (const { key, pick } of PRINCIPAL_FEAST_DEFS) {
    if (compareYmd(date, pick(getAnchors(ec.year))) === 0) return key;
  }
  const prevYearAnchors = getAnchors(ec.year - 1);
  for (const { key, pick } of PRINCIPAL_FEAST_DEFS) {
    if (compareYmd(date, pick(prevYearAnchors)) === 0) return key;
  }
  return null;
}

export function describeAnchorsForIso(iso: string): SeasonAnchors {
  const date = fromIsoDate(iso);
  const ec = toEC(date.year, date.month, date.day);
  return getAnchors(ec.year);
}

export function _seasonAnchorsCacheSize(): number {
  return ANCHORS_BY_ETH_YEAR.size;
}

export function _isoOf(date: YMD): string {
  return toIsoDate(date);
}
