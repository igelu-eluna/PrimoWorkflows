let fixtures = {};

context("Checking that we can SSO into Primo", () => {
    before(() => {
        Cypress.Promise.all([
            cy.fixture(Cypress.env("ORG") + "/secure/" + Cypress.env("USER")).then(fx => (fixtures["user"] = fx)),
            cy.fixture(Cypress.env("ORG") + "/" + Cypress.env("AUTH")).then(fx => (fixtures["auth"] = fx))
        ]).then(() => {
            cy.authenticate(fixtures["user"].username, fixtures["user"].password, fixtures["auth"]);
        });
    });

    it("has the correct display name on the Sign In box", () => {
        cy.visit(fixtures["auth"].primoSearch);
        cy.getCookies();
    });
});
