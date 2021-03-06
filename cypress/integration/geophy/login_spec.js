describe('/login', () => {
    beforeEach(() => {
        cy.visit('/login')
    })

    it('greets with Login', () => {
        cy.contains('h3', "LOGIN")
    })

    it('requires email', () => {
        cy.get('#password').type('testaccount{enter}')
        cy.get('.parsley-required')
            .should('be.visible')
            .should('contain', 'This value is required.')
    })

    it('requires password', () => {
        cy.get('#email').type('test@test.com')
        cy.get('.col-md-12 > .btn-primary')
            .contains('Login').click()
        cy.get('.parsley-required')
            .should('be.visible')
            .should('contain', 'This value is required.')
    })

    it('requires valid email', () => {
        cy.get('#email').type('test32@test.com')
        cy.get('#password').type('testaccount')
        cy.get('.col-md-12 > .btn-primary')
            .contains('Login').click()
        cy.get('.invalid-feedback')
            .should('be.visible')
            .should('contain', 'These credentials do not match our records.')
    })

    it('requires valid password', () => {
        cy.get('#email').type('test@test.com')
        cy.get('#password').type('testaccountXX')
        cy.get('.col-md-12 > .btn-primary')
            .contains('Login').click()
        cy.get('.invalid-feedback')
            .should('be.visible')
            .should('contain', 'These credentials do not match our records.')
    })

    it('requires a correct email address', () => {
        cy.get('#email').type('test')
        cy.get('#password').type('testaccount{enter}')
        cy.get('.parsley-type')
            .should('be.visible')
            .should('contain', 'This value should be a valid email.')
    })

    it('navigates to Search page', () => {
        cy.get('#email').type('test@test.com')
        cy.get('#password').type('testaccount')
        cy.get('.col-md-12 > .btn-primary')
            .contains('Login').click()
        cy.get('#address_full')
            .should('be.visible')
    })

    it('can Logout', () => {
        cy.get('#email').type('test@test.com')
        cy.get('#password').type('testaccount')
        cy.get('.col-md-12 > .btn-primary')
            .contains('Login').click()
        cy.get('#address_full')
            .should('be.visible')
        cy.get('#btn_app_dropdown_user')
            .click()
        cy.get('.dropdown-item')
            .contains('Log out')
            .click()
        cy.get('#home_intro')
            .should('be.visible')
            .should('contain', 'Reliable value assessments on demand')
    })
})
