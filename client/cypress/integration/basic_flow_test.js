describe('Basic Flow Test', function(){
    it('test1', function(){
        cy.visit('http://call-me-maybe.s3-website-us-west-2.amazonaws.com/')
        cy.get('#company-number')
            .type('+18186971390')
        cy.get('#customer-number')
            .type('+17023429757')
        cy.get('#text-message')
            .type('here\'s my number so call me maybe.')
        cy.get(':nth-child(4) > :nth-child(2) > .FlowItemContent-hJlKhy > .InputStyles-hMJoFY')
            .type('password')
        cy.get('#submit-button').click()
    })
})