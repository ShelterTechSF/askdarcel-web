import { ScheduleDay } from '../../app/models';

export class ServicePageTestHelpers {
  SERVICE_TITLE = '.listing--main header h1'
  SECTION_ABOUT = 'section.listing--main--left--about'
  SECTION_DETAILS = 'section.listing--main--left--details'
  SECTION_CONTACT = 'section.listing--main--left--contact'
  SECTION_HOURS = 'section.listing--main--left--hours'
  SECTION_HOURS_ROWS = 'section.listing--main--left--hours tr.opening-times-row'
  SECTION_ASIDE = 'section.listing--aside'

  BUTTON_PRINT = '.action-sidebar--print'
  BUTTON_DIRECTIONS = '.action-sidebar--directions'

  url = (serviceId: number) => `/services/${serviceId}`

  removeScheduleDays = (schedulDays: ScheduleDay[]) => Promise.all(schedulDays.map(sd => cy.request('POST', `/api/schedule_days/${sd.id}/change_requests`, { closes_at: null, opens_at: null })))
}
