export interface Schedule {
  id: number;
  hours_known: boolean;
  schedule_days: ScheduleDay[];
}

export interface ScheduleDay {
  id: number;
  day: string;
  opens_at: number | null;
  closes_at: number | null;
}

export interface ScheduleParams extends Omit<Partial<Schedule>, 'schedule_days'> {
  schedule_days: Partial<ScheduleDay>[];
}
