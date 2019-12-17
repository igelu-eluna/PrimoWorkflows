// SSO configuration details.

const configPrimo = require("../../../fixtures/" + Cypress.env("ORG") + "/primo");

context("Showing what happens when we click on the Sign In link", () => {
    beforeEach(() => {
        cy.visit(configPrimo.primoUrl);
    });

    it("shows outcome from Sign In click", () => {
        cy.get("button.user-button span").click();
    });
});
