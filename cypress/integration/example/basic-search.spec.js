const primoData = require("../../fixtures/primo-data");

context("Performing a basic search actions", () => {
    beforeEach(() => {
        cy.visit(primoData.primoUrl);
    });

    it("performs a basic search", () => {
        cy.get("#searchBar").type("economics journal for economic theory and analysis");
        cy.get("div.search-actions").click();

        cy.get("div[data-facet-value='tlevel-available']").click();

        cy.get("span.results-count").should("contain", "38");
    });
});
