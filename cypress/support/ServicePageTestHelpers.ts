import { ChangeRequestParams, ScheduleDay } from '../../app/models';

export class ServicePageTestHelpers {
  SERVICE_TITLE = '[data-cy="service-page-title"]';
  SECTION_ABOUT = '[data-cy="service-about-section"]';
  SECTION_DETAILS = '[data-cy="service-details-section"]';
  SECTION_CONTACT = '[data-cy="service-contact-section"]';
  SECTION_HOURS = '[data-cy="service-loc-hours-section"]';
  SECTION_HOURS_ROWS = '[data-cy="opening-times-row"]';

  BUTTON_PRINT = '.action-sidebar--print';
  BUTTON_DIRECTIONS = '.action-sidebar--directions';

  url = (serviceId: number) => `/services/${serviceId}?visitDeactivated=true`;

  scheduleDayChangeRequestBody = (
    schedule_id: number,
    schedule_day: Partial<ScheduleDay>
  ): ChangeRequestParams => ({
    type: 'schedule_days',
    schedule_id,
    change_request: schedule_day,
  });
}
