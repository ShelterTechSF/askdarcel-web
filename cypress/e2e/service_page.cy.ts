/// <reference types="cypress" />
import { ScheduleDay, Service } from '../../app/models';
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
    cy.request('POST', `/api/services/${serviceId}/change_requests`, {
      change_request,
    }).should((r) => {
      expect(r.status).to.eq(201);
    });

    cy.request<{ service: Service }>(`/api/services/${serviceId}`).should(
      (res) => {
        expect(res.status).to.eq(200);
        expect(res.body.service).to.include.all.keys(
          'id',
          'name',
          'long_description',
          'email',
          'application_process'
        );
      }
    );
  });

  it('should render basic about, details and contact sections', () => {
    cy.visit(page.url(serviceId))
      .get(page.BUTTON_PRINT)
      .should('exist')
      .get(page.BUTTON_DIRECTIONS)
      .should('exist')

      .get(page.SERVICE_TITLE)
      .should('contain.text', change_request.name)
      .get(page.SECTION_ABOUT)
      .should('exist')
      .get(page.SECTION_DETAILS)
      .should('contain.text', change_request.application_process)
      .get(page.SECTION_DETAILS)
      .should('contain.text', change_request.required_documents)
      .get(page.SECTION_CONTACT)
      .should('contain.text', change_request.email);
  });

  it('should render the locations and hours section, then add and remove a schedule_day', () => {
    // In Cypress' headless environment, Google Translate is intermittently throwing an uncaught
    // exception in this block and causing the tests to fail. The below disables Cypress' uncaught
    // exception event to avoid this problem. See: https://github.com/cypress-io/cypress/issues/2554
    cy.on('uncaught:exception', () => false);
    // Check the hours section renders, and that a newly added schedule shows up
    cy.visit(page.url(serviceId));
    // Intercept client's AJAX request to services endpoint and alias as "getServiceData". Pass
    // the alias to #wait method below to delay test execution until the request has returned
    cy.intercept('GET', `/api/services/${serviceId}`, (req) => {
      // Deleting "if-none-match" headers forces the intercept to make a fresh request rather than
      // potentially resolving a cached object
      delete req.headers['if-none-match'];
    }).as('getServiceData');

    cy.request(`/api/services/${serviceId}`).then(
      (res: Cypress.Response<{ service: Service }>) => {
        expect(res.status).to.eq(200);
        const { service } = res.body;

        // Ensure we already have schedule days
        cy.get(page.SECTION_HOURS)
          .should('exist')
          .get(page.SECTION_HOURS_ROWS)
          .should('have.length.above', 0);

        // Add a schedule day to the service
        const cr = page.scheduleDayChangeRequestBody(service.schedule.id, {
          opens_at: 800,
          closes_at: 1000,
          day: 'Sunday',
        });

        cy.request('POST', '/api/change_requests', cr)
          .its('status')
          .should('eq', 201)
          .reload(true)
          .wait('@getServiceData')
          .its('response.statusCode')
          .should('eq', 200)
          .get(page.SECTION_HOURS)
          .should('exist')
          .get(page.SECTION_HOURS_ROWS)
          .should('contain.text', 'Sunday')
          .should('contain.text', '8:00 AM - 10:00 AM');
      }
    );

    cy.request<{ service: Service }>(`/api/services/${serviceId}`).then(
      (res) => {
        expect(res.status).to.eq(200);
        const { service } = res.body;

        // Remove matching days from the service (and resource, to minimize brittleness)
        service.schedule.schedule_days
          .concat(service.resource.schedule.schedule_days)
          .filter(
            (d) =>
              d.day === 'Sunday' || (d.opens_at === 800 && d.closes_at === 1000)
          )
          .forEach((d) => {
            const change: Partial<ScheduleDay> = {
              closes_at: null,
              opens_at: null,
            };
            cy.request(
              'POST',
              `/api/schedule_days/${d.id}/change_requests`,
              change
            )
              .its('status')
              .should('eq', 201);
          });

        // Confirm we no longer show any Sundays or 8:00 to 10:00 times
        cy.reload(true)
          .wait('@getServiceData')
          .its('response.statusCode')
          .should('eq', 200)
          .get(page.SECTION_HOURS)
          .should('exist')
          .get(page.SECTION_HOURS_ROWS)
          .should('not.contain.text', 'Sunday')
          .should('not.contain.text', '8:00 AM - 10:00 AM');
      }
    );
  });
});
