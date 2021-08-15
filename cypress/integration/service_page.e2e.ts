/// <reference types="cypress" />

import { ServicePageTestHelpers } from '../support/ServicePageTestHelpers';

describe('Service Page', () => {
  const page = new ServicePageTestHelpers();
  const serviceId = 1;

  it('should load a basic page', async () => {
    cy.request(`/api/services/${serviceId}`).should(r => {
      expect(r.status).to.eq(200);
      expect(r.body.service).to.include.all.keys('id', 'name', 'long_description');

      cy.visit(`/services/${serviceId}`)
        .get(page.SERVICE_TITLE).first().should('have.text', r.body.service.name)
        .get(page.SECTION_ABOUT).first().should('exist')
        .get(page.SECTION_DETAILS).first().should('exist');
    });
  });
});
