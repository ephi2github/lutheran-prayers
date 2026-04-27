export type SeasonKey =
  | 'advent'
  | 'christmas'
  | 'new_year'
  | 'after_new_year'
  | 'epiphany'
  | 'after_epiphany'
  | 'lent'
  | 'easter'
  | 'after_easter'
  | 'ascension'
  | 'whitsuntide'
  | 'trinity'
  | 'after_trinity';

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DayContext {
  date: string;
  seasonKey: SeasonKey;
  weekday: Weekday;
  isSunday: boolean;
  isPrincipalFeast: boolean;
  principalFeastKey?: PrincipalFeastKey;
}

export type PrincipalFeastKey =
  | 'enkutatash'
  | 'meskel'
  | 'genna'
  | 'timket'
  | 'hosanna'
  | 'fasika'
  | 'erget'
  | 'paraclete'
  | 'trinity_sunday';

export interface YMD {
  year: number;
  month: number;
  day: number;
}
