
export interface TimetableEntryDto {
  scheduled: Date;
  realtime: Date | null;
  delay: number;
  canceled: boolean;
  line: string;
  direction: string;
  transportMode: string;
  platform: string;
}

export interface StationDto {
  groupId: string | null;
  groupName: string | null;
  id: string,
  name: string | null;
  lat: number;
  lon: number;
  transportModes: string[];
}