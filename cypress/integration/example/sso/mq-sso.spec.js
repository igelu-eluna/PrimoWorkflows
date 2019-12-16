/* simple object with auth details:
{
    "username": "[username]",
    "password": "[password]",
    "displayName": "Display Name"
}
*/

context("Checking that we can SSO into Primo", () => {
    before(function() {
        cy.fixture(Cypress.env("ORG") + "/secure/" + Cypress.env("USER")).then(function(data) {
            console.log(data);
        });
        cy.fixture(Cypress.env("ORG") + "/okta").as("configOkta");
        console.log(this.configOkta);
        cy.ssoOkta(this.user.username, this.user.password, this.configOkta);        
    });

    beforeEach(function() {
        cy.visit(this.configOkta.primoUrl);
    });

    it("has the correct display name on the Sign In box", function() {
        cy.get("span.user-name").contains(this.user.displayName);
    });
});
