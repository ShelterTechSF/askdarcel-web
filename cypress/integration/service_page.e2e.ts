/// <reference types="cypress" />
import { Service, ChangeRequestParams } from '../../app/models';
import { ServicePageTestHelpers } from '../support/ServicePageTestHelpers';

describe('Service Page', () => {
  const page = new ServicePageTestHelpers();
  const serviceId = 1;

  it('should render about, details, contact and hours sections', () => {
    cy.request(`/api/services/${serviceId}`).should((res: Cypress.Response<{ service: Service }>) => {
      expect(res.status).to.eq(200);
      expect(res.body.service).to.include.all.keys('id', 'name', 'long_description');
      const { service } = res.body;

      // Set service info to ensure the page is consistent
      const change_request: Partial<Service> = {
        id: serviceId,
        email: 'foo@mega.corp',
        application_process: 'Walk-ins welcome',
        required_documents: 'Photo ID',
      };

      cy.request('POST', `/api/services/${serviceId}/change_requests`, { change_request }).should(res => {
        expect(res.status).to.eq(201);
      });

      // Confirm the basic page details
      cy.visit(page.url(serviceId))
        .get(page.BUTTON_PRINT).should('exist')
        .get(page.BUTTON_DIRECTIONS).should('exist')

        .get(page.SERVICE_TITLE).first().should('contain.text', service.name)
        .get(page.SECTION_ABOUT).first().should('exist')
        .get(page.SECTION_DETAILS).first().should('contain.text', change_request.application_process)
        .get(page.SECTION_DETAILS).first().should('contain.text', change_request.required_documents)
        .get(page.SECTION_CONTACT).first().should('contain.text', change_request.email);

      const cr: ChangeRequestParams = {
        type: 'schedule_days',
        schedule_id: service.schedule.id,
        change_request: { opens_at: 800, closes_at: 1000, day: 'Sunday' },
      };

      // Check the hours section renders, and that a newly added schedule shows up
      cy.visit(page.url(serviceId))
        .get(page.SECTION_HOURS).first().should('exist')
        .get(page.SECTION_HOURS_ROWS).should('have.length', service.schedule?.schedule_days?.length)
        .request('POST', '/api/change_requests', cr).should(r => {
          expect(r.status).to.eq(201);
          expect(r.body.service).to.include.all.keys('id', 'status', 'field_chages');
        })
        .visit(page.url(serviceId))
        .get(page.SECTION_HOURS).first().should('exist')
        .get(page.SECTION_HOURS_ROWS)
          .should('have.length', service.schedule?.schedule_days?.length + 1)
          .should('contain.text', 'Sunday');

      // page.removeScheduleDays(service.schedule.schedule_days.filter(sd => sd.day === 'Sunday'))
      //   .then(d => {
      //   // console.log(d);
      // });

      // service.schedule.schedule_days.forEach(sd => {
      //   if (sd.day)
      // })
        // .request('POST', '/api/change_requests', )
    });
  });

  // it('should add to and remove days from the schedule', () => {
  //   // .get(page.SECTION_HOURS).first().should('exist')
  // });

  // it('should show other services at the same organization', () => {

  // });
});
