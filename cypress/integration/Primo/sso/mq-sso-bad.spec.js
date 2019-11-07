// SSO configuration details.
const ssoOkta = require("../../../fixtures/sso-okta-mq");

context("Showing what happens when we click on the Sign In link", () => {
    beforeEach(() => {
        cy.visit(ssoOkta.primoUrl);
    });

    it("shows outcome from Sign In click", () => {
        cy.get("button.user-button span").click();
    });
});
