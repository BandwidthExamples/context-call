describe('Basic Flow Test', function(){
    it('happy_path', function(){
        cy.visit('http://call-me-maybe.s3-website-us-west-2.amazonaws.com/')
        cy.server()
        cy.get('#company-number')
            .type('+18188793672')
            .should('have.value', '+18188793672')
        cy.get('#text-message')
            .type('here\'s my number so call me maybe.')
            .should('have.value', 'here\'s my number so call me maybe.')
        cy.get('#secret-key')
            .type('password')
            .should('have.value', 'password')
        cy.route({
            method: 'POST',      // Route all POST requests
            url: '/prod/ContextCallV1',    // THe URL the route is POSTing to
            response: [200]        // and force the response to be: []
        })
        cy.get(':nth-child(6) > :nth-child(5) > #submit-button').click()
    })
})