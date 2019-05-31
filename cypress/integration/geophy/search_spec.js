describe('/search', () => {
    beforeEach(() => {
        cy.login()
        cy.visit('/search')
    })

    const incorrectAddress = 'Cluj'
    const correctStreet = 'N. College Avenue'
    const correctStreetNo = '555'
    const correctCity = 'Tempe'
    const correctState = 'AZ'
    const correctZip = '85281'

    it('requires search data', () => {
        cy.get('#btn_address_full')
            .contains('Verify Address')
            .click()
        cy.on('window:alert', (str) => {
            expect(str).to.equal(`No address entered`)
        })
    })

    it('can have detailed search', () => {
        cy.get('#btn_address_parts')
            .should('be.visible')
            .click()
        cy.get('#number')
            .should('be.visible')
        cy.get('#btn_request_submit')
            .contains('GET REPORT')
            .should('be.visible')
    })

    it('matches searched zip code with city and state', () => {
        cy.get('#address_full').type(32007)
        cy.get('#btn_address_full')
            .contains('Verify Address')
            .click()
        cy.get('#state')
            .should('have.value', 'FL')
        cy.get('#city')
            .should('have.value', 'Bostwick')
    })

    it('matches searched city with state', () => {
        cy.get('#address_full').type('San Diego')
        cy.get('#btn_address_full')
            .contains('Verify Address')
            .click()
        cy.get('#state')
            .should('have.value', 'CA')
        cy.get('#zipcode')
            .should('have.value', '92101')
    })    

    it('cannot parse unexisting or incorrect address', () => {
        cy.get('#address_full').type(incorrectAddress)
        cy.get('#btn_address_full')
            .contains('Verify Address')
            .click()
        cy.get('#title_address_parse_error')
            .should('be.visible')
    })

    it('can search on full address', () => {
        cy.get('#address_full')
            .type(correctStreetNo + ' ' + correctStreet + ', ' + correctCity + ', ' + correctState + ', ' + correctZip)
        cy.get('#btn_address_full')
            .contains('Verify Address')
            .click()
        cy.get('#number')
            .should('have.value', correctStreetNo)
        cy.get('#street')
            .should('have.value', correctStreet)
        cy.get('#state')
            .should('have.value', correctState)
        cy.get('#city')
            .should('have.value', correctCity)
        cy.get('#zipcode')
            .should('have.value', correctZip)
    })

    it('returns to same search screen after searching incorrect address', () => {
        cy.get('#address_full').type(incorrectAddress)
        cy.get('#btn_address_full')
            .contains('Verify Address')
            .click()
        cy.get('#title_address_parse_error')
            .should('be.visible')
        cy.get('#modal_address_parse_error > .modal-dialog > .modal-content > .modal-header > .close > .pr-2 > img').click({ multiple: true })
        cy.get('#address_full')
            .should('be.visible')
    })

    it('requires mandatory fields to be filled', () => {
        cy.get('#btn_address_parts')
            .click()
        cy.get('#btn_request_submit')
            .contains('GET REPORT')
            .click()
        cy.get('.parsley-required')
            .should(($p) => {
                expect($p).to.have.length(5)
                expect($p).to.contain('This value is required.')
            })
        cy.get('.invalid-blocks-error-message')
            .should(($b) => {
                expect($b).to.have.length(1)
                expect($b).to.contain('At least one of these two address blocks are required.')
            })
    })

    it('can find report using all mandatory fields and only city address block', () => {
        cy.get('#btn_address_parts')
            .click()
        cy.get('#number').type('test')
        cy.get('#street').type('blabla')
        cy.get('#city').type('bla')
        cy.get('#number_of_units').type(22)
        cy.get('#year_built').type(2000)
        cy.get('#noi').type(500000)
        cy.get('#btn_request_submit')
            .contains('GET REPORT')
            .click()
        cy.get('.invalid-blocks-error-message')
            .should(($b) => {
                expect($b).to.have.length(0)
            })
    })

    it('can find report using all mandatory fields and only state address block', () => {
        cy.get('#btn_address_parts')
            .click()
        cy.get('#number').type('test')
        cy.get('#street').type('blabla')
        cy.get('#state').select('AZ')
        cy.get('#number_of_units').type(22)
        cy.get('#year_built').type(2000)
        cy.get('#noi').type(500000)
        cy.get('#btn_request_submit')
            .contains('GET REPORT')
            .click()
        cy.get('.invalid-blocks-error-message')
            .should(($b) => {
                expect($b).to.have.length(0)
            })
    })

    it('returns page that report does not exist', () => {
        cy.get('#btn_address_parts')
            .click()
        cy.get('#number').type('test')
        cy.get('#street').type('blabla')
        cy.get('#city').type('bla')
        cy.get('#state').select('AZ')
        cy.get('#number_of_units').type(22)
        cy.get('#year_built').type(2000)
        cy.get('#noi').type(500000)
        cy.get('#btn_request_submit')
            .contains('GET REPORT')
            .click()
        cy.url().should('eq', 'https://reval.geophy.com/error')
    })

    it('validates mandatory input data', () => {
        cy.get('#btn_address_parts')
            .click()
        cy.get('#number').type('test')
        cy.get('#street').type('blabla')
        cy.get('#city').type('bla')
        cy.get('#state').select('AZ')
        cy.get('#zipcode').type('12')
        cy.get('#number_of_units').type(1)
        cy.get('#year_built').type(12)
        cy.get('#noi').type(13)
        cy.get('#btn_request_submit')
            .contains('GET REPORT')
            .click()
        cy.get('.parsley-range')
            .should(($p) => {
                expect($p).to.have.length(3)
                expect($p).to.contain('This value should be between 5 and 1000.')
                expect($p).to.contain('This value should be between 1800 and 2019.')
                expect($p).to.contain('This value should be between 5000 and 10000000.')
            })
        cy.get('.parsley-minlength')
            .should(($p) => {
                expect($p).to.have.length(1)
                expect($p).to.contain('This value is too short. It should have 5 characters or more.')
            })
    })

    it('validates non mandatory input data', () => {
        cy.get('#btn_address_parts')
            .click()
        cy.get('#number').type('555')
        cy.get('#street').type('blabla')
        cy.get('#city').type('bla')
        cy.get('#state').select('AZ')
        cy.get('#zipcode').type('22001')
        cy.get('#number_of_units').type(200)
        cy.get('#year_built').type(2000)
        cy.get('#noi').type(500000)
        cy.get('#occupancy').type('3713')
        cy.get('#year_renovated').type('1200')
        cy.get('#btn_request_submit')
            .contains('GET REPORT')
            .click()
        cy.get('.parsley-range')
            .should(($p) => {
                expect($p).to.have.length(1)
                expect($p).to.contain('This value should be between 0 and 100.')
            })
        cy.get('.parsley-gt')
            .should(($p) => {
                expect($p).to.have.length(1)
                expect($p).to.contain('This value should be greater than 2000.')
            })
    })

    it('has history section', () => {
        cy.get('#navigation_app')
            .contains('HISTORY')
            .click()
        cy.get('#section_history')
        .should('be.visible')
        .should('contain', 'History')
    })

    it('can select first report from history', () => {
        let reportAddressText
        cy.get('#navigation_app')
            .contains('HISTORY')
            .click()
        cy.get('table').find('tr').as('rows')
        cy.get('@rows').eq(1).find('td').as('columns')
        cy.get('@columns').eq(2)
        .then(($reportAddress) => {
            reportAddressText = $reportAddress.text()
            cy.wrap($reportAddress).click()
            cy.get('.card-body > .row > :nth-child(2) > :nth-child(2)').should(($section) => {
                const text = $section.text()
                expect(text).to.include(reportAddressText)
            })           
        })
    })

})