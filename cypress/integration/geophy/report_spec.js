describe('/report', () => {
    beforeEach(() => {
        cy.login()
        cy.visit('/search')
        cy.get('#btn_address_parts')
            .should('be.visible')
            .click()
    })

    const correctStreet = 'N. College Avenue'
    const correctStreetNo = '555'
    const correctCity = 'Tempe'
    const correctState = 'AZ'
    const correctZip = '85281'
    const correctUnits = '200'
    const correctYear = '2000'
    const correctNoi = '2000000'
    const correctNoiDecimals = '2,000,000'

    it('creates report when all mandatory fields are filled in except state', () => {
        cy.get('#number').type(correctStreetNo)
        cy.get('#street').type(correctStreet)
        cy.get('#city').type(correctCity)
        cy.get('#zipcode').type(correctZip)
        cy.get('#number_of_units').type(correctUnits)
        cy.get('#year_built').type(correctYear)
        cy.get('#noi').type(correctNoi)
        cy.get('#btn_request_submit')
            .contains('GET REPORT')
            .click()
        cy.visit('/report/96a0fa1f-6a93-4947-8a69-9314f0592788')
        cy.get('#section_property > :nth-child(1)')
            .contains('The property')
            .should('be.visible')
    })

    it('has correct address', () => {
        cy.getReport()
        cy.get('#section_property')
            .contains(correctStreetNo + ' ' + correctStreet + ', ' + correctCity + ', ' + correctState + ' ' + correctZip)
    })

    it('has correct value details', () => {
        cy.getReport()
        cy.get('tr').eq(0)
            .get('td').eq(0).should('contain', 'Number of units')
            .next().should('contain', correctUnits)
            .get('td').eq(6).should('contain', 'Year built')
            .next().should('contain', correctYear)
            .get('td').eq(12).should('contain', 'NOI (trailing 12 months)')
            .next().should('contain', correctNoiDecimals)
    })

    it('has property, location and market sections', () => {
        cy.getReport()
        cy.get('[role="tablist"]')
            .contains('Property & Income')
            .click()
        cy.get('#tab_property > div:nth-child(1) > div')
            .should('be.visible')
            .should('contain', 'Property & Income drivers')
        cy.get('[role="tablist"]')
            .contains('Location')
            .click()
        cy.get('#tab_location > div:nth-child(1) > div')
            .should('be.visible')
            .should('contain', 'Location drivers')
        cy.get('[role="tablist"]')
            .contains('Market')
            .click()
        cy.get('#tab_market > div:nth-child(1) > div')
            .should('be.visible')
            .should('contain', 'Market drivers')
    })

    it('has reach section', () => {
        cy.getReport()
        cy.get('#section_reach')
            .should('be.visible')
            .should('contain', 'Reach')
        cy.get('#map_reach')
            .should('be.visible')
    })

    it('has neighbourhood sections', () => {
        cy.getReport()
        
        cy.get('#section_neighborhood')
            .should('be.visible')
            .should('contain', 'Neighborhood')
        cy.get('#btn_tab_restaurants')
            .contains('Restaurants')
            .click()
        cy.get('#map_restaurants')
            .should('be.visible')
        cy.get('#map_restaurants > div > div > iframe')
            .should('be.visible')
        cy.get('#btn_tab_retail')
            .contains('Retail')
            .click()
        cy.get('#map_retail')
            .should('be.visible')
        cy.get('#btn_tab_education')
            .contains('Education')
            .click()
        cy.get('#map_education')
            .should('be.visible')
        cy.get('#btn_tab_transit')
            .contains('Transit')
            .click()
        cy.get('#map_transit')
            .should('be.visible')
        cy.get('#btn_tab_nightlife')
            .contains('Nightlife')
            .click()
        cy.get('#map_nightlife')
            .should('be.visible')
        cy.get('#btn_tab_crime')
            .contains('Crime')
            .click()
        cy.get('#map_crime')
            .should('be.visible')
    })
})