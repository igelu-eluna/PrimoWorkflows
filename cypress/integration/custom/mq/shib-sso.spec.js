let fixtures = {};

context("Checking that we can SSO into Primo", () => {
    before(() => {
        // load fixtures, then do sso login.
        Cypress.Promise.all([
            cy.fixture(Cypress.env("ORG") + "/secure/" + Cypress.env("USER")).then(fx => (fixtures["user"] = fx)),
            cy.fixture(Cypress.env("ORG") + "/" + Cypress.env("AUTH")).then(fx => (fixtures["auth"] = fx))
        ]).then(() => {
            cy.authenticate(fixtures["user"].username, fixtures["user"].password, fixtures["auth"]);
        });
    });

    beforeEach(() => {
        cy.visit(fixtures["auth"].primoSearch);
    });

    it("has the correct display name on the Sign In box", () => {
        cy.get("span.user-name").contains(fixtures["user"].displayName);
    });

    it("has the correct display name on the Sign In box for a second test", () => {
        cy.get("span.user-name").contains(fixtures["user"].displayName);
    });
});
