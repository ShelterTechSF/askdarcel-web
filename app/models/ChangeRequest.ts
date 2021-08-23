import { ScheduleDay } from './Schedule';

export type ChangeRequest = Record<string, any>
export type ChangeRequestParams = ScheduleDayChangeRequestParams

interface ScheduleDayChangeRequestParams {
  schedule_id: number
  type: 'schedule_days'
  change_request: Partial<ScheduleDay>
}
