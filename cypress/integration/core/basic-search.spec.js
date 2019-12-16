let fixtures = {};

context("Performing a basic search actions", () => {
    before(() => {
        ["primo"].map(fixture => {
            cy.fixture(Cypress.env("ORG") + "/" + fixture).then(fx => (fixtures[fixture] = fx));
        });
    });

    beforeEach(() => {
        cy.visit(fixtures["primo"].primoUrl);
    });

    it("performs a basic search", () => {
        cy.get("#searchBar").type("economics journal for economic theory and analysis");
        cy.get("div.search-actions").click();

        cy.get("div[data-facet-value='tlevel-available']").click();

        cy.get("span.results-count").should("contain", "38");
    });
});
