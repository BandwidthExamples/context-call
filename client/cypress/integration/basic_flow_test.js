describe('Basic Flow Test', function(){
    it('test1', function(){
        cy.visit('http://call-me-maybe.s3-website-us-west-2.amazonaws.com/')
        cy.get('#company-number')

    })
})