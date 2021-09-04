/// <reference types="cypress" />
import {
 Organization, OrganizationParams, Service, ServiceParams,
} from '../../app/models';
import { OrganizationPageTestHelpers } from '../support/OrganizationPageTestHelpers';

describe('Organization Page', () => {
  const page = new OrganizationPageTestHelpers();
  const orgId = 1;
  // Set org info to ensure the page is consistent
  const change_request: OrganizationParams = {
    id: orgId,
    name: 'Good Inc',
    email: 'contact@good-stuff.co',
    website: 'good-stuff.co',
    long_description: 'Good Inc is a non-profit that seeks to help the community',
  };

  it('should correctly set info with a change request', () => {
    cy.request('POST', `/api/resources/${orgId}/change_requests`, { change_request }).should(r => {
      expect(r.status).to.eq(201);
    });

    cy.request<{ resource: Organization }>(`/api/resources/${orgId}`).should(res => {
      expect(res.status).to.eq(200);
      expect(res.body.resource).to.include.all.keys('id', 'name', 'email', 'notes');

      // Remove notes, so we can add a fresh one
      const { notes } = res.body.resource;
      notes.forEach(n => { cy.request('DELETE', `/api/notes/${n.id}`).its('status').should('eq', 204); });
    });
  });

  it('should render basic about, notes and info sections', () => {
    const note = 'There are good things here!';
    cy.request('POST', `/api/resources/${orgId}/notes`, { note: { note } }).its('status').should('eq', 201);

    cy.visit(page.url(orgId))
      .get(page.ORG_TITLE).should('contain.text', change_request.name)
      .get(page.ORG_ABOUT_SECTION).should('contain.html', '<h2>About This Organization</h2>')
      .get(page.ORG_ABOUT_SECTION).should('contain.text', change_request.long_description)
      .get(page.ORG_INFO_SECTION).should('contain.text', change_request.email)
      .get(page.ORG_INFO_SECTION).should('contain.text', change_request.website)
      .get(page.NOTES_SECTION).should('contain.text', note);
  });

  it('should render services section with multiple services', () => {
    cy.request<{ resource: Organization }>(`/api/resources/${orgId}`).should(res => {
      expect(res.status).to.eq(200);
      expect(res.body.resource).to.include.all.keys('id', 'name', 'email', 'services');

      // Remove all services and confirm the list is empty
      const { services } = res.body.resource;
      services.forEach(s => {
        cy.request('DELETE', `/api/services/${s.id}`).its('status').should('eq', 200);
      });
      cy.visit(page.url(orgId))
        .get(page.ORG_SERVICES_SECTION).should('contain.text', 'Services') // TODO We should hide the whole section, or show a message there are no services
        .get(page.ORG_SERVICES_LIST).should('not.exist');

      // Add some services and ensure they render
      const newServices: ServiceParams[] = [
        {
          id: -2,
          name: 'Lunch Service',
          fee: '$1',
          schedule: { schedule_days: [] },
          shouldInheritScheduleFromParent: true,
        },
        {
          id: -3,
          name: 'Warm Bed',
          notes: [{ note: 'This is a note' }],
          schedule: { schedule_days: [] },
          shouldInheritScheduleFromParent: true,
        },
        {
          id: -4,
          name: 'Counselling',
          notes: [{ note: 'Only available Moday and Tuesdays' }],
          schedule: { schedule_days: [{ day: 'Monday', opens_at: 0, closes_at: 2359 }, { day: 'Tuesday', opens_at: 0, closes_at: 2359 }] },
          shouldInheritScheduleFromParent: false,
        },
      ];
      cy.request<{ services: Service[] }>('POST', `/api/resources/${orgId}/services`, { services: newServices }).its('status').should('eq', 201);
      cy.visit(page.url(orgId))
        .get(page.ORG_SERVICES_SECTION).should('contain.text', 'Services')
        .get(page.ORG_SERVICES_LIST).should('exist')
        .get(page.ORG_SERVICES_LIST_ITEM).should(items => {
          expect(items).to.have.length(3);
          // TODO Verify the info ad schedules of sections here
        });
    });
  });

  // it('should render the location section with a schedule', () => {
  //   // TODO
  // });
});
