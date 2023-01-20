import { ScheduleDay } from "./Schedule";

export interface ChangeRequest {
  id: number;
  field_changes: { field_name: string; field_value: string }[];
  object_id: number;
  status: "pending" | "approved" | "rejected";
  type: string;
}

export type ChangeRequestParams = ScheduleDayChangeRequestParams;

interface ScheduleDayChangeRequestParams {
  schedule_id: number;
  type: "schedule_days";
  change_request: Partial<ScheduleDay>;
}
