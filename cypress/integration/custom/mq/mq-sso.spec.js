/* simple user object with auth details:
{
    "username": "[username]",
    "password": "[password]",
    "displayName": "Display Name"
}
*/

let fixtures = {};

context("Checking that we can SSO into Primo", () => {
    before(() => {
        // load fixtures, then do sso login.
        Cypress.Promise.all([
            cy.fixture(Cypress.env("ORG") + "/secure/" + Cypress.env("USER")).then(fx => (fixtures["user"] = fx)),
            cy.fixture(Cypress.env("ORG") + "/okta").then(fx => (fixtures["okta"] = fx))
        ]).then(() => {
            cy.ssoOkta(fixtures["user"].username, fixtures["user"].password, fixtures["okta"]);
        });
    });

    beforeEach(() => {
        cy.visit(fixtures["okta"].primoUrl);
    });

    it("has the correct display name on the Sign In box", () => {
        cy.get("span.user-name").contains(fixtures["user"].displayName);
    });
});
