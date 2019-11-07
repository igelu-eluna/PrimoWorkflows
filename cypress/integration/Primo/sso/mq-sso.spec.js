/* simple object with auth details:
{
    "username": "[username]",
    "password": "[password]",
    "displayName": "Display Name"
}
*/
const auth = require("../../../fixtures/secure/auth");

// SSO configuration details.
const ssoOkta = require("../../../fixtures/sso-okta-mq");

context("Checking that we can SSO into Primo", () => {
    before(() => {
        cy.ssoOkta(auth.username, auth.password, ssoOkta);
    });

    beforeEach(() => {
        cy.visit(ssoOkta.primoUrl);
    });

    it("has the correct display name on the Sign In box", () => {
        cy.get("span.user-name").contains(auth.displayName);
    });
});
