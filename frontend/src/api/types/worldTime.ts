export interface WorldTimeDto {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  seconds: number;
  milliSeconds: number;
  dateTime: string | null;
  date: string | null;
  time: string | null;
  timeZone: string | null;
  dayOfWeek: string | null;
}

export interface TimezoneDto {
  timeZone: string | null;
}
