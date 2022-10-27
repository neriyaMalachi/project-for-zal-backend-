type EnumDictionary<T extends string | symbol | number, U> = {
  [K in T]: U;
};

export enum Role {
    AVTASH = 'אבטש',
    CLEAN = 'ניקיון',
    NIGHT = 'לילה',
    HANFZA = 'הנפצה'
  } 

export enum Rank{
  NOTHING = 'שומר שחר',
  YOUNG = 'שומר צעיר',
  MID = 'שומר מנוסה',
  LARGE = 'שומר נטחן עובר',
  HUGE = 'רז משולם'
}

export const taskDictionary: EnumDictionary<Role, number> = {
  [Role.AVTASH]: 25,
  [Role.CLEAN]: 2,
  [Role.HANFZA]: 5,
  [Role.NIGHT]: 10
};