Cypress.Commands.add('login', () => {
  cy.visit('/login')
  cy.get('#email').type('test@test.com')
  cy.get('#password').type('testaccount')
  cy.get('.col-md-12 > .btn-primary')
    .contains('Login').click()
})

Cypress.Commands.add('getReport', () => {
  cy.visit('/report/96a0fa1f-6a93-4947-8a69-9314f0592788')
  cy.get('#section_property > :nth-child(1)')
            .contains('The property')
            .should('be.visible')
})
