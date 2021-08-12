/// <reference types="cypress" />

describe('Service Page', () => {
  const serviceId = 1;

  it('should load a basic page', async () => {
    cy.request(`/api/services/${serviceId}`).should(r => {
      expect(r.status).to.eq(200);
      expect(r.body.service).to.include.all.keys('id', 'name', 'long_description');

      cy.visit(`/services/${serviceId}`)
        .get('.listing--main header h1').first().should('have.text', r.body.service.name)
        .get('.listing--main--left--about').first().should('exist')
        .get('.listing--main--left--details').first().should('exist');
    });
  });
});
