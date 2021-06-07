import { NoteModel } from './Organization';

export interface ServiceModel {
  alternate_name: string
  application_process: string
  // categories  :  [{…}]
  // certified  :  false
  // certified_at  :  null
  // eligibilities  :  []
  eligibility: string
  email: string
  // featured  :  null
  fee: string
  id: number
  // interpretation_services  :  null
  long_description: string
  name: string
  notes: NoteModel[]
  recurringSchedule: RecurringScheduleModel
  required_documents: string
  // schedule  :  {hours_known: true, id: 3, schedule_days: Array(7)}
  // source_attribution  :  "ask_darcel"
  updated_at: string
  url: string
  // verified_at  :  null
  // wait_time  :  null
}

export interface RecurringScheduleModel {
  hoursKnown: boolean
  intervals: {}[] //  {hoursKnown: true, intervals: Array(7)}
}
