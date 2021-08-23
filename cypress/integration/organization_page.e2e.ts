/// <reference types="cypress" />
import { Organization } from '../../app/models';
import { OrganizationPageTestHelpers } from '../support/OrganizationPageTestHelpers';

describe('Organization Page', () => {
  const page = new OrganizationPageTestHelpers();
  const orgId = 1;
  // Set org info to ensure the page is consistent
  const change_request: Partial<Organization> = {
    id: orgId,
    name: 'Good Inc',
    email: 'contact@good-stuff.co',
  };

  it('should correctly set info with a change request', () => {
    cy.request('POST', `/api/resources/${orgId}/change_requests`, { change_request }).should(r => {
      expect(r.status).to.eq(201);
    });

    cy.request<{ resource: Organization }>(`/api/resources/${orgId}`).should(res => {
      expect(res.status).to.eq(200);
      expect(res.body.resource).to.include.all.keys('id', 'name', 'email');
    });
  });

  it('should render basic about, services, notes and info sections', () => {
    cy.visit(page.url(orgId))
      .get(page.ORG_TITLE).should('contain.text', change_request.name);
  });
});
