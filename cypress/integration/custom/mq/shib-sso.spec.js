/* simple user object with auth details:
{
    "username": "[username]",
    "password": "[password]",
    "displayName": "Display Name"
}
*/

let fixtures = {};

context("Checking that we can SSO into Primo", () => {
    it("has the correct display name on the Sign In box", () => {
        Cypress.Promise.all([
            cy.fixture(Cypress.env("ORG") + "/secure/" + Cypress.env("USER")).then(fx => (fixtures["user"] = fx)),
            cy.fixture(Cypress.env("ORG") + "/" + Cypress.env("AUTH")).then(fx => (fixtures["auth"] = fx))
        ]).then(() => {
            cy.authenticate(fixtures["user"].username, fixtures["user"].password, fixtures["auth"]);
        });
    });
});
