/// <reference types="cypress" />
import { RiCreativeCommonsZeroLine } from 'react-icons/ri';
import { Service, ChangeRequestParams } from '../../app/models';
import { ServicePageTestHelpers } from '../support/ServicePageTestHelpers';

describe('Service Page', () => {
  const page = new ServicePageTestHelpers();
  const serviceId = 1;
  // Set service info to ensure the page is consistent
  const change_request: Partial<Service> = {
    id: serviceId,
    name: 'Free Lunch',
    email: 'foo@mega.corp',
    application_process: 'Walk-ins welcome',
    required_documents: 'Photo ID',
  };

  it('should correctly set info with a change request', () => {
    cy.request('POST', `/api/services/${serviceId}/change_requests`, { change_request }).should(r => {
      expect(r.status).to.eq(201);
    });

    cy.request(`/api/services/${serviceId}`).should((res: Cypress.Response<{ service: Service }>) => {
      expect(res.status).to.eq(200);
      expect(res.body.service).to.include.all.keys('id', 'name', 'long_description', 'email', 'application_process');
    });
  });

  it('should render basic about, details and contact sections', () => {
    cy.visit(page.url(serviceId))
      .get(page.BUTTON_PRINT).should('exist')
      .get(page.BUTTON_DIRECTIONS).should('exist')

      .get(page.SERVICE_TITLE).first().should('contain.text', change_request.name)
      .get(page.SECTION_ABOUT).first().should('exist')
      .get(page.SECTION_DETAILS).first().should('contain.text', change_request.application_process)
      .get(page.SECTION_DETAILS).first().should('contain.text', change_request.required_documents)
      .get(page.SECTION_CONTACT).first().should('contain.text', change_request.email);
  });

  it('should render the locations and hours section, then add and remove a schedule_day', () => {
    // Check the hours section renders, and that a newly added schedule shows up
    cy.visit(page.url(serviceId))
      .request(`/api/services/${serviceId}`).should((res: Cypress.Response<{ service: Service }>) => {
        expect(res.status).to.eq(200);
        const { service } = res.body;

        // Ensure we already have schedule days
        cy.get(page.SECTION_HOURS).first().should('exist')
          .get(page.SECTION_HOURS_ROWS).should('have.length.above', 0);

        // Add a schedule day to the service
        const cr = page.scheduleDayChangeRequestBody(
          service.schedule.id,
          { opens_at: 800, closes_at: 1000, day: 'Sunday' },
        );
        cy.request('POST', '/api/change_requests', cr).its('status').should('eq', 201)
          .visit(page.url(serviceId))
          .get(page.SECTION_HOURS).first().should('exist')
          .get(page.SECTION_HOURS_ROWS)
            // .should('have.length', service.schedule?.schedule_days?.length + 1)
            .should('contain.text', 'Sunday')
            .should('contain.text', '8:00 AM - 10:00 AM');
      });

    cy.request(`/api/services/${serviceId}`).should((res: Cypress.Response<{ service: Service }>) => {
        expect(res.status).to.eq(200);
        const { service } = res.body;

        // Remove matching days from the service (and resource, to minimize brittleness)
        service.schedule.schedule_days
          .concat(service.resource.schedule.schedule_days)
          .filter(d => d.day === 'Sunday' || (d.opens_at === 800 && d.closes_at === 1000))
          .forEach(d => {
            cy.request('POST', `/api/schedule_days/${d.id}/change_requests`, { closes_at: null, opens_at: null })
              .its('status').should('eq', 201);
          });

        // Confirm we no longer show any Sundays or 8:00 to 10:00 times
        cy.visit(page.url(serviceId))
          .get(page.SECTION_HOURS).first().should('exist')
          .get(page.SECTION_HOURS_ROWS)
            .should('not.contain.text', 'Sunday')
            .should('not.contain.text', '8:00 AM - 10:00 AM');
      });
  });
});
